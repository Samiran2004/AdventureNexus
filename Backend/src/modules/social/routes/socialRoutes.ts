import { Router } from 'express';
import * as socialController from '../controllers/socialController';
import * as friendshipController from '../controllers/friendshipController';
import * as notificationController from '../controllers/notificationController';
import { protect } from '../../../shared/middleware/authClerkTokenMiddleware';

const router = Router();

// User search and public profile
router.get('/search', protect, socialController.searchUsers);
router.get('/profile/:username', protect, socialController.getUserProfile);
router.post('/follow/:targetId', protect, socialController.toggleFollow);

// Friend system
router.post('/friend-request', protect, friendshipController.sendFriendRequest);
router.post('/accept-request', protect, friendshipController.acceptFriendRequest);
router.get('/friends', protect, friendshipController.getFriends);

// Notifications
router.get('/notifications', protect, notificationController.getNotifications);
router.post('/notifications/:id/read', protect, notificationController.markAsRead);

export default router;
