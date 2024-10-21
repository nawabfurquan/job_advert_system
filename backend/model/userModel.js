import mongoose from "mongoose";

// Preference for storing user's preferences
const preferenceSchema = new mongoose.Schema({
  jobType: {
    type: [String],
  },
  location: {
    type: [String],
  },
  industry: {
    type: [String],
  },
  salary: {
    type: Number,
  },
});

// User for storing user data
const userSchema = new mongoose.Schema({
  userId: {
    required: true,
    type: String,
    unique: true,
  },
  email: {
    required: true,
    type: String,
    unique: true,
  },
  name: {
    required: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
  phone: {
    required: true,
    type: Number,
  },
  isAdmin: {
    required: true,
    type: Boolean,
    default: false,
  },
  isEmployer: {
    required: true,
    type: Boolean,
    default: false,
  },
  location: {
    type: String,
  },
  preferences: preferenceSchema,
  skills: {
    type: [String],
  },
  experience: {
    type: Number,
  },
  resume: {
    userFileId: String,
    name: String,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  resetToken: {
    type: String,
  },
  resetTokenExpiry: {
    type: Date,
  },
  interactions: {
    type: [String],
  },
});

export const UserModel = mongoose.model("user", userSchema);
