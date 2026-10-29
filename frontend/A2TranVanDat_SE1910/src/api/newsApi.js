import axiosClient from "./axiosClient";

export const newsApi = {
  getPublicNews: () => axiosClient.get("/news/public"),
  getAll: (
    keyword = "",
    page = 0,
    size = 10,
    sortBy = "createdDate",
    direction = "desc",
  ) =>
    axiosClient.get("/news", {
      params: { keyword, page, size, sortBy, direction },
    }),
  getById: (id) => axiosClient.get(`/news/${id}`),
  getHistoryByStaff: (staffId) => axiosClient.get(`/news/history/${staffId}`),
  create: (data) => axiosClient.post("/news", data),
  update: (id, data) => axiosClient.put(`/news/${id}`, data),
  delete: (id) => axiosClient.delete(`/news/${id}`),
};
