import axiosInstance from "./axiosInstance";

// Application API requests

export const getAllApplications = () => {
  return axiosInstance.get(`/applications`);
};

export const getApplicationById = (applicationId: string) => {
  return axiosInstance.get(`/applications/applicationId/${applicationId}`);
};

export const getApplicationByUserId = (userId: string) => {
  return axiosInstance.get(`/applications/user/${userId}`);
};

export const getApplicationsByEmployerId = (employerId: string) => {
  return axiosInstance.get(`/applications/employer/${employerId}`);
};

export const checkUserApplication = (userId: string, jobId: string) => {
  return axiosInstance.get(
    `/applications/check?userId=${userId}&jobId=${jobId}`
  );
};

export const deleteApplicationById = (applicationId: string) => {
  return axiosInstance.delete(`/applications/${applicationId}`);
};

export const updateApplicationById = (applicationId: string, body: any) => {
  return axiosInstance.patch(`/applications/${applicationId}`, body, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const createApplication = (body: any, isFile?: boolean) => {
  return axiosInstance.post(`/applications`, body, {
    headers: {
      "Content-Type": isFile ? "multipart/form-data" : "application/json",
    },
  });
};

export const downloadApplicationFile = (applicationFileId: string) => {
  return axiosInstance.get(`/applications/downloadFile/${applicationFileId}`, {
    responseType: "blob",
  });
};
