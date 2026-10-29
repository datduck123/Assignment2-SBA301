import React, { useState, useEffect, useMemo } from "react";
import { newsApi } from "../../api/newsApi";
import { categoryApi } from "../../api/categoryApi";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import SearchBar from "../../components/common/SearchBar";
import { formatDate } from "../../utils/formatters";

export default function PublicNewsTablePage() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [newsData, catData] = await Promise.all([
        newsApi.getPublicNews(),
        categoryApi.getAll(),
      ]);
      setArticles(newsData || []);
      setCategories(catData || []);
    } catch (err) {
      console.error("Error loading public news or categories:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = useMemo(() => {
    return articles.filter((item) => {
      const matchCat =
        !selectedCategory ||
        item.categoryId?.toString() === selectedCategory.toString();

      const kw = keyword.trim().toLowerCase();
      if (!kw) return matchCat;

      const matchText =
        item.title?.toLowerCase().includes(kw) ||
        item.headline?.toLowerCase().includes(kw) ||
        item.content?.toLowerCase().includes(kw) ||
        item.categoryName?.toLowerCase().includes(kw) ||
        item.createdByName?.toLowerCase().includes(kw) ||
        item.tags?.some((t) => t.name?.toLowerCase().includes(kw));

      return matchCat && matchText;
    });
  }, [articles, selectedCategory, keyword]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Public News Portal</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
            Published and active campus news articles displayed in a structured table list
          </p>
        </div>
        <div>
          <span className="badge badge-active">
            {filteredArticles.length} Active {filteredArticles.length === 1 ? "Article" : "Articles"}
          </span>
        </div>
      </div>

      <div className="card">
        <div
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
            flexWrap: "wrap",
            marginBottom: "16px",
          }}
        >
          <div style={{ flex: 1, minWidth: "260px" }}>
            <SearchBar
              keyword={keyword}
              onSearchChange={setKeyword}
              placeholder="Search news by title, headline, tags, author..."
            />
          </div>

          <div style={{ minWidth: "200px" }}>
            <select
              className="form-control"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                padding: "9px 12px",
                borderRadius: "6px",
                border: "1px solid var(--border-color)",
                background: "var(--bg-card)",
                color: "var(--text-main)",
                width: "100%",
                fontSize: "14px",
              }}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th style={{ width: "70px" }}>ID</th>
                  <th style={{ minWidth: "280px" }}>Title & Headline</th>
                  <th style={{ width: "160px" }}>Category</th>
                  <th style={{ width: "160px" }}>Tags</th>
                  <th style={{ width: "130px" }}>Author</th>
                  <th style={{ width: "120px" }}>Source</th>
                  <th style={{ width: "150px" }}>Published Date</th>
                  <th style={{ width: "110px", textAlign: "center" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredArticles.length > 0 ? (
                  filteredArticles.map((n) => (
                    <tr key={n.id}>
                      <td>
                        <strong>{n.id}</strong>
                      </td>
                      <td>
                        <div
                          style={{
                            fontWeight: 600,
                            color: "var(--text-main)",
                            marginBottom: "4px",
                          }}
                        >
                          {n.title}
                        </div>
                        {n.headline && (
                          <div
                            style={{
                              fontSize: "12px",
                              color: "var(--text-muted)",
                              lineHeight: "1.4",
                            }}
                          >
                            {n.headline}
                          </div>
                        )}
                      </td>
                      <td>
                        <span className="badge badge-staff">
                          {n.categoryName || "General"}
                        </span>
                      </td>
                      <td>
                        {n.tags && n.tags.length > 0 ? (
                          n.tags.map((t) => (
                            <span
                              key={t.id}
                              style={{
                                fontSize: "11px",
                                marginRight: "4px",
                                display: "inline-block",
                                color: "var(--primary)",
                                fontWeight: 500,
                              }}
                            >
                              #{t.name}
                            </span>
                          ))
                        ) : (
                          <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>-</span>
                        )}
                      </td>
                      <td>{n.createdByName || "Staff"}</td>
                      <td>
                        <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                          {n.source || "N/A"}
                        </span>
                      </td>
                      <td style={{ fontSize: "13px" }}>{formatDate(n.createdDate)}</td>
                      <td style={{ textAlign: "center" }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => setSelectedArticle(n)}
                        >
                          👁️ View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      style={{ textAlign: "center", padding: "36px", color: "var(--text-muted)" }}
                    >
                      No public news articles match the filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal for viewing full news story inside admin/staff layout */}
      {selectedArticle && (
        <div className="modal-backdrop" onClick={() => setSelectedArticle(null)}>
          <div
            className="modal-card"
            style={{ maxWidth: "720px", maxHeight: "85vh", overflowY: "auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "12px",
              }}
            >
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <span className="badge badge-active">
                  {selectedArticle.categoryName || "General"}
                </span>
                {selectedArticle.tags?.map((t) => (
                  <span key={t.id} className="badge badge-staff">
                    #{t.name}
                  </span>
                ))}
              </div>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setSelectedArticle(null)}
              >
                ✕ Close
              </button>
            </div>

            <h2
              style={{
                fontSize: "20px",
                fontWeight: 700,
                color: "var(--text-main)",
                marginBottom: "10px",
                lineHeight: "1.3",
              }}
            >
              {selectedArticle.title}
            </h2>

            <div
              style={{
                fontSize: "12px",
                color: "var(--text-muted)",
                marginBottom: "16px",
                paddingBottom: "10px",
                borderBottom: "1px solid var(--border-color)",
              }}
            >
              Published on <strong>{formatDate(selectedArticle.createdDate)}</strong> by{" "}
              <strong>{selectedArticle.createdByName || "Staff"}</strong> | Source:{" "}
              <strong>{selectedArticle.source || "FUNews"}</strong>
            </div>

            {selectedArticle.headline && (
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "var(--text-main)",
                  background: "var(--bg-table-th)",
                  borderLeft: "4px solid var(--primary)",
                  padding: "10px 14px",
                  borderRadius: "4px",
                  marginBottom: "16px",
                  lineHeight: "1.5",
                }}
              >
                {selectedArticle.headline}
              </div>
            )}

            <div
              style={{
                fontSize: "14px",
                lineHeight: "1.8",
                color: "var(--text-main)",
                whiteSpace: "pre-wrap",
                marginBottom: "24px",
              }}
            >
              {selectedArticle.content}
            </div>

            <div className="modal-footer" style={{ marginTop: "16px" }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setSelectedArticle(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

