const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true
    },
    username: {
        type: String,
        requird: true,
    },
    email: {
        type: String,
        requird: [true, "Email is required"],
        lowercase: true,
        unique: true,
    }
})

module.exports = mongoose.model("User", UserSchema)