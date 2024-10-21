import axiosInstance from "./axiosInstance";

export const getAllCount = () => {
  return axiosInstance.get(`/count`);
};
