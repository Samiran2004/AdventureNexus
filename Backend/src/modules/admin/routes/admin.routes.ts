import express from 'express';
import { adminLogin } from '../controllers/adminAuth.controller';
import {
    getDashboardStats,
    getAllUsers,
    deleteUser,
    getAllPlans,
    deletePlan,
    getAllReviews,
    deleteReview,
    getSystemHealth,
    getAuditLogs,
    getGrowthStats,
    getApiAnalytics,
    getDashboardMetrics,
    getDashboardTimeSeries,
    getDashboardActivityLogs,
    getSimulatorStatus,
    toggleSimulator,
    getModerationAlerts,
    resolveModerationAlert
} from '../controllers/adminDashboard.controller';
import { broadcastMessage } from '../controllers/adminCommunication.controller';
import {
    getSystemSettings,
    updateSystemSetting,
    getSubscribers,
    deleteSubscriber
} from '../controllers/adminSettings.controller';
import { protectAdmin } from '../../../shared/middleware/adminAuthMiddleware';

const router = express.Router();

// Public Admin Route
router.post('/login', adminLogin);

// Protected Admin Routes
router.use(protectAdmin);

router.get('/metrics', getDashboardMetrics);
router.get('/timeseries', getDashboardTimeSeries);
router.get('/activity', getDashboardActivityLogs);

router.get('/stats', getDashboardStats);

router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);

router.get('/plans', getAllPlans);
router.delete('/plans/:id', deletePlan);

router.get('/reviews', getAllReviews);
router.delete('/reviews/:id', deleteReview);

// Phase 4 Routes
router.get('/health', getSystemHealth);
router.get('/growth', getGrowthStats);
router.get('/analytics', getApiAnalytics);
router.get('/audit-logs', getAuditLogs);
router.post('/broadcast', broadcastMessage);

// Tactical System Controls
router.get('/settings', getSystemSettings);
router.patch('/settings', updateSystemSetting);

// Newsletter Management
router.get('/subscribers', getSubscribers);
router.delete('/subscribers/:id', deleteSubscriber);

// Dynamic Traffic Simulator Control Center
router.get('/simulator/status', getSimulatorStatus);
router.post('/simulator/toggle', toggleSimulator);

// Content Toxicity Moderation Shield
router.get('/moderation', getModerationAlerts);
router.post('/moderation/resolve', resolveModerationAlert);

export default router;
