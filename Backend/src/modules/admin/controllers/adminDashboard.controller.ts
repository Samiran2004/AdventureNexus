import { Request, Response } from 'express';
import User from '../../../shared/database/models/userModel';
import Plan from '../../../shared/database/models/planModel';
import Review from '../../../shared/database/models/reviewModel';
import { StatusCodes } from 'http-status-codes';
import logger from '../../../shared/utils/logger';
import os from 'os';
import AuditLog from '../../../shared/database/models/auditLogModel';
import ApiLog from '../../../shared/database/models/apiLogModel';
import CommunityPost from '../../../shared/database/models/communityPostModel';
import ExperiencePost from '../../../shared/database/models/experiencePostModel';
import CommunityComment from '../../../shared/database/models/communityCommentModel';
import ExperienceComment from '../../../shared/database/models/experienceCommentModel';
import GroupMembership from '../../../shared/database/models/groupMembershipModel';
import ActivityLog from '../../../shared/database/models/activityLogModel';

// --- Stats ---
export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalPlans = await Plan.countDocuments();
        const totalReviews = await Review.countDocuments();

        // Example: Get recent plans for a "Recent Activity" widget
        const recentPlans = await Plan.find().sort({ createdAt: -1 }).limit(5).select('name to date');

        res.status(StatusCodes.OK).json({
            status: 'Success',
            data: {
                totalUsers,
                totalPlans,
                totalReviews,
                recentPlans
            }
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server Error' });
    }
};

export const getGrowthStats = async (req: Request, res: Response) => {
    try {
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);
            return date;
        }).reverse();

        const growthData = await Promise.all(last7Days.map(async (date) => {
            const nextDay = new Date(date);
            nextDay.setDate(nextDay.getDate() + 1);

            const userCount = await User.countDocuments({
                createdAt: { $gte: date, $lt: nextDay }
            });
            const planCount = await Plan.countDocuments({
                createdAt: { $gte: date, $lt: nextDay }
            });

            return {
                date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                users: userCount,
                plans: planCount
            };
        }));

        res.status(StatusCodes.OK).json({
            status: 'Success',
            data: growthData
        });
    } catch (error) {
        logger.error('Error fetching growth stats:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server Error' });
    }
};

// --- System Intelligence (Phase 4) ---
export const getSystemHealth = async (req: Request, res: Response) => {
    try {
        const cpuUsage = os.loadavg(); // Returns 1, 5, 15 min load averages
        const totalMem = os.totalmem();
        const freeMem = os.freemem();
        const uptime = os.uptime();

        res.status(StatusCodes.OK).json({
            status: 'Success',
            data: {
                cpuLoad: cpuUsage[0], // 1 min load average
                memory: {
                    total: totalMem, free: freeMem, used: totalMem - freeMem,
                    percentage: (((totalMem - freeMem) / totalMem) * 100).toFixed(2)
                },
                uptime,
                platform: os.platform(),
                arch: os.arch()
            }
        });
    } catch (error) {
        logger.error('Error fetching system health:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server Error' });
    }
};

// --- User Management ---
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find().sort({ createdAt: -1 }); // Simple fetch all for now
        res.status(StatusCodes.OK).json({ status: 'Success', data: users });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server Error' });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        const { getIO } = await import('../../../shared/socket/socket'); // Dynamic import
        if (user) {
            getIO().emit('user:deleted', user.clerkUserId);

            // Log the action (Phase 4)
            await AuditLog.log({
                action: 'DELETE_USER',
                module: 'COMMUNITY',
                adminId: 'admin',
                targetId: req.params.id,
                details: { username: user.username, email: user.email },
                severity: 'warning'
            });
        }

        res.status(StatusCodes.OK).json({ status: 'Success', message: 'User deleted' });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server Error' });
    }
};

// --- Plan Management ---
export const getAllPlans = async (req: Request, res: Response) => {
    try {
        const plans = await Plan.find().populate('userId', 'email username').sort({ createdAt: -1 });
        res.status(StatusCodes.OK).json({ status: 'Success', data: plans });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server Error' });
    }
};

