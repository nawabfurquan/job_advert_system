import mongoose from "mongoose";

// User file for storing the resume files of the user
const userFileSchema = new mongoose.Schema({
  userFileId: {
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
});

export const UserFileModel = mongoose.model("user_file", userFileSchema);
