import axiosInstance from "./axiosInstance";

// User API requests
export const getUserById = (userId: string) => {
  return axiosInstance.get(`/users/userId/${userId}`);
};

export const updateUserById = (
  userId: string,
  body: any,
  isResume: boolean
) => {
  return axiosInstance.patch(`/users/userId/${userId}`, body, {
    headers: {
      "Content-Type": isResume ? "multipart/form-data" : "application/json",
    },
  });
};

export const getResumeById = (userFileId: string) => {
  return axiosInstance.get(`/users/resume/${userFileId}`, {
    responseType: "blob",
  });
};

export const updatePassword = (body: any) => {
  return axiosInstance.patch(`/users/change-password`, body, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const updateInteractions = (userId: string, body: any) => {
  return axiosInstance.patch(`/users/interaction/${userId}`, body, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
