import express from "express";
import { checkAuth } from "../middleware/checkAuth.js";
import {
  downloadUserFile,
  getAllUsers,
  getUserById,
  removeUserById,
  updateInteractionsByUserId,
  updatePassword,
  updateUserById,
} from "../controller/userController.js";
import { checkIsAdmin } from "../middleware/checkIsAdmin.js";
import upload from "../utils/fileUpload.js";

const router = express.Router();

router.use(checkAuth);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [User]
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/parameters/User'
 *       404:
 *         description: No users found
 *       500:
 *         description: Internal server error
 */
router.get("/", checkIsAdmin, getAllUsers);

/**
 * @swagger
 * /users/resume/{userFileId}:
 *   get:
 *     summary: Download user resume
 *     tags: [User]
 *     parameters:
 *       - name: userFileId
 *         in: path
 *         required: true
 *         description: The ID of the file
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User resume
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Resume not found
 *       500:
 *         description: Internal server error
 */
router.get("/resume/:userFileId", downloadUserFile);

/**
 * @swagger
 * /users/userId/{userId}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [User]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The ID of the user to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/parameters/User'
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get("/userId/:userId", getUserById);

/**
 * @swagger
 * /users/change-password:
 *   patch:
 *     summary: Change user password
 *     tags: [User]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.patch("/change-password", updatePassword);

/**
 * @swagger
 * /users/interaction/{userId}:
 *   patch:
 *     summary: Update user interactions
 *     tags: [User]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The ID of the user whose interactions are to be updated
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               jobId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully updated interactions
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.patch("/interaction/:userId", updateInteractionsByUserId);

/**
 * @swagger
 * /users/userId/{userId}:
 *   patch:
 *     summary: Update a user by ID
 *     tags: [User]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The ID of the user to update
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               name:
 *                 type: string
 *               phone:
 *                 type: integer
 *               location:
 *                 type: string
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *               experience:
 *                 type: number
 *               resume:
 *                 type: object
 *                 properties:
 *                   data:
 *                     type: string
 *                   contentType:
 *                     type: string
 *                   name:
 *                     type: string
 *               preferences:
 *                 $ref: '#/parameters/Preferences'
 *               interactions:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Updated user details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/parameters/User'
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.patch("/userId/:userId", upload.single("resume"), updateUserById);

/**
 * @swagger
 * /users/{userId}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [User]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The ID of the user to delete
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:userId", checkIsAdmin, removeUserById);

export default router;
