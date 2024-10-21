import { UserModel } from "../model/userModel.js";

export const checkIsAdmin = async (req, res, next) => {
  try {
    const userId = req?.userId;

    // Getting user
    const user = await UserModel.findOne({ userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user is admin
    if (user.isAdmin) {
      next();
    } else {
      return res.status(403).json({ message: "Access denied" });
    }
  } catch (err) {
    // Error Handling
    res.status(401).json({ message: "Internal Server Error", error: err });
  }
};
