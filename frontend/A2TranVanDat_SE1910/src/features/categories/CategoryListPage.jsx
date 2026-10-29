import React, { useState, useEffect } from "react";
import { categoryApi } from "../../api/categoryApi";
import SearchBar from "../../components/common/SearchBar";
import ConfirmModal from "../../components/common/ConfirmModal";
import CategoryModal from "./CategoryModal";
import LoadingSpinner from "../../components/common/LoadingSpinner";

export default function CategoryListPage() {
  const [categories, setCategories] = useState([]);
  const [keyword, setKeyword] = useState("");
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
    loadCategories();
  }, [keyword]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = keyword.trim()
        ? await categoryApi.search(keyword.trim())
        : await categoryApi.getAll();
      setCategories(data || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data) => {
    try {
      if (modalConfig.mode === "CREATE") {
        await categoryApi.create(data);
      } else {
        await categoryApi.update(modalConfig.data.id, data);
      }
      setModalConfig({ isOpen: false, mode: "CREATE", data: null });
      loadCategories();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save category");
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await categoryApi.delete(deleteConfig.item.id);
      setDeleteConfig({ isOpen: false, item: null });
      loadCategories();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Cannot delete: Category is linked to existing news articles!",
      );
      setDeleteConfig({ isOpen: false, item: null });
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Category Management</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
            Staff Workspace: Manage news categories with parent-child structure
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() =>
            setModalConfig({ isOpen: true, mode: "CREATE", data: null })
          }
        >
          + Add Category
        </button>
      </div>

      <div className="card">
        <SearchBar
          keyword={keyword}
          onSearchChange={setKeyword}
          placeholder="Search categories by name..."
        />

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Category Name</th>
                  <th>Description</th>
                  <th>Parent Category</th>
                  <th>Status</th>
                  <th style={{ textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.length > 0 ? (
                  categories.map((c) => (
                    <tr key={c.id}>
                      <td>{c.id}</td>
                      <td>
                        <strong>{c.name}</strong>
                      </td>
                      <td>{c.description || "-"}</td>
                      <td>{c.parentName || "-"}</td>
                      <td>
                        <span
                          className={`badge ${c.isActive ? "badge-active" : "badge-inactive"}`}
                        >
                          {c.isActive ? "Active" : "Inactive"}
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
                              data: c,
                            })
                          }
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() =>
                            setDeleteConfig({ isOpen: true, item: c })
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
                      colSpan="6"
                      style={{ textAlign: "center", padding: "30px" }}
                    >
                      No categories found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <CategoryModal
        isOpen={modalConfig.isOpen}
        mode={modalConfig.mode}
        initialData={modalConfig.data}
        categories={categories}
        onClose={() =>
          setModalConfig({ isOpen: false, mode: "CREATE", data: null })
        }
        onSave={handleSave}
      />

      <ConfirmModal
        isOpen={deleteConfig.isOpen}
        title="Delete Category"
        message={`Are you sure you want to delete category "${deleteConfig.item?.name}"? Action will fail if related news exist.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfig({ isOpen: false, item: null })}
      />
    </div>
  );
}
