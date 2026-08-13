const mongoose = require("mongoose");

const userActivitySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false // Allow anonymous tracking if needed
    },
    activityType: {
        type: String,
        enum: ['describe_idea', 'code_generator', 'web_design', 'diagram_maker'],
        required: true
    },
    prompt: {
        type: String,
        required: true
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed, // Flexible field to store generated code, diagram text, etc.
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("UserActivity", userActivitySchema);
