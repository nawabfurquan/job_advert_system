import mongoose from "mongoose";

// UserInfo for storing user information of the user applied
const userInfoSchema = new mongoose.Schema({
  email: {
    required: true,
    type: String,
  },
  name: {
    required: true,
    type: String,
  },
  phone: {
    required: true,
    type: Number,
  },
  resume: {
    applicationFileId: String,
    name: String,
  },
  coverLetter: {
    applicationFileId: String,
    name: String,
  },
  location: {
    type: String,
  },
});

// Application Model for storing job application data
const applicationSchema = new mongoose.Schema({
  applicationId: {
    required: true,
    type: String,
  },
  jobId: {
    required: true,
    type: String,
  },
  userId: {
    required: true,
    type: String,
  },
  userInfo: userInfoSchema,
  status: {
    type: String,
    default: "Pending",
  },
  date: {
    required: true,
    type: Date,
    default: Date.now,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

export const ApplicationModel = mongoose.model(
  "application",
  applicationSchema
);
