import axiosClient from "./axiosClient";

export const accountApi = {
  getAll: (keyword = "", page = 0, size = 10) =>
    axiosClient.get("/accounts", { params: { keyword, page, size } }),
  getById: (id) => axiosClient.get(`/accounts/${id}`),
  create: (data) => axiosClient.post("/accounts", data),
  update: (id, data) => axiosClient.put(`/accounts/${id}`, data),
  delete: (id) => axiosClient.delete(`/accounts/${id}`),
};
