import express, { Router } from 'express';
import { getPosts } from './controllers/getPostsController';
import { createPost } from './controllers/createPostController';
import { getPostById } from './controllers/getPostByIdController';
import { toggleLike } from './controllers/toggleLikeController';
import { addComment } from './controllers/addCommentController';
import { protect, optionalProtect } from '../../shared/middleware/authClerkTokenMiddleware';

import { getEvents } from './controllers/getEventsController';
import { getSpotlight } from './controllers/getSpotlightController';
import { toggleRSVP } from './controllers/toggleRSVPController';

import { getStats } from './controllers/getStatsController';
import { getUserProfile } from './controllers/getUserProfileController';
import { toggleFollow } from './controllers/followController';
import { createStory, getAllStories, toggleLikeStory } from './controllers/storyController';
import { getNotifications, markAsRead } from './controllers/notificationController';
import { getMessageHistory, sendMessage } from './controllers/messageController';

const route: Router = express.Router();

/**
 * @route GET /api/v1/community/posts
 * @desc Get all community posts with optional filtering
 * @access Public
 */
route.get('/posts', getPosts);

/**
 * @route POST /api/v1/community/posts
 * @desc Create a new community post
 * @access Private
 */
route.post('/posts', protect, createPost);

/**
 * @route GET /api/v1/community/posts/:id
 * @desc Get a specific community post by ID
 * @access Public
 */
route.get('/posts/:id', getPostById);

/**
 * @route POST /api/v1/community/like
 * @desc Toggle like on a post or comment
 * @access Private
 */
route.post('/like', protect, toggleLike);

/**
 * @route POST /api/v1/community/comments
 * @desc Add a comment to a post
 * @access Private
 */
route.post('/comments', protect, addComment);

/**
 * @route GET /api/v1/community/events
 * @desc Get upcoming community events
 * @access Public
 */
route.get('/events', getEvents);

/**
 * @route POST /api/v1/community/rsvp
 * @desc Toggle RSVP for an event
 * @access Private
 */
route.post('/rsvp', protect, toggleRSVP);

/**
 * @route GET /api/v1/community/spotlight
 * @desc Get the active member spotlight
 * @access Public
 */
route.get('/spotlight', getSpotlight);

/**
 * @route GET /api/v1/community/stats
 * @desc Get community statistics
 * @access Public
 */
route.get('/stats', getStats);

/**
 * @route GET /api/v1/community/profile/:clerkUserId
 * @desc Get user profile and activity
 * @access Public/Private
 */
route.get('/profile/:clerkUserId', optionalProtect, getUserProfile);

/**
 * @route POST /api/v1/community/follow
 * @desc Toggle follow for a user
 * @access Private
 */
route.post('/follow', protect, toggleFollow);

/**
 * @route GET /api/v1/community/stories
 * @desc Get all travel stories
 * @access Public
 */
route.get('/stories', getAllStories);

/**
 * @route POST /api/v1/community/stories
 * @desc Create a new travel story
 * @access Private
 */
route.post('/stories', protect, createStory);

route.post('/stories/:storyId/like', protect, toggleLikeStory);

/**
 * @route GET /api/v1/community/notifications
 * @desc Get user notifications
 * @access Private
 */
route.get('/notifications', protect, getNotifications);

/**
 * @route PATCH /api/v1/community/notifications/:notificationId
 * @desc Mark notification as read
 * @access Private
 */
route.patch('/notifications/:notificationId', protect, markAsRead);

/**
 * @route GET /api/v1/community/messages/:otherClerkUserId
 * @desc Get message history with a user
 * @access Private
 */
route.get('/messages/:otherClerkUserId', protect, getMessageHistory);

/**
 * @route POST /api/v1/community/messages
 * @desc Send a direct message
 * @access Private
 */
route.post('/messages', protect, sendMessage);

export default route;
