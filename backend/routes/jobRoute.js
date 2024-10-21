import express from "express";
import {
  createJob,
  deleteJobByJobId,
  getAllJobs,
  getJobByJobId,
  getJobsByOwner,
  getRecommendedJobs,
  searchJobs,
  updateJobByJobId,
} from "../controller/jobController.js";
import { checkAuth } from "../middleware/checkAuth.js";
import { checkIsAdminOrEmployer } from "../middleware/checkIsAdminOrEmployer.js";
import { checkIsEmployer } from "../middleware/checkIsEmployer.js";

const router = express.Router();

/**
 * @swagger
 * /jobs:
 *   get:
 *     summary: Get all jobs
 *     description: Get all jobs.
 *     tags: [Job]
 *     responses:
 *       200:
 *         description: Successfully fetched list of jobs.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 jobList:
 *                   type: array
 *                   items:
 *                     $ref: '#/parameters/Job'
 *       500:
 *         description: Internal Server Error
 */
router.get("/", getAllJobs);

/**
 * @swagger
 * /jobs/search:
 *   post:
 *     summary: Search for jobs
 *     tags: [Job]
 *     description: Search for jobs based on criteria such as job type, location, etc.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               jobType:
 *                 type: array
 *                 items:
 *                   type: string
 *               location:
 *                 type: array
 *                 items:
 *                   type: string
 *               industry:
 *                 type: array
 *                 items:
 *                   type: string
 *               salaryMin:
 *                 type: number
 *               salaryMax:
 *                 type: number
 *     responses:
 *       200:
 *         description: Successfully fetched jobs based on search criteria.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 jobs:
 *                   type: array
 *                   items:
 *                     $ref: '#/parameters/Job'
 *       500:
 *         description: Internal Server Error
 */
router.post("/search", searchJobs);

/**
 * @swagger
 * /jobs/recommended/{userId}:
 *   get:
 *     summary: Get recommended jobs for a user
 *     tags: [Job]
 *     description: Get recommended jobs for a user.
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully fetched recommended jobs.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 jobs:
 *                   type: array
 *                   items:
 *                     $ref: '#/parameters/Job'
 *       404:
 *         description: Jobs not found
 *       500:
 *         description: Internal Server Error
 */
router.get("/recommended/:userId", checkAuth, getRecommendedJobs);

/**
 * @swagger
 * /jobs/employer/{employerId}:
 *   get:
 *     summary: Get jobs by employer
 *     tags: [Job]
 *     description: Get jobs by employer.
 *     parameters:
 *      - name: employerId
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *     responses:
 *       200:
 *         description: Successfully fetched jobs.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 jobList:
 *                   type: array
 *                   items:
 *                     $ref: '#/parameters/Job'
 *       500:
 *         description: Internal Server Error
 */
router.get(
  "/employer/:employerId",
  checkAuth,
  checkIsAdminOrEmployer,
  getJobsByOwner
);

/**
 * @swagger
 * /jobs/jobId/{jobId}:
 *   get:
 *     summary: Get job by ID
 *     tags: [Job]
 *     description: Get job by ID.
 *     parameters:
 *       - name: jobId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully fetched job details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 job:
 *                   $ref: '#/parameters/Job'
 *       404:
 *         description: Job not found
 *       500:
 *         description: Internal Server Error
 */
router.get("/jobId/:jobId", getJobByJobId);

router.use(checkAuth);

/**
 * @swagger
 * /jobs:
 *   post:
 *     summary: Create a new job
 *     tags: [Job]
 *     description: Create a new job.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              job:
 *                $ref: '#/parameters/Job'
 *     responses:
 *       201:
 *         description: Created job successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 job:
 *                   $ref: '#/parameters/Job'
 *       500:
 *         description: Internal Server Error
 */
router.post("/", checkIsEmployer, createJob);

/**
 * @swagger
 * /jobs/{jobId}:
 *   delete:
 *     summary: Delete a job by ID
 *     tags: [Job]
 *     description: Delete a job by ID.
 *     parameters:
 *       - name: jobId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully deleted the job.
 *       404:
 *         description: Job not found
 *       500:
 *         description: Internal Server Error
 */
router.delete("/:jobId", checkIsAdminOrEmployer, deleteJobByJobId);

/**
 * @swagger
 * /jobs/{jobId}:
 *   patch:
 *     summary: Update a job by ID
 *     tags: [Job]
 *     description: Update a job by ID.
 *     parameters:
 *       - name: jobId
 *         in: path
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
 *              job:
 *                $ref: '#/parameters/Job'
 *     responses:
 *       200:
 *         description: Updation Successfull.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 job:
 *                   $ref: '#/parameters/Job'
 *       404:
 *         description: Job not found
 *       500:
 *         description: Internal Server Error
 */
router.patch("/:jobId", checkIsAdminOrEmployer, updateJobByJobId);

export default router;
