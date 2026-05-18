import { Router } from 'express';
import * as chatController from '../controllers/chatController';
import * as groupController from '../controllers/groupController';
import { protect } from '../../../shared/middleware/authClerkTokenMiddleware';

const router = Router();

// Private chats
router.post('/conversation', protect, chatController.getOrCreateConversation);
router.get('/conversations', protect, chatController.getConversations);
router.post('/message', protect, chatController.sendMessage);
router.get('/messages/:conversationId', protect, chatController.getMessages);
router.put('/messages/read/:conversationId', protect, chatController.markAsRead);

// Group chats
router.post('/group', protect, groupController.createGroup);
router.post('/group/add-members', protect, groupController.addMembers);

export default router;
