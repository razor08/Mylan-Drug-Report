var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var shortid = require("shortid");

// User Roles:
// 0 - Admin
// 1 - End User


var userSchema = new mongoose.Schema({
    uid: {
        type: String,
        required: true,
        default: shortid.generate
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    googleUserId: {
        type: String
    },
    password: {
        type: String
    },
    role: {
        type: Number,
        required: true,
        default: 1
    },
    active: {
        type: Boolean,
        required: true,
        default: false
    },
    country: {
        type: String,
        required: true,
        default: "India"
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: String
    }
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);