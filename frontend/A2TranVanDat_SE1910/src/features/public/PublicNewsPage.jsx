import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { newsApi } from "../../api/newsApi";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { formatDate } from "../../utils/formatters";

export default function PublicNewsPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPublicNews();
  }, []);

  const loadPublicNews = async () => {
    try {
      setLoading(true);
      const data = await newsApi.getPublicNews();
      setArticles(data || []);
    } catch (err) {
      console.error("Error fetching public news:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Featured Campus News</h2>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "14px",
              marginTop: "4px",
            }}
          >
            Official announcements, events and updates from FUNews (Public
            Portal)
          </p>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : articles.length > 0 ? (
        <div className="news-grid">
          {articles.map((item) => (
            <div
              key={item.id}
              className="card"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <div style={{ marginBottom: "8px" }}>
                <span className="badge badge-active">
                  {item.categoryName || "General"}
                </span>
              </div>
              <h3 className="news-card-title">{item.title}</h3>
              <div className="news-card-meta">
                Posted on {formatDate(item.createdDate)} by{" "}
                {item.createdByName || "Staff"}
              </div>
              <p
                style={{
                  fontSize: "14px",
                  color: "var(--text-muted)",
                  lineHeight: "1.5",
                  flex: 1,
                  marginBottom: "16px",
                }}
              >
                {item.headline || item.content?.substring(0, 120) + "..."}
              </p>
              <div>
                <Link
                  to={`/news/${item.id}`}
                  className="btn btn-secondary btn-sm"
                  style={{ width: "100%" }}
                >
                  Read Full Story →
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{ textAlign: "center", padding: "40px" }}>
          No active news articles published yet.
        </div>
      )}
    </div>
  );
}
