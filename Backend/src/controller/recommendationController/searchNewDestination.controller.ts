import chalk from "chalk";
import { getReasonPhrase, StatusCodes } from "http-status-codes";
import { Request, Response } from "express";

import { groqGeneratedData } from "../../service/groq.service";
import generateNewSearchDestinationPrompt, {
  SearchNewDestinationPromptData,
} from "../../utils/Gemini Utils/generatePromptForSearchNewDestinations";

import winstonLogger from "../../service/winston.service";
import getFullURL from "../../service/getFullURL.service";
import Plan from "../../Database/models/planModel";
import { IPlan } from "../../Database/DTOs/PlansDTO";
import User from "../../Database/models/userModel";

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

    // 🔐 Validate required fields
    if (!to || !from || !date || !travelers || !budget) {
      winstonLogger.error(`URL: ${fullUrl} - Missing required fields`);
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "Failed",
        message: "Provide all required fields!",
      });
    }

    // ✅ GET CLERK USER ID (CORRECT WAY)
    const clerkUserId = req.auth()?.userId;

    if (!clerkUserId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: "Failed",
        message: "Unauthorized: Clerk user not found",
      });
    }

    // 🧠 Generate AI prompt
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
    const generatedData = await groqGeneratedData(prompt);

    // 🧼 Clean AI response
    const startIndex = generatedData.indexOf("{");
    const endIndex = generatedData.lastIndexOf("}");
    const cleanString = generatedData.substring(startIndex, endIndex + 1);
    const aiResponse = JSON.parse(cleanString);

    // 🧩 MERGE USER INPUT + AI DATA
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
      image_url: aiResponse.image_url,
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

    // 🔎 CHECK IF PLAN ALREADY EXISTS
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

    // Find user
    const user = await User.findOne({ clerkUserId });

    if (!user) {
      winstonLogger.info(`URL: ${fullUrl} - User not found`);
      return res.status(StatusCodes.NOT_FOUND).json({
        status: "Failed",
        message: "User not found",
      });
    }

    planData.userId = user._id;

    // 💾 SAVE PLAN
    const newPlan = new Plan(planData);
    await newPlan.save();

    // ✅ SUCCESS RESPONSE
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