const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
    roleName: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    accessModules: {
        type: [String],
        default: [],
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

const roleModel = mongoose.model("role", roleSchema);
module.exports = roleModel;