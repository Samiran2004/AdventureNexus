import { getReasonPhrase, StatusCodes } from "http-status-codes";
import { Request, Response } from "express";

import { groqGeneratedData } from "../../../shared/services/groq.service";
import generateNewSearchDestinationPrompt, {
  SearchNewDestinationPromptData,
} from "../../../shared/utils/gemini/generatePromptForSearchNewDestinations";

import logger from "../../../shared/utils/logger";
import getFullURL from "../../../shared/services/getFullURL.service";
import { fetchUnsplashImage } from "../../../shared/services/unsplash.service";
import { fetchWikipediaImage } from "../../../shared/services/wikipedia.service";
import Plan from "../../../shared/database/models/planModel";
import { IPlan } from "../../../shared/dtos/PlansDTO";
import User from "../../../shared/database/models/userModel";
import Hotel from "../../../shared/database/models/hotelModel";
import Room from "../../../shared/database/models/roomModel";
import Flight from "../../../shared/database/models/flightModel";
import { cacheService, CACHE_CONFIG } from "../../../shared/utils/cacheService";

const searchNewDestination = async (req: Request, res: Response) => {
  const fullUrl = getFullURL(req);

  try {
    const {
      to,
      from,
      date,
      travelers,
      budget,
      budget_range,
      activities,
      travel_style,
      duration // Extract duration
    } = req.body;

    // 🔐 1. Validate required fields
    if (!to || !from || !date || !travelers || !budget) {
      logger.error(`URL: ${fullUrl} - Missing required fields`);
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "Failed",
        message: "Provide all required fields!",
      });
    }

    // ✅ 2. GET CLERK USER ID
    const clerkUserId = req.auth()?.userId;

    if (!clerkUserId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: "Failed",
        message: "Unauthorized: Clerk user not found",
      });
    }

    // 🕒 2.5 Check Cache
    const prefix = CACHE_CONFIG.PREFIX.SEARCH;
    const identifier = `${to}:${from}:${date}:${travelers}:${budget}:${budget_range}:${duration || 'standard'}`;

    const cachedPlans = await cacheService.get<any[]>(prefix, identifier);
    if (cachedPlans) {
      logger.info(`URL: ${fullUrl} - Cache HIT for search`);
      return res.status(StatusCodes.OK).json({
        status: "Ok",
        message: "Generated (Cached)",
        data: cachedPlans,
      });
    }

    // 🧠 3. Generate AI prompt with user preferences
    const promptData: SearchNewDestinationPromptData = {
      to,
      from,
      date,
      travelers,
      budget,
      budget_range,
      activities,
      travel_style,
      duration, // Pass duration
    };

    const prompt = generateNewSearchDestinationPrompt(promptData);

    // 4. Call Groq AI Service
    const generatedData = await groqGeneratedData(prompt);

    // 🧼 5. Clean and Parse AI response (Extract JSON Object with Self-Repair)
    let aiResponseArray: any[] = [];
    try {
      let startIndex = generatedData.indexOf("{");
      let endIndex = generatedData.lastIndexOf("}");

      if (startIndex === -1 || endIndex === -1) {
        throw new Error("No JSON object found in AI response");
      }

      let cleanString = generatedData.substring(startIndex, endIndex + 1);

      // --- SELF-REPAIR LOGIC ---
      // 1. Fix missing quotes around property values that look like place names with hyphens/special chars
      cleanString = cleanString.replace(/"name":\s*([^",}\]]+)/g, (match, p1) => {
        if (!p1.trim().startsWith('"')) return `"name": "${p1.trim()}"`;
        return match;
      });

      // 2. Fix missing commas between properties (Common LLM error)
      // Matches a value (quote, digit) followed by a newline/space and then a new key, without a comma
      cleanString = cleanString.replace(/("|\d|true|false|null|\]|\})\s*(?!\s*,)(\n\s*)"([^"]+)":/g, '$1,$2"$3":');

      try {
        const aiResponseObject = JSON.parse(cleanString);
        aiResponseArray = aiResponseObject.plans || [];
        if (!Array.isArray(aiResponseArray)) {
          aiResponseArray = Array.isArray(aiResponseObject) ? aiResponseObject : [];
        }
      } catch (firstPassError) {
        logger.warn(`Search: First parse failed, trying aggressive cleaning...`);
        // Remove trailing commas before closing braces/brackets
        const ultraClean = cleanString.replace(/,\s*([}\]])/g, '$1');
        // Final attempt: fix unescaped quotes in middle of strings (Dangerous but sometimes works)
        const finalClean = ultraClean.replace(/:\s*"(.+?)"\s*(,|})/g, (match, p1, p2) => {
          return `: "${p1.replace(/"/g, '\\"')}"${p2}`;
        });

        const aiResponseObject = JSON.parse(finalClean);
        aiResponseArray = aiResponseObject.plans || [];
      }
    } catch (parseError: any) {
      logger.error(`JSON Parse Error: ${parseError.message}. Content: ${generatedData.substring(0, 200)}...`);
      throw new Error(`AI generated invalid data: ${parseError.message}`);
    }

    if (aiResponseArray.length === 0) {
      throw new Error("AI response contains no plans");
    }

    // 🌐 5.5 Process each plan in the array (Fetch Images & Construct Objects)
    const processedPlans = await Promise.all(aiResponseArray.map(async (aiResponse: any) => {
      // Strategy: Wikipedia -> Unsplash -> AI -> Hardcoded Fallback
      const searchQuery = aiResponse.name || to;
      let destinationImage: string | undefined;
      let source = "none";

      try {
        destinationImage = await fetchWikipediaImage(searchQuery);
        if (destinationImage) source = "Wikipedia";

        if (!destinationImage) {
          destinationImage = await fetchUnsplashImage(searchQuery);
          if (destinationImage) source = "Unsplash";
        }
      } catch (imgError) {
        logger.error(`Image Fetch Error for ${searchQuery}:`, imgError);
      }

      // Final URI Encoding & AI Fallback logic
      let finalImageUrl = destinationImage || aiResponse.image_url;

      if (finalImageUrl) {
        try {
          // Simplest robust encoding
          if (finalImageUrl.startsWith('//')) finalImageUrl = 'https:' + finalImageUrl;
          const urlObj = new URL(finalImageUrl);
          finalImageUrl = urlObj.toString(); // Standard URL string is already reasonably encoded
        } catch (e) {
          finalImageUrl = encodeURI(finalImageUrl);
        }
      }

      // STRICT FALLBACK: Ensure the card NEVER has a missing image
      if (!finalImageUrl || finalImageUrl.length < 10) {
        const fallbacks = [
          "https://images.unsplash.com/photo-1488646953014-85cb44e25828",
          "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1",
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
        ];
        finalImageUrl = fallbacks[Math.floor(Math.random() * fallbacks.length)] + "?w=1000&auto=format&fit=crop";
        source = "High-Quality Placeholder";
      }

      logger.info(`Search: Source [${source}] for "${searchQuery}" -> URL: ${finalImageUrl}`);

      // Construct Plan Data
      const planData: IPlan = {
        clerkUserId,
        to,
        from,
        date,
        travelers,
        budget,
        budget_range,
        activities,
        travel_style,

        // AI generated fields
        ai_score: typeof aiResponse.ai_score === 'string' ? parseFloat(aiResponse.ai_score.replace('%', '')) : aiResponse.ai_score,
        image_url: finalImageUrl,
        name: aiResponse.name,
        days: aiResponse.days,
        cost: aiResponse.cost,
        star: aiResponse.star,
        total_reviews: aiResponse.total_reviews,
        destination_overview: aiResponse.destination_overview,
        perfect_for: Array.isArray(aiResponse.perfect_for) ? aiResponse.perfect_for : [],
        budget_breakdown: aiResponse.budget_breakdown,
        trip_highlights: Array.isArray(aiResponse.trip_highlights) ? aiResponse.trip_highlights : [],
        suggested_itinerary: Array.isArray(aiResponse.suggested_itinerary) ? aiResponse.suggested_itinerary : [],
        local_tips: Array.isArray(aiResponse.local_tips) ? aiResponse.local_tips : [],
        how_to_reach: aiResponse.how_to_reach,
        hotel_options: aiResponse.hotel_options, // Temporary storage for processing
        flight_options: aiResponse.flight_options, // Temporary storage for processing
        userId: null // Will attach user below if needed, or we can look it up here
      };

      return planData;
    }));


    // 8. Find User in DB to link plan
    const user = await User.findOne({ clerkUserId });

    if (!user) {
      logger.info(`URL: ${fullUrl} - User not found`);
      return res.status(StatusCodes.NOT_FOUND).json({
        status: "Failed",
        message: "User not found",
      });
    }

    // Save all plans and attach user ID
    const savedPlans = await Promise.all(processedPlans.map(async (planData) => {
      // Check for duplicates before saving (Plan level)
      const existingPlan = await Plan.findOne({
        clerkUserId,
        name: planData.name, // check specific destination name
        date,
        budget
      });

      if (existingPlan) {
        return existingPlan;
      }

      planData.userId = user._id;

      // --- SAVE HOTELS & ROOMS ---
      const hotelRefs = [];
      if (planData.hotel_options) {
        for (const hotelData of (planData as any).hotel_options) {
          // Save Rooms first
          const roomRefs = [];
          if (hotelData.rooms) {
            for (const roomData of hotelData.rooms) {
              const newRoom = new Room({
                ...roomData,
                capacity: roomData.capacity || { adults: 2, children: 0 }
              });
              const savedRoom = await newRoom.save();
              roomRefs.push(savedRoom._id);
            }
          }

          // Normalize Location
          let location = hotelData.location;
          if (typeof location === 'string') {
            location = { address: location, city: planData.to, country: planData.to };
          }

          const newHotel = new Hotel({
            ...hotelData,
            location: {
              address: location?.address || "Street Address",
              city: location?.city || planData.to,
              state: location?.state || "N/A",
              country: location?.country || planData.to,
              zipCode: location?.zipCode || "12345",
              geo: { type: 'Point', coordinates: [0, 0] }
            },
            rooms: roomRefs
          });
          const savedHotel = await newHotel.save();
          hotelRefs.push(savedHotel._id);
        }
      }

      // --- SAVE FLIGHTS ---
      const flightRefs = [];
      if (planData.flight_options) {
        for (const flightData of (planData as any).flight_options) {
          const newFlight = new Flight({
            ...flightData,
            from: planData.from,
            to: planData.to
          });
          const savedFlight = await newFlight.save();
          flightRefs.push(savedFlight._id);
        }
      }

      const newPlan = new Plan({
        ...planData,
        hotels: hotelRefs,
        flights: flightRefs
      });
      await newPlan.save();
      return newPlan;
    }));

    // 🕒 9.5 Store in Cache (TTL: 1 hour)
    await cacheService.set(prefix, identifier, savedPlans);

    // ✅ 10. Send Success Response
    logger.info(`URL: ${fullUrl} - Plans generated successfully`);
    return res.status(StatusCodes.OK).json({
      status: "Ok",
      message: "Generated",
      data: savedPlans, // Return array of plans
    });
  } catch (error: any) {
    logger.error("Internal Server Error", error);

    logger.error(
      `URL: ${fullUrl}, error_message: ${error.message}`
    );

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "Failed",
      message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
    });
  }
};

export default searchNewDestination;