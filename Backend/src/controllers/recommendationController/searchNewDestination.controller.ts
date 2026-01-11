import chalk from "chalk";
import { getReasonPhrase, StatusCodes } from "http-status-codes";
import { Request, Response } from "express";

import { groqGeneratedData } from "../../services/groq.service";
import generateNewSearchDestinationPrompt, {
  SearchNewDestinationPromptData,
} from "../../utils/gemini/generatePromptForSearchNewDestinations";

import winstonLogger from "../../services/winston.service";
import getFullURL from "../../services/getFullURL.service";
import { fetchUnsplashImage } from "../../services/unsplash.service";
import { fetchWikipediaImage } from "../../services/wikipedia.service";
import Plan from "../../database/models/planModel";
import { IPlan } from "../../dtos/PlansDTO";
import User from "../../database/models/userModel";

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
    } = req.body;

    // 🔐 1. Validate required fields
    if (!to || !from || !date || !travelers || !budget) {
      winstonLogger.error(`URL: ${fullUrl} - Missing required fields`);
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
    };

    const prompt = generateNewSearchDestinationPrompt(promptData);

    // 4. Call Groq AI Service
    const generatedData = await groqGeneratedData(prompt);

    // 🧼 5. Clean and Parse AI response (Extract JSON object from string)
    const startIndex = generatedData.indexOf("{");
    const endIndex = generatedData.lastIndexOf("}");
    const cleanString = generatedData.substring(startIndex, endIndex + 1);
    const aiResponse = JSON.parse(cleanString);

    // 🌐 5.5 Fetch Image with Fallback Strategy
    // Strategy: Wikipedia (Reliable/Specific) -> Unsplash (High Quality) -> AI (Fallback)
    const searchQuery = aiResponse.name || to;

    let destinationImage = await fetchWikipediaImage(searchQuery);

    if (!destinationImage) {
      console.log(chalk.yellow(`Wikipedia failed for ${searchQuery}, trying Unsplash...`));
      destinationImage = await fetchUnsplashImage(searchQuery);
    }

    // 🧩 6. Construct Plan Data Object (Merge Input + AI Output)
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
      ai_score: aiResponse.ai_score,
      image_url: destinationImage || aiResponse.image_url, // Use our fetched image, or fallback to AI's
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
    };

    // 🔎 7. Check for Duplicate Plans (Prevent regenerating identical trips)
    const existingPlan = await Plan.findOne({
      clerkUserId,
      to,
      from,
      date,
      budget,
    });

    if (existingPlan) {
      winstonLogger.info(`URL: ${fullUrl} - Plan already exists`);
      return res.status(StatusCodes.OK).json({
        status: "Ok",
        message: "Plan already exists",
        data: existingPlan,
      });
    }

    // 8. Find User in DB to link plan
    const user = await User.findOne({ clerkUserId });

    if (!user) {
      winstonLogger.info(`URL: ${fullUrl} - User not found`);
      return res.status(StatusCodes.NOT_FOUND).json({
        status: "Failed",
        message: "User not found",
      });
    }

    planData.userId = user._id;

    // 💾 9. Save New Plan to Database
    const newPlan = new Plan(planData);
    await newPlan.save();

    // ✅ 10. Send Success Response
    winstonLogger.info(`URL: ${fullUrl} - Plan generated successfully`);
    return res.status(StatusCodes.OK).json({
      status: "Ok",
      message: "Generated",
      data: newPlan,
    });
  } catch (error: any) {
    console.log(chalk.bgRed("Internal Server Error"));
    console.log(error);

    winstonLogger.error(
      `URL: ${fullUrl}, error_message: ${error.message}`
    );

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "Failed",
      message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
    });
  }
};

export default searchNewDestination;