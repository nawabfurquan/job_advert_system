import mongoose from "mongoose";

// Job for storing job data
const jobSchema = new mongoose.Schema({
  jobId: {
    required: true,
    type: String,
    unique: true,
  },
  title: {
    required: true,
    type: String,
  },
  description: {
    type: String,
  },
  requirements: {
    type: [String],
  },
  responsibilities: {
    type: [String],
  },
  skills: {
    type: [String],
  },
  jobType: {
    type: String,
  },
  salary: {
    type: Number,
  },
  industry: {
    type: String,
  },
  company: {
    required: true,
    type: String,
  },
  location: {
    type: String,
  },
  postedDate: {
    type: Date,
    default: Date.now,
  },
  userId: {
    required: true,
    type: String,
  },
  deadline: {
    type: Date,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  score: {
    type: Number,
  },
});

export const JobModel = mongoose.model("job", jobSchema);
