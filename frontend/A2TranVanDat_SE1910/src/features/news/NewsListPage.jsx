import React, { useState, useEffect } from "react";
import { newsApi } from "../../api/newsApi";
import { categoryApi } from "../../api/categoryApi";
import { tagApi } from "../../api/tagApi";
import { useAuth } from "../../context/AuthContext";
import SearchBar from "../../components/common/SearchBar";
import Pagination from "../../components/common/Pagination";
import ConfirmModal from "../../components/common/ConfirmModal";
import NewsModal from "./NewsModal";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { formatDate } from "../../utils/formatters";

export default function NewsListPage() {
  const { user } = useAuth();
  const [news, setNews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    mode: "CREATE",
    data: null,
  });
  const [deleteConfig, setDeleteConfig] = useState({
    isOpen: false,
    item: null,
  });

  useEffect(() => {
    loadAuxiliaryData();
  }, []);

  useEffect(() => {
    loadNews();
  }, [keyword, page]);

  const loadAuxiliaryData = async () => {
    try {
      const [cats, tgs] = await Promise.all([
        categoryApi.getAll(),
        tagApi.getAll(),
      ]);
      setCategories(cats || []);
      setTags(tgs || []);
    } catch (err) {
      console.error("Error fetching categories/tags:", err);
    }
  };

  const loadNews = async () => {
    try {
      setLoading(true);
      const res = await newsApi.getAll(keyword, page, 8);
      setNews(res.content || []);
      setTotalPages(res.totalPages || 0);
    } catch (err) {
      console.error("Error fetching news:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data) => {
    try {
      if (modalConfig.mode === "CREATE") {
        await newsApi.create(data);
      } else {
        await newsApi.update(modalConfig.data.id, data);
      }
      setModalConfig({ isOpen: false, mode: "CREATE", data: null });
      loadNews();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save news article");
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await newsApi.delete(deleteConfig.item.id);
      setDeleteConfig({ isOpen: false, item: null });
      loadNews();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete article");
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">News Articles Management</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
            Staff Workspace: Create, Update, Delete & Search Campus News with
            Tags
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() =>
            setModalConfig({ isOpen: true, mode: "CREATE", data: null })
          }
        >
          + Create Article
        </button>
      </div>

      <div className="card">
        <SearchBar
          keyword={keyword}
          onSearchChange={(v) => {
            setKeyword(v);
            setPage(0);
          }}
          placeholder="Search title or content..."
        />

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Tags</th>
                  <th>Created</th>
                  <th>Author</th>
                  <th>Status</th>
                  <th style={{ textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {news.length > 0 ? (
                  news.map((n) => (
                    <tr key={n.id}>
                      <td>
                        <strong>{n.id}</strong>
                      </td>
                      <td>{n.title}</td>
                      <td>
                        <span className="badge badge-staff">
                          {n.categoryName}
                        </span>
                      </td>
                      <td>
                        {n.tags?.map((t) => (
                          <span
                            key={t.id}
                            style={{
                              fontSize: "11px",
                              marginRight: "4px",
                              color: "var(--primary)",
                            }}
                          >
                            #{t.name}
                          </span>
                        ))}
                      </td>
                      <td>{formatDate(n.createdDate)}</td>
                      <td>{n.createdByName || "-"}</td>
                      <td>
                        <span
                          className={`badge ${n.status ? "badge-active" : "badge-inactive"}`}
                        >
                          {n.status ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{ marginRight: "8px" }}
                          onClick={() =>
                            setModalConfig({
                              isOpen: true,
                              mode: "UPDATE",
                              data: n,
                            })
                          }
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() =>
                            setDeleteConfig({ isOpen: true, item: n })
                          }
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      style={{ textAlign: "center", padding: "30px" }}
                    >
                      No articles found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <Pagination
          pageNumber={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>

      {modalConfig.isOpen && (
        <NewsModal
          key={modalConfig.data ? modalConfig.data.id : "create"}
          isOpen={modalConfig.isOpen}
          mode={modalConfig.mode}
          initialData={modalConfig.data}
          categories={categories}
          tags={tags}
          staffId={user?.id}
          onClose={() =>
            setModalConfig({ isOpen: false, mode: "CREATE", data: null })
          }
          onSave={handleSave}
        />
      )}

      <ConfirmModal
        isOpen={deleteConfig.isOpen}
        title="Delete News Article"
        message={`Are you sure you want to delete article "${deleteConfig.item?.title}"?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfig({ isOpen: false, item: null })}
      />
    </div>
  );
}