export const deletePlan = async (req: Request, res: Response) => {
    try {
        const plan = await Plan.findByIdAndDelete(req.params.id);
        const { getIO } = await import('../../../shared/socket/socket');
        getIO().emit('plan:deleted', req.params.id);

        // Log the action (Phase 4)
        if (plan) {
            await AuditLog.log({
                action: 'DELETE_PLAN',
                module: 'EXPEDITIONS',
                adminId: 'admin',
                targetId: req.params.id,
                details: { destination: (plan as any).to },
                severity: 'info'
            });
        }

        res.status(StatusCodes.OK).json({ status: 'Success', message: 'Plan deleted' });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server Error' });
    }
};

// --- Review Management ---
export const getAllReviews = async (req: Request, res: Response) => {
    try {
        const reviews = await Review.find().sort({ createdAt: -1 });
        res.status(StatusCodes.OK).json({ status: 'Success', data: reviews });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server Error' });
    }
};

export const deleteReview = async (req: Request, res: Response) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id);
        const { getIO } = await import('../../../shared/socket/socket');
        getIO().emit('review:deleted', req.params.id);

        // Log the action (Phase 4)
        if (review) {
            await AuditLog.log({
                action: 'DELETE_REVIEW',
                module: 'TESTIMONIALS',
                adminId: 'admin',
                targetId: req.params.id,
                details: { reviewer: (review as any).userName },
                severity: 'info'
            });
        }

        res.status(StatusCodes.OK).json({ status: 'Success', message: 'Review deleted' });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server Error' });
    }
};

// --- Governance (Audit Logs) ---
export const getAuditLogs = async (req: Request, res: Response) => {
    try {
        const logs = await AuditLog.find().sort({ timestamp: -1 }).limit(100);
        res.status(StatusCodes.OK).json({ status: 'Success', data: logs });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server Error' });
    }
};

// --- API Analytics (Phase 5) ---
export const getApiAnalytics = async (req: Request, res: Response) => {
    try {
        const last7Days = new Date();
        last7Days.setDate(last7Days.getDate() - 7);

        // 1. Status Distribution
        const statusDistribution = await ApiLog.aggregate([
            { $match: { timestamp: { $gte: last7Days } } },
            {
                $group: {
                    _id: {
                        $cond: [
                            { $lt: ["$statusCode", 300] }, "Success",
                            { $cond: [{ $lt: ["$statusCode", 400] }, "Redirect", "Error"] }
                        ]
                    },
                    count: { $sum: 1 }
                }
            }
        ]);

        // 2. Latency Trends (Daily average)
        const latencyTrends = await ApiLog.aggregate([
            { $match: { timestamp: { $gte: last7Days } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
                    avgDuration: { $avg: "$duration" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // 3. Top Error Endpoints
        const topErrors = await ApiLog.aggregate([
            { $match: { timestamp: { $gte: last7Days }, statusCode: { $gte: 400 } } },
            {
                $group: {
                    _id: { endpoint: "$endpoint", method: "$method" },
                    errorCount: { $sum: 1 }
                }
            },
            { $sort: { errorCount: -1 } },
            { $limit: 10 }
        ]);

        res.status(StatusCodes.OK).json({
            status: 'Success',
            data: {
                distribution: statusDistribution,
                latency: latencyTrends.map(d => ({ date: d._id, value: Math.round(d.avgDuration) })),
                errors: topErrors.map(e => ({ endpoint: e._id.endpoint, method: e._id.method, count: e.errorCount }))
            }
        });
    } catch (error) {
        logger.error('Error fetching API analytics:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server Error' });
    }
};

/**
 * ── GET REAL-TIME METRICS FOR GRAFANA OBSERVABILITY ──
 */
export const getDashboardMetrics = async (req: Request, res: Response) => {
    try {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

        // Fetch counts in parallel
        const [
            totalUsers,
            activeUsers,
            postsCreatedToday,
            experiencesCreatedToday,
            commComments,
            expComments,
            groupJoins
        ] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ updatedAt: { $gte: last24h } }),
            CommunityPost.countDocuments({ createdAt: { $gte: startOfToday } }),
            ExperiencePost.countDocuments({ createdAt: { $gte: startOfToday } }),
            CommunityComment.countDocuments(),
            ExperienceComment.countDocuments(),
            GroupMembership.countDocuments()
        ]);

        const totalComments = commComments + expComments;

        // Aggregate total likes
        const [communityLikes, experienceLikes] = await Promise.all([
            CommunityPost.aggregate([{ $group: { _id: null, total: { $sum: { $size: { $ifNull: ["$likes", []] } } } } }]),
            ExperiencePost.aggregate([{ $group: { _id: null, total: { $sum: { $size: { $ifNull: ["$likes", []] } } } } }])
        ]);

        const totalLikes = (communityLikes[0]?.total || 0) + (experienceLikes[0]?.total || 0);

        res.status(StatusCodes.OK).json({
            success: true,
            data: {
                totalUsers,
                activeUsers,
                postsCreatedToday,
                experiencesCreatedToday,
                commentsCount: totalComments,
                likesCount: totalLikes,
                groupJoins
            }
        });
    } catch (error: any) {
        logger.error('Error fetching admin observability metrics:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Server Error' });
    }
};

