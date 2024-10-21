import axiosInstance from "./axiosInstance";

// Job API requests
export const getAllJobs = () => {
  return axiosInstance.get(`/jobs`);
};

export const getJobById = (jobId: string) => {
  return axiosInstance.get(`/jobs/jobId/${jobId}`);
};

export const deleteJobById = (jobId: string) => {
  return axiosInstance.delete(`/jobs/${jobId}`);
};

export const updateJobById = (jobId: string, body: any) => {
  return axiosInstance.patch(`/jobs/${jobId}`, body, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const createJob = (body: any) => {
  return axiosInstance.post(`/jobs`, body, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const getRecommendedJobs = (userId: string) => {
  return axiosInstance.get(`/jobs/recommended/${userId}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const searchFilteredJobs = (body: any) => {
  return axiosInstance.post(`/jobs/search`, body, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const getJobsByOwner = (employerId: string) => {
  return axiosInstance.get(`/jobs/employer/${employerId}`);
};
