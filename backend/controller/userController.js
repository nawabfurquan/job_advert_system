import { UserFileModel } from "../model/userFileModel.js";
import { UserModel } from "../model/userModel.js";
import bcrypt from "bcryptjs";
import { v4 } from "uuid";

export const getAllUsers = async (_req, res) => {
  try {
    // Get all users
    const users = await UserModel.find({ isAdmin: false }).select(
      "userId email name phone isEmployer"
    );

    if (users?.length === 0 || !users) {
      return res.status(200).json({ message: "No users found", users: [] });
    }

    // Return users
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
};

export const getUserById = async (req, res) => {
  try {
    // Get user by user id
    const user = await UserModel.findOne({ userId: req.params?.userId }).select(
      "-password -lastUpdated -resetToken -resetTokenExpiry -_id -__v"
    );
    if (!user) {
      return res.status(404).json({ message: "No user found" });
    }

    // Define required fields to return
    res.status(200).json({
      user: user,
    });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
};

export const updateUserById = async (req, res) => {
  try {
    // Update user by user id
    const updatedUserData = req.body;

    // Attaching resume file data if file is in request
    if (req?.file) {
      const resume = {
        data: req?.file?.buffer,
        fileType: req?.file?.mimetype,
        name: req?.file?.originalname,
      };

      let userFile;
      // Checking if the file already exists
      const foundUserFile = await UserFileModel.findOne({
        userId: req.body?.userId,
      });
      if (foundUserFile) {
        userFile = await UserFileModel.findOneAndUpdate(
          { userId: req.body?.userId },
          { $set: { ...resume } },
          { new: true }
        );
      } else {
        // Creating new field if it does not exist
        userFile = await UserFileModel.create({
          userFileId: v4(),
          userId: req.body?.userId,
          ...resume,
        });
      }

      updatedUserData.resume = {
        userFileId: userFile?.userFileId,
        name: userFile?.name,
      };
    }

    // Update user data with resume filename
    const user = await UserModel.findOneAndUpdate(
      { userId: req.params?.userId },
      { $set: { ...updatedUserData, lastUpdated: Date.now() } },
      { new: true }
    ).select("-password -lastUpdated -resetToken -resetTokenExpiry -_id -__v");

    if (!user) {
      return res.status(404).json({ message: "No user found" });
    }

    res.status(200).json({
      user,
    });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const password = req.body?.password;

    if (password) {
      const user = await UserModel.findOne({ userId: req?.userId });

      if (!user) {
        return res.status(404).json({ message: "User Not Found" });
      }

      // Comparing the old password
      const previousPassword = await bcrypt.compare(password, user?.password);

      // Hashing new password
      const hashedPassword = await bcrypt.hash(password, 10);

      if (previousPassword) {
        return res.status(400).json({ message: "Password already used" });
      }

      // Updating the password
      const updatedUser = await UserModel.findOneAndUpdate(
        {
          userId: req?.userId,
        },
        { $set: { password: hashedPassword } },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User Not Found" });
      }

      res
        .status(200)
        .json({ success: true, message: "Password changed successfully" });
    } else {
      res.status(400).json({ message: "Invalid Password" });
    }
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
};

export const removeUserById = async (req, res) => {
  try {
    // Delete user by user id and selecting only the required fields
    const deletedUser = await UserModel.findOneAndDelete({
      userId: req.params?.userId,
    }).select("userId name email phone");

    if (!deletedUser) {
      return res.status(404).json({ message: "No user found" });
    }
    res.status(200).json({ message: "Deletion successful", user: deletedUser });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
};

export const downloadUserFile = async (req, res) => {
  const userFileId = req.params?.userFileId;

  try {
    // Finding the file by providing the user file id
    const file = await UserFileModel.findOne({ userFileId });
    if (!file) {
      return res.status(404).json({ message: "Resume not found" });
    }

    // Returning the content type and file data
    res.set("Content-Type", file?.fileType);
    res.send(file?.data);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateInteractionsByUserId = async (req, res) => {
  try {
    const userId = req.params?.userId;

    const { jobId } = req.body;
    // Checking if all values are provided
    if (userId && jobId) {
      const user = await UserModel.findOne({ userId });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Employer or admin shouldn't be accessing the endpoint
      if (user.isEmployer || user.isAdmin) {
        return res.status(404).json({ message: "An error occurred" });
      }

      // Add the new interaction
      if (user?.interactions?.indexOf(jobId) === -1) {
        user?.interactions?.push(jobId);
        await user.save();
        return res.status(200).json({
          message: "Successfully updated",
          success: true,
          user: {
            userId: user.userId,
            email: user.email,
            name: user.name,
            isAdmin: user.isAdmin,
            isEmployer: user.isEmployer,
            skills: user?.skills,
            experience: user?.experience,
            preferences: user?.preferences,
            location: user?.location,
            phone: user?.phone,
            resume: user?.resume,
            interactions: user?.interactions,
          },
        });
      }

      res.status(200).json({ message: "Already exists" });
    } else {
      res.status(400).json({ message: "Missing values" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
};
