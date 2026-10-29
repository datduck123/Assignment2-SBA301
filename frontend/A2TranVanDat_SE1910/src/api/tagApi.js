import axiosClient from "./axiosClient";

export const tagApi = {
  getAll: () => axiosClient.get("/tags"),
  create: (data) => axiosClient.post("/tags", data),
};