/**
 * ── GET TIME-SERIES DATA FOR GRAFANA REAL-TIME CHARTS ──
 */
export const getDashboardTimeSeries = async (req: Request, res: Response) => {
    try {
        const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        // 1. Hourly user registrations
        const hourlyUsers = await User.aggregate([
            { $match: { createdAt: { $gte: last24h } } },
            {
                $group: {
                    _id: { $hour: "$createdAt" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Map to continuous 24 hours format
        const formattedHourly = Array.from({ length: 24 }, (_, i) => {
            const match = hourlyUsers.find(h => h._id === i);
            return { hour: `${i}:00`, registrations: match ? match.count : 0 };
        });

        // 2. Daily posts creation (last 7 days)
        const dailyPosts = await CommunityPost.aggregate([
            { $match: { createdAt: { $gte: last7Days } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // 3. API Latency Trends
        const latencyTrends = await ApiLog.aggregate([
            { $match: { timestamp: { $gte: last7Days } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
                    avgDuration: { $avg: "$duration" }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.status(StatusCodes.OK).json({
            success: true,
            data: {
                hourlyRegistrations: formattedHourly,
                dailyPosts: dailyPosts.map(d => ({ date: d._id, count: d.count })),
                apiLatency: latencyTrends.map(l => ({ date: l._id, value: Math.round(l.avgDuration) }))
            }
        });
    } catch (error: any) {
        logger.error('Error fetching time-series data:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Server Error' });
    }
};

/**
 * ── GET DYNAMIC OBSERVABILITY USER ACTIVITY LOGS ──
 */
export const getDashboardActivityLogs = async (req: Request, res: Response) => {
    try {
        const logs = await ActivityLog.find()
            .sort({ createdAt: -1 })
            .limit(100)
            .lean();

        res.status(StatusCodes.OK).json({
            success: true,
            data: logs
        });
    } catch (error: any) {
        logger.error('Error fetching admin dashboard activity logs:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Server Error' });
    }
};

/**
 * ── TOGGLE LIVE TRAFFIC SIMULATOR ENGINE ──
 */
import { startSimulator, stopSimulator, isSimulatorRunning } from '../services/trafficSimulator';

export const getSimulatorStatus = async (req: Request, res: Response) => {
    res.status(StatusCodes.OK).json({
        success: true,
        data: { active: isSimulatorRunning() }
    });
};

export const toggleSimulator = async (req: Request, res: Response) => {
    try {
        const running = isSimulatorRunning();
        if (running) {
            stopSimulator();
        } else {
            startSimulator(4000);
        }
        res.status(StatusCodes.OK).json({
            success: true,
            data: { active: !running }
        });
    } catch (error: any) {
        logger.error('Error toggling traffic simulator:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Server Error' });
    }
};

/**
 * ── GET ECOSYSTEM TOXICITY MODERATION ALERTS ──
 */
export const getModerationAlerts = async (req: Request, res: Response) => {
    try {
        // Fetch comments and reviews to check toxicity
        const [reviews, comments] = await Promise.all([
            Review.find().sort({ createdAt: -1 }).limit(50).lean(),
            CommunityComment.find().populate('userId', 'username fullname profilepicture').sort({ createdAt: -1 }).limit(50).lean()
        ]);

        const TOXIC_KEYWORDS = ['scam', 'cheat', 'hack', 'fake', 'worst', 'shit', 'fuck', 'toxic'];
        const SUSPICIOUS_KEYWORDS = ['bad', 'suspect', 'disappoint', 'delay', 'annoy'];

        const alerts: any[] = [];

        // 1. Process Reviews
        reviews.forEach((r: any) => {
            const commentText = (r.comment || '').toLowerCase();
            let score = 5; // Base toxicity index

            TOXIC_KEYWORDS.forEach(kw => {
                if (commentText.includes(kw)) score += 30;
            });
            SUSPICIOUS_KEYWORDS.forEach(kw => {
                if (commentText.includes(kw)) score += 15;
            });

            if (score > 100) score = 100;

            // Flag items with score >= 35% as suspicious/warnings, or let the admin view all rated by toxicity
            alerts.push({
                _id: r._id,
                type: 'REVIEW',
                author: r.userName || 'Unknown Traveler',
                avatar: r.userAvatar,
                content: r.comment,
                toxicity: score,
                timestamp: r.createdAt || new Date(),
                status: score >= 60 ? 'QUARANTINE' : score >= 35 ? 'SUSPICIOUS' : 'SECURE'
            });
        });

        // 2. Process Comments
        comments.forEach((c: any) => {
            const commentText = (c.content || '').toLowerCase();
            let score = 5;

            TOXIC_KEYWORDS.forEach(kw => {
                if (commentText.includes(kw)) score += 30;
            });
            SUSPICIOUS_KEYWORDS.forEach(kw => {
                if (commentText.includes(kw)) score += 15;
            });

            if (score > 100) score = 100;

            alerts.push({
                _id: c._id,
                type: 'COMMENT',
                author: c.userId?.username || 'traveler',
                avatar: c.userId?.profilepicture,
                content: c.content,
                toxicity: score,
                timestamp: c.createdAt || new Date(),
                status: score >= 60 ? 'QUARANTINE' : score >= 35 ? 'SUSPICIOUS' : 'SECURE'
            });
        });

        // Sort by highest toxicity score
        alerts.sort((a, b) => b.toxicity - a.toxicity);

        res.status(StatusCodes.OK).json({
            success: true,
            data: alerts
        });
    } catch (error: any) {
        logger.error('Error fetching toxicity moderation alerts:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Server Error' });
    }
};

/**
 * ── RESOLVE ECOSYSTEM TOXICITY MODERATION ALERTS ──
 */
import { trackAdminEvent } from '../../../shared/utils/adminEventTracker';

export const resolveModerationAlert = async (req: Request, res: Response) => {
    try {
        const { id, type, action } = req.body; // action: 'approve' | 'expunge'

        if (action === 'expunge') {
            if (type === 'REVIEW') {
                const deleted = await Review.findByIdAndDelete(id);
                if (deleted) {
                    await trackAdminEvent({
                        clerkUserId: 'admin123',
                        activityType: 'comment_added', // Re-use generic audit log trigger safely
                        targetId: id,
                        details: `Moderator purged toxic testimonial review: "${(deleted as any).comment.substring(0, 30)}..."`,
                        username: 'security_radar'
                    });
                }
            } else {
                const deleted = await CommunityComment.findByIdAndDelete(id);
                if (deleted) {
                    await trackAdminEvent({
                        clerkUserId: 'admin123',
                        activityType: 'comment_added',
                        targetId: id,
                        details: `Moderator purged toxic community comment: "${(deleted as any).content.substring(0, 30)}..."`,
                        username: 'security_radar'
                    });
                }
            }
        } else {
            // Approve - mark as safe or log verification approval
            await trackAdminEvent({
                clerkUserId: 'admin123',
                activityType: 'comment_added',
                targetId: id,
                details: `Moderator cleared content flags for ${type} node id: ${id}`,
                username: 'security_radar'
            });
        }

        res.status(StatusCodes.OK).json({
            success: true,
            message: `Content marked as ${action === 'expunge' ? 'purged' : 'approved'}`
        });
    } catch (error: any) {
        logger.error('Error resolving content moderation alert:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Server Error' });
    }
};

