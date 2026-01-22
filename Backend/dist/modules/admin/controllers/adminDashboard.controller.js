"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApiAnalytics = exports.getAuditLogs = exports.deleteReview = exports.getAllReviews = exports.deletePlan = exports.getAllPlans = exports.deleteUser = exports.getAllUsers = exports.getSystemHealth = exports.getGrowthStats = exports.getDashboardStats = void 0;
const userModel_1 = __importDefault(require("../../../shared/database/models/userModel"));
const planModel_1 = __importDefault(require("../../../shared/database/models/planModel"));
const reviewModel_1 = __importDefault(require("../../../shared/database/models/reviewModel"));
const http_status_codes_1 = require("http-status-codes");
const logger_1 = __importDefault(require("../../../shared/utils/logger"));
const os_1 = __importDefault(require("os"));
const auditLogModel_1 = __importDefault(require("../../../shared/database/models/auditLogModel"));
const apiLogModel_1 = __importDefault(require("../../../shared/database/models/apiLogModel"));
const getDashboardStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalUsers = yield userModel_1.default.countDocuments();
        const totalPlans = yield planModel_1.default.countDocuments();
        const totalReviews = yield reviewModel_1.default.countDocuments();
        const recentPlans = yield planModel_1.default.find().sort({ createdAt: -1 }).limit(5).select('name to date');
        res.status(http_status_codes_1.StatusCodes.OK).json({
            status: 'Success',
            data: {
                totalUsers,
                totalPlans,
                totalReviews,
                recentPlans
            }
        });
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server Error' });
    }
});
exports.getDashboardStats = getDashboardStats;
const getGrowthStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);
            return date;
        }).reverse();
        const growthData = yield Promise.all(last7Days.map((date) => __awaiter(void 0, void 0, void 0, function* () {
            const nextDay = new Date(date);
            nextDay.setDate(nextDay.getDate() + 1);
            const userCount = yield userModel_1.default.countDocuments({
                createdAt: { $gte: date, $lt: nextDay }
            });
            const planCount = yield planModel_1.default.countDocuments({
                createdAt: { $gte: date, $lt: nextDay }
            });
            return {
                date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                users: userCount,
                plans: planCount
            };
        })));
        res.status(http_status_codes_1.StatusCodes.OK).json({
            status: 'Success',
            data: growthData
        });
    }
    catch (error) {
        logger_1.default.error('Error fetching growth stats:', error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server Error' });
    }
});
exports.getGrowthStats = getGrowthStats;
const getSystemHealth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cpuUsage = os_1.default.loadavg();
        const totalMem = os_1.default.totalmem();
        const freeMem = os_1.default.freemem();
        const uptime = os_1.default.uptime();
        res.status(http_status_codes_1.StatusCodes.OK).json({
            status: 'Success',
            data: {
                cpuLoad: cpuUsage[0],
                memory: {
                    total: totalMem, free: freeMem, used: totalMem - freeMem,
                    percentage: (((totalMem - freeMem) / totalMem) * 100).toFixed(2)
                },
                uptime,
                platform: os_1.default.platform(),
                arch: os_1.default.arch()
            }
        });
    }
    catch (error) {
        logger_1.default.error('Error fetching system health:', error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server Error' });
    }
});
exports.getSystemHealth = getSystemHealth;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userModel_1.default.find().sort({ createdAt: -1 });
        res.status(http_status_codes_1.StatusCodes.OK).json({ status: 'Success', data: users });
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server Error' });
    }
});
exports.getAllUsers = getAllUsers;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userModel_1.default.findByIdAndDelete(req.params.id);
        const { getIO } = yield Promise.resolve().then(() => __importStar(require('../../../shared/socket/socket')));
        if (user) {
            getIO().emit('user:deleted', user.clerkUserId);
            yield auditLogModel_1.default.log({
                action: 'DELETE_USER',
                module: 'COMMUNITY',
                adminId: 'admin',
                targetId: req.params.id,
                details: { username: user.username, email: user.email },
                severity: 'warning'
            });
        }
        res.status(http_status_codes_1.StatusCodes.OK).json({ status: 'Success', message: 'User deleted' });
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server Error' });
    }
});
exports.deleteUser = deleteUser;
const getAllPlans = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const plans = yield planModel_1.default.find().populate('userId', 'email username').sort({ createdAt: -1 });
        res.status(http_status_codes_1.StatusCodes.OK).json({ status: 'Success', data: plans });
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server Error' });
    }
});
exports.getAllPlans = getAllPlans;
const deletePlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const plan = yield planModel_1.default.findByIdAndDelete(req.params.id);
        const { getIO } = yield Promise.resolve().then(() => __importStar(require('../../../shared/socket/socket')));
        getIO().emit('plan:deleted', req.params.id);
        if (plan) {
            yield auditLogModel_1.default.log({
                action: 'DELETE_PLAN',
                module: 'EXPEDITIONS',
                adminId: 'admin',
                targetId: req.params.id,
                details: { destination: plan.to },
                severity: 'info'
            });
        }
        res.status(http_status_codes_1.StatusCodes.OK).json({ status: 'Success', message: 'Plan deleted' });
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server Error' });
    }
});
exports.deletePlan = deletePlan;
const getAllReviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reviews = yield reviewModel_1.default.find().sort({ createdAt: -1 });
        res.status(http_status_codes_1.StatusCodes.OK).json({ status: 'Success', data: reviews });
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server Error' });
    }
});
exports.getAllReviews = getAllReviews;
const deleteReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const review = yield reviewModel_1.default.findByIdAndDelete(req.params.id);
        const { getIO } = yield Promise.resolve().then(() => __importStar(require('../../../shared/socket/socket')));
        getIO().emit('review:deleted', req.params.id);
        if (review) {
            yield auditLogModel_1.default.log({
                action: 'DELETE_REVIEW',
                module: 'TESTIMONIALS',
                adminId: 'admin',
                targetId: req.params.id,
                details: { reviewer: review.userName },
                severity: 'info'
            });
        }
        res.status(http_status_codes_1.StatusCodes.OK).json({ status: 'Success', message: 'Review deleted' });
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server Error' });
    }
});
exports.deleteReview = deleteReview;
const getAuditLogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const logs = yield auditLogModel_1.default.find().sort({ timestamp: -1 }).limit(100);
        res.status(http_status_codes_1.StatusCodes.OK).json({ status: 'Success', data: logs });
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server Error' });
    }
});
exports.getAuditLogs = getAuditLogs;
const getApiAnalytics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const last7Days = new Date();
        last7Days.setDate(last7Days.getDate() - 7);
        const statusDistribution = yield apiLogModel_1.default.aggregate([
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
        const latencyTrends = yield apiLogModel_1.default.aggregate([
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
        const topErrors = yield apiLogModel_1.default.aggregate([
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
        res.status(http_status_codes_1.StatusCodes.OK).json({
            status: 'Success',
            data: {
                distribution: statusDistribution,
                latency: latencyTrends.map(d => ({ date: d._id, value: Math.round(d.avgDuration) })),
                errors: topErrors.map(e => ({ endpoint: e._id.endpoint, method: e._id.method, count: e.errorCount }))
            }
        });
    }
    catch (error) {
        logger_1.default.error('Error fetching API analytics:', error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server Error' });
    }
});
exports.getApiAnalytics = getApiAnalytics;
