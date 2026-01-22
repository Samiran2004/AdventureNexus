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

    // 🧼 5. Clean and Parse AI response (Extract JSON Array from string)
    const startIndex = generatedData.indexOf("[");
    const endIndex = generatedData.lastIndexOf("]");
    const cleanString = generatedData.substring(startIndex, endIndex + 1);
    const aiResponseArray = JSON.parse(cleanString);

    if (!Array.isArray(aiResponseArray)) {
      throw new Error("AI response is not an array");
    }

    // 🌐 5.5 Process each plan in the array (Fetch Images & Construct Objects)
    const processedPlans = await Promise.all(aiResponseArray.map(async (aiResponse: any) => {
      // Strategy: Wikipedia (Reliable/Specific) -> Unsplash (High Quality) -> AI (Fallback)
      const searchQuery = aiResponse.name || to;

      let destinationImage = await fetchWikipediaImage(searchQuery);

      if (!destinationImage) {
        logger.warn(`Wikipedia failed for ${searchQuery}, trying Unsplash...`);
        destinationImage = await fetchUnsplashImage(searchQuery);
      }

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
        image_url: destinationImage || aiResponse.image_url,
        name: aiResponse.name,
        days: aiResponse.days,
        cost: aiResponse.cost,
        star: aiResponse.star,
        total_reviews: aiResponse.total_reviews,
        destination_overview: aiResponse.destination_overview,
        perfect_for: aiResponse.perfect_for,
        budget_breakdown: aiResponse.budget_breakdown,
        trip_highlights: aiResponse.trip_highlights,
        suggested_itinerary: aiResponse.suggested_itinerary,
        local_tips: aiResponse.local_tips,
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
      const newPlan = new Plan(planData);
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