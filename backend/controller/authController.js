import { UserModel } from "../model/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 } from "uuid";
import validator from "validator";
import { JobModel } from "../model/jobModel.js";
import { ApplicationModel } from "../model/applicationModel.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";
import transporter from "../utils/sendEmail.js";
import crypto from "crypto";

// Login Controller
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Checking if user exists
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid Email" });
    }

    const user = await UserModel.findOne({ email });
    if (user) {
      // Comparing the provided password with the stored password
      const matchPassword = await bcrypt.compare(password, user.password);
      if (!matchPassword) {
        return res.status(400).json({ message: "Incorrect Password" });
      }

      const accessToken = generateAccessToken(user.userId);
      const refreshToken = generateRefreshToken(user.userId);

      let loggedInUser = {
        userId: user.userId,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
        isEmployer: user.isEmployer,
        phone: user?.phone,
      };

      // Initialising user specific fields
      if (!user.isAdmin && !user.isEmployer) {
        loggedInUser = {
          skills: user?.skills,
          experience: user?.experience,
          preferences: user?.preferences,
          location: user?.location,
          resume: user?.resume,
          interactions: user?.interactions,
          ...loggedInUser,
        };
      }

      // Returning auth token and required user data
      res.status(200).json({
        message: "Success",
        authToken: accessToken,
        refreshToken: refreshToken,
        user: {
          ...loggedInUser,
        },
      });
    } else {
      res.status(404).json({ message: "Email not found" });
    }
  } catch (err) {
    // Error Handling
    res.status(500);
    res.json({ message: "Internal Server Error", error: err });
  }
};

// Signup Controller
export const signupController = async (req, res) => {
  try {
    const { email, password, name, phone, isEmployer } = req.body;

    // Validate email
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid Email" });
    }

    const user = await UserModel.findOne({ email });

    // Checking if user exists
    if (user) {
      return res.status(400).json({ message: "Email Already Exists" });
    }

    // Checking if access code by the employer is correct
    if (isEmployer && !(req.body?.access_code === process.env.ACCESS_CODE)) {
      return res.status(400).json({ message: "Wrong Access Code" });
    }

    if (password && name && phone) {
      // Encrypting Password
      const hashedPassword = await bcrypt.hash(password, 10);
      // Creating a new user
      const newUser = await UserModel.create({
        userId: v4(),
        email,
        name,
        password: hashedPassword,
        phone,
        isAdmin: false,
        isEmployer: isEmployer,
      });

      if (newUser) {
        // generate new tokens
        const accessToken = generateAccessToken(newUser.userId);
        const refreshToken = generateRefreshToken(newUser.userId);

        // Returning authToken and required user data
        res.status(201);
        res.json({
          message: "User Created",
          authToken: accessToken,
          refreshToken: refreshToken,
          user: {
            userId: newUser.userId,
            email: newUser.email,
            name: newUser.name,
            isAdmin: newUser.isAdmin,
            isEmployer: newUser.isEmployer,
            phone: newUser.phone,
          },
        });
      } else {
        res.status(500);
        res.json({ message: "An unknown error occured" });
      }
    } else {
      res.status(400);
      res.json({ message: "Missing values" });
    }
  } catch (err) {
    // Error Handling
    res.status(500);
    res.json({ message: "Internal Server Error", error: err });
  }
};

export const getAllCount = async (_req, res) => {
  try {
    // Getting count of users, applications and jobs
    const userList = await UserModel.find({
      isAdmin: false,
      isEmployer: false,
    });
    const userCount = userList.length;
    const jobList = await JobModel.find();
    const jobCount = jobList.length;
    const appList = await ApplicationModel.find();
    const appCount = appList.length;

    res.status(200).json({
      user: userCount,
      job: jobCount,
      application: appCount,
    });
  } catch (err) {
    res.status(500);
    res.json({ message: "Internal Server Error", error: err });
  }
};

export const tokenRefresh = async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(401).json({ message: "No refresh token provided" });
  }
  try {
    // Decoding the token
    const decoded = jwt.verify(token, process.env.REFRESH_SECRET_KEY);

    // Verifying the token with user
    const user = await UserModel.findOne({ userId: decoded.userId });

    if (!user) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    // Generating new tokens
    const newAccessToken = generateAccessToken(user.userId);
    const newRefreshToken = generateRefreshToken(user.userId);

    res
      .status(200)
      .json({ authToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (error) {
    res.status(401).json({ message: "Token expired or invalid" });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(404).json({ message: "Email Not Provided" });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User Not Found" });
    }

    // Creating new reset token
    const newResetToken = crypto.randomBytes(30).toString("hex");

    user.resetToken = newResetToken;
    // Creating expiry of 30 mins for token
    user.resetTokenExpiry = 1800000 + Date.now();
    if (user.isAdmin || user.isEmployer) {
      user.preferences = null;
    }

    await user.save();

    // Creating link for reset password
    const urlResetPassword = `${process.env.FRONT_END_URL}/reset-password/${newResetToken}`;

    // Sending email to the user with the link
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: user.email,
      subject: "Reset Password",
      html: `
    <p>Click on the to reset your password <a href=${urlResetPassword}>Reset Password</a></p>
    <p>This link will expire in 30 minutes</p>
    `,
    });

    res
      .status(200)
      .json({ message: "Reset Password Link Sent", success: true });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Finding the user with token provided
    const foundUser = await UserModel.findOne({
      resetTokenExpiry: { $gt: Date.now() },
      resetToken: token,
    });

    if (!foundUser) {
      return res.status(401).json({ message: "Link Expired" });
    }

    // Comparing password
    const previousPassword = await bcrypt.compare(
      password,
      foundUser?.password
    );

    // Hashing the new password
    const newHashedPassword = await bcrypt.hash(password, 10);

    if (previousPassword) {
      return res.status(400).json({ message: "Password already used" });
    }

    // Updating the password
    foundUser.password = newHashedPassword;

    // Resetting the tokens
    foundUser.resetToken = null;
    foundUser.resetTokenExpiry = null;
    if (foundUser.isAdmin || foundUser.isEmployer) {
      foundUser.preferences = null;
    }
    foundUser.save();

    res.status(200).json({ message: "Password changed", success: true });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const tokenExpiryCheck = async (req, res) => {
  try {
    const { token } = req.params;

    // Finding user with the token provided
    const user = await UserModel.findOne({
      resetTokenExpiry: { $gt: Date.now() },
      resetToken: token,
    });

    if (!user) {
      return res.status(200).json({ expired: true });
    }
    res.status(200).json({ expired: false });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
