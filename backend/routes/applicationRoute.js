import express from "express";
import {
  checkUserApplication,
  createApplication,
  deleteApplicationById,
  downloadApplicationFile,
  getAllApplications,
  getApplicationByEmployerId,
  getApplicationById,
  getApplicationByUserId,
  updateApplicationById,
} from "../controller/applicationController.js";
import { checkAuth } from "../middleware/checkAuth.js";
import { checkIsAdmin } from "../middleware/checkIsAdmin.js";
import upload from "../utils/fileUpload.js";
import { checkIsEmployer } from "../middleware/checkIsEmployer.js";
import { checkIsAdminOrEmployer } from "../middleware/checkIsAdminOrEmployer.js";

const router = express.Router();

router.use(checkAuth);

/**
 * @swagger
 * /applications:
 *   get:
 *     summary: Get all applications
 *     description: List of all job applications. Only accessible by admins.
 *     tags: [Applications]
 *     responses:
 *       200:
 *         description: A list of applications.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 applicationList:
 *                   type: array
 *                   items:
 *                     $ref: '#/parameters/Application'
 *       404:
 *         description: No applications found
 *       500:
 *         description: Internal server error
 */
router.get("/", checkIsAdmin, getAllApplications);

/**
 * @swagger
 * /applications/check:
 *   get:
 *     summary: Check if user applied for a job
 *     description: Check if user applied for a job based on user ID and job ID.
 *     tags: [Applications]
 *     parameters:
 *       - in: query
 *         name: jobId
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Application
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 applied:
 *                   type: boolean
 *                 applicationId:
 *                   type: string
 *       500:
 *         description: Internal server error
 */
router.get("/check", checkUserApplication);

/**
 * @swagger
 * /applications/user/{userId}:
 *   get:
 *     summary: Get applications by user ID
 *     description: Get applications by user ID
 *     tags: [Applications]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: A list of user's applications.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 applicationList:
 *                   type: array
 *                   items:
 *                     $ref: '#/parameters/Application'
 *       404:
 *         description: Applications not found
 *       500:
 *         description: Internal server error
 */
router.get("/user/:userId", getApplicationByUserId);

/**
 * @swagger
 * /applications/employer/{employerId}:
 *   get:
 *     summary: Get applications by employer ID (Only accessible by employers)
 *     description: Get applications by employer ID
 *     tags: [Applications]
 *     parameters:
 *       - in: path
 *         name: employerId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: A list of applications for the jobs created by the employer.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 applicationList:
 *                   type: array
 *                   items:
 *                     $ref: '#/parameters/Application'
 *       404:
 *         description: Applications not found
 *       500:
 *         description: Internal server error
 */
router.get(
  "/employer/:employerId",
  checkIsAdminOrEmployer,
  getApplicationByEmployerId
);

/**
 * @swagger
 * /applications/downloadFile/{applicationFileId}:
 *   get:
 *     summary: Download Application File
 *     tags: [Applications]
 *     parameters:
 *       - name: applicationFileId
 *         in: path
 *         required: true
 *         description: The ID of the file
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Application File
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
router.get("/downloadFile/:applicationFileId", downloadApplicationFile);

/**
 * @swagger
 * /applications/applicationId/{applicationId}:
 *   get:
 *     summary: Get application by ID
 *     description: Get application by ID
 *     tags: [Applications]
 *     parameters:
 *       - in: path
 *         name: applicationId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Application details.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/parameters/Application'
 *       404:
 *         description: Application not found
 *       500:
 *         description: Internal server error
 */
router.get("/applicationId/:applicationId", getApplicationById);

/**
 * @swagger
 * /applications:
 *   post:
 *     summary: Create a new application
 *     description: Create a new application with Resume and Cover Letter.
 *     tags: [Applications]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               jobId:
 *                 type: string
 *               email:
 *                 type: string
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               location:
 *                 type: string
 *               resume:
 *                 type: string
 *                 format: binary
 *               coverLetter:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Successfull creation.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/parameters/Application'
 *       500:
 *         description: Internal server error
 */
router.post(
  "/",
  upload.fields([{ name: "resume" }, { name: "coverLetter" }]),
  createApplication
);

/**
 * @swagger
 * /applications/{applicationId}:
 *   delete:
 *     summary: Delete an application
 *     description: Delete an application by its ID.
 *     tags: [Applications]
 *     parameters:
 *       - in: path
 *         name: applicationId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Application deleted successfully.
 *       404:
 *         description: Application not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:applicationId", deleteApplicationById);

/**
 * @swagger
 * /applications/{applicationId}:
 *   patch:
 *     summary: Update an application
 *     description: Update an application by its ID.
 *     tags: [Applications]
 *     parameters:
 *       - in: path
 *         name: applicationId
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Application updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/parameters/Application'
 *       403:
 *         description: Access denied
 *       404:
 *         description: Application not found
 *       500:
 *         description: Internal server error
 */
router.patch("/:applicationId", checkIsAdminOrEmployer, updateApplicationById);

export default router;
