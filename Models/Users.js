const mongoose = require("mongoose");

const { Schema } = mongoose;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        maxlength: [50, 'Name cannot be more than 50 characters long.']
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please Enter a valid email address']
    },
    age: {
        type: Number,
        required: true,
        min: [18, "Age must be at least 18 years"],
        max: [100, "Age cannot be more than 100 years"]
    },
    gender: {
        type: String,
        required: true,
        enum: {
            values: ['Male', 'Female', 'Other'],
            message: 'Gender must be either Male, Female, or Other'
        }
    },
    address: {
        type: String,
        maxlength: [100, 'Address cannot be more than 100 characters long.']
    },
    mobileNo: {
        type: String,
        unique: true,
        match: [/^\d{10}$/, 'Please fill a valid 10-digit mobile number'],
        required: true
    },
    deleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const User = mongoose.model('users', UserSchema);
module.exports = User;
