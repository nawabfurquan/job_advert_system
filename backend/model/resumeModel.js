import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
  data: {
    type: Buffer,
  },
  fileType: {
    type: String,
  },
  name: {
    type: String,
  },
  userId: {
    type: String,
  },
  path: {
    type: String,
  },
});

export const ResumeModel = mongoose.model("resume", resumeSchema);
