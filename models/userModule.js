const mongoose = require("mongoose");

let users = new mongoose.Schema({
    First_Name: {
        type: String,
        required: true,

    },
    Last_Name: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true,
        unique: true
    },
    Password:{
        type:String,
        required:true,
        unique: true,
    },
    Phone_No: {
        type: Number,
        required: true,
        unique: true,
    },
    Address:{
        type:String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Users", users);