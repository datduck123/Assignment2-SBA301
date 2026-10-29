import React, { useState, useEffect } from "react";
import { newsApi } from "../../api/newsApi";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { formatDate } from "../../utils/formatters";

export default function MyNewsHistoryPage() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadHistory();
    }
  }, [user]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = await newsApi.getHistoryByStaff(user.id);
      setHistory(data || []);
    } catch (err) {
      console.error("Error fetching staff news history:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">My News History</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
            All articles originally authored and published by your account (
            {user?.name})
          </p>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <LoadingSpinner />
        ) : history.length > 0 ? (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Article ID</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Created Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <strong>{item.id}</strong>
                    </td>
                    <td>{item.title}</td>
                    <td>
                      <span className="badge badge-staff">
                        {item.categoryName}
                      </span>
                    </td>
                    <td>{formatDate(item.createdDate)}</td>
                    <td>
                      <span
                        className={`badge ${item.status ? "badge-active" : "badge-inactive"}`}
                      >
                        {item.status ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              color: "var(--text-muted)",
            }}
          >
            You have not created any news articles yet.
          </div>
        )}
      </div>
    </div>
  );
}
