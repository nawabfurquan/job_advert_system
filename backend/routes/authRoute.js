import express from "express";
import {
  forgotPassword,
  loginController,
  resetPassword,
  signupController,
  tokenExpiryCheck,
  tokenRefresh,
} from "../controller/authController.js";

const router = express.Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 authToken:
 *                   type: string
 *                 user:
 *                   type: object
 *       400:
 *         description: Invalid email or incorrect password.
 *       404:
 *         description: Email not found.
 *       500:
 *         description: Internal Server Error.
 */
router.post("/login", loginController);

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     tags: [Auth]
 *     summary: Sign up
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              user:
 *                $ref: '#/parameters/User'
 *     responses:
 *       201:
 *         description: User created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 authToken:
 *                   type: string
 *                 user:
 *                   type: object
 *       400:
 *         description: Email already exists or invalid input data.
 *       500:
 *         description: Internal Server Error.
 */
router.post("/signup", signupController);

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     tags: [Auth]
 *     summary: Refreshes the authentication token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Returns a new authentication token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 authToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       401:
 *         description: Refresh token is missing or invalid.
 */
router.post("/refresh-token", tokenRefresh);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     tags: [Auth]
 *     summary: Forgot Password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Reset password link sent.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 success:
 *                   type: boolean
 *       404:
 *         description: Email not provided.
 *       401:
 *         description: User not found.
 *       500:
 *         description: Internal Server Error.
 */
router.post("/forgot-password", forgotPassword);

/**
 * @swagger
 * /auth/reset-password/{token}:
 *   post:
 *     tags: [Auth]
 *     summary: Resets the user's password
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Password changed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 success:
 *                   type: boolean
 *       401:
 *         description: Link expired or invalid.
 *       500:
 *         description: Internal Server Error.
 */
router.post("/reset-password/:token", resetPassword);

/**
 * @swagger
 * /auth/token-expiry/{token}:
 *   get:
 *     tags: [Auth]
 *     summary: Checks if the reset token has expired.
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns whether the token is expired or not.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 expired:
 *                   type: boolean
 *       500:
 *         description: Internal Server Error.
 */
router.get("/token-expiry/:token", tokenExpiryCheck);

export default router;
