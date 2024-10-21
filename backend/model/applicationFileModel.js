import mongoose from "mongoose";

// ApplicationFile for storing application related files
const applicationFileSchema = new mongoose.Schema({
  applicationFileId: {
    type: String,
    required: true,
  },
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
    required: true,
  },
  applicationId: {
    type: String,
    required: true,
  },
});

export const ApplicationFileModel = mongoose.model(
  "application_file",
  applicationFileSchema
);
