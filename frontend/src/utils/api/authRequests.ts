import axiosInstance from "./axiosInstance";

interface LoginRequest {
  email: string;
  password: string;
}

// Authentication API requests

export const postLogin = (reqBody: LoginRequest) => {
  return axiosInstance.post(`/auth/login`, reqBody, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const postSignup = (reqBody: any) => {
  return axiosInstance.post(`/auth/signup`, reqBody, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const forgotPassword = (body: any) => {
  return axiosInstance.post(`/auth/forgot-password`, body, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const resetPassword = (token: string, body: any) => {
  return axiosInstance.post(`/auth/reset-password/${token}`, body, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const tokenExpiryCheck = (token: string) => {
  return axiosInstance.get(`/auth/token-expiry/${token}`);
};
