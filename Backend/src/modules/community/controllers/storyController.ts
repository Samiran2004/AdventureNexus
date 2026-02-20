import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import TravelStory from '../../../shared/database/models/travelStoryModel';
import logger from '../../../shared/utils/logger';

/**
 * Controller to create a new travel story.
 */
export const createStory = async (req: Request, res: Response) => {
    try {
        const { title, content, location, images } = req.body;
        const userId = req.user?._id;
        const clerkUserId = req.user?.clerkUserId;

        if (!title || !content || !location) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: 'Title, content, and location are required'
            });
        }

        const newStory = await TravelStory.create({
            userId,
            clerkUserId,
            title,
            content,
            location,
            images: images || []
        });

        logger.info(`New travel story created: ${newStory._id} by ${clerkUserId}`);

        return res.status(StatusCodes.CREATED).json({
            success: true,
            data: newStory
        });
    } catch (error: any) {
        logger.error(`Error creating travel story: ${error.message}`);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to create travel story'
        });
    }
};

/**
 * Controller to fetch all travel stories.
 */
export const getAllStories = async (req: Request, res: Response) => {
    try {
        const { search, location } = req.query;
        let query: any = {};

        if (location) {
            query.location = { $regex: location, $options: 'i' };
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } }
            ];
        }

        const stories = await TravelStory.find(query)
            .sort({ createdAt: -1 })
            .populate('userId', 'username profilepicture fullname');

        return res.status(StatusCodes.OK).json({
            success: true,
            data: stories
        });
    } catch (error: any) {
        logger.error(`Error fetching travel stories: ${error.message}`);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch travel stories'
        });
    }
};

/**
 * Controller to toggle like on a travel story.
 */
export const toggleLikeStory = async (req: Request, res: Response) => {
    try {
        const { storyId } = req.params;
        const clerkUserId = req.user?.clerkUserId;

        const story = await TravelStory.findById(storyId);

        if (!story) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: 'Story not found'
            });
        }

        const isLiked = story.likes.includes(clerkUserId as string);

        if (isLiked) {
            story.likes = story.likes.filter(id => id !== clerkUserId);
        } else {
            story.likes.push(clerkUserId as string);
        }

        await story.save();

        return res.status(StatusCodes.OK).json({
            success: true,
            data: {
                likesCount: story.likes.length,
                isLiked: !isLiked
            }
        });
    } catch (error: any) {
        logger.error(`Error toggling story like: ${error.message}`);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to toggle like'
        });
    }
};
