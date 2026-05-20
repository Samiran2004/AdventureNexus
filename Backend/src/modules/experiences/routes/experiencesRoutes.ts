import { Router } from 'express';
import { protect, optionalProtect } from '../../../shared/middleware/authClerkTokenMiddleware';
import { upload } from '../../../shared/middleware/multer';
import {
    createExperiencePost,
    getExperienceFeed,
    getExperienceById,
    toggleExperienceLike,
    toggleExperienceSave,
    addExperienceComment,
    getExperienceComments,
    deleteExperiencePost,
} from '../controllers/experiencesController';

const router = Router();

// Feed & Discovery (public)
router.get('/feed', getExperienceFeed);

// Single experience detail (public)
router.get('/:id', getExperienceById);

// Create experience post (protected, with image upload)
router.post('/create', protect, upload.array('images', 5), createExperiencePost);

// Delete experience post (protected)
router.delete('/:id', protect, deleteExperiencePost);

// Social interactions (protected)
router.post('/like/:id', protect, toggleExperienceLike);
router.post('/save/:id', protect, toggleExperienceSave);

// Comments
router.post('/comments', protect, addExperienceComment);
router.get('/comments/:postId', getExperienceComments);

export default router;
