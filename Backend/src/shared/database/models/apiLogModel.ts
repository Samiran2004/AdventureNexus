import mongoose from 'mongoose';

const apiLogSchema = new mongoose.Schema({
    method: String,
    endpoint: String,
    statusCode: Number,
    duration: Number, // in ms
    ip: String,
    userAgent: String,
    timestamp: { type: Date, default: Date.now }
});

// TTL Index: Keep logs for 7 days to prevent DB bloat
apiLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 604800 });

const ApiLog = mongoose.model('ApiLog', apiLogSchema);

export default ApiLog;
