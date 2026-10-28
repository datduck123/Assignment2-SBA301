import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { newsApi } from "../../api/newsApi";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { formatDate } from "../../utils/formatters";

export default function NewsDetailPage() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const data = await newsApi.getById(id);
        setArticle(data);
      } catch (err) {
        console.error("Error fetching news detail:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!article) return <div className="card">News article not found.</div>;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ marginBottom: "16px" }}>
        <Link to="/" className="btn btn-secondary btn-sm">
          ← Back to News Portal
        </Link>
      </div>

      <div className="card">
        <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
          <span className="badge badge-active">{article.categoryName}</span>
          {article.tags?.map((t) => (
            <span key={t.id} className="badge badge-staff">
              #{t.name}
            </span>
          ))}
        </div>

        <h1
          style={{
            fontSize: "26px",
            marginBottom: "12px",
            color: "var(--text-main)",
          }}
        >
          {article.title}
        </h1>

        <div
          style={{
            fontSize: "13px",
            color: "var(--text-muted)",
            marginBottom: "20px",
          }}
        >
          Published: {formatDate(article.createdDate)} | Author:{" "}
          {article.createdByName || "Staff"} | Source:{" "}
          {article.source || "FUNews"}
        </div>

        {article.headline && (
          <div
            style={{
              fontSize: "16px",
              fontWeight: "500",
              color: "var(--text-muted)",
              marginBottom: "20px",
              borderLeft: "4px solid var(--primary)",
              paddingLeft: "12px",
            }}
          >
            {article.headline}
          </div>
        )}

        <div
          style={{
            lineHeight: "1.8",
            fontSize: "15px",
            color: "var(--text-main)",
            whiteSpace: "pre-wrap",
          }}
        >
          {article.content}
        </div>
      </div>
    </div>
  );
}
