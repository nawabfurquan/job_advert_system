import jwt from "jsonwebtoken";

export const checkAuth = async (req, res, next) => {
  try {
    const token =
      req.headers?.["authorization"] || req.headers?.["Authorization"];

    // Not authorized if token doesn't exist
    if (!token) return res.status(401).json({ message: "User not authorized" });

    // Get authToken
    const authToken = token?.split?.(" ")?.[1];

    // Verify the token
    const decodedAuthToken = jwt.verify(
      authToken,
      process.env.ACCESS_SECRET_KEY
    );

    // Attaching userId to request
    req.userId = decodedAuthToken?.userId;
    next();
  } catch (err) {
    // Error Handling
    res.status(401).json({ message: "Internal Server Error", error: err });
  }
};
