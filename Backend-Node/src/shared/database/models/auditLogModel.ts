import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
    action: {
        type: String,
        required: true,
        index: true
    },
    module: {
        type: String,
        required: true,
        index: true
    },
    adminId: {
        type: String, // We'll store 'admin' for now as we have a single admin account
        required: true
    },
    targetId: {
        type: String, // ID of the user/plan/review affected
        index: true
    },
    details: {
        type: mongoose.Schema.Types.Mixed
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    },
    severity: {
        type: String,
        enum: ['info', 'warning', 'critical'],
        default: 'info'
    }
}, { timestamps: true });

// Add a method to log events easily
auditLogSchema.statics.log = async function (data) {
    return await this.create(data);
};

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

export default AuditLog;
