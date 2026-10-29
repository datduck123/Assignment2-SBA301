import React, { useState, useEffect } from "react";
import { accountApi } from "../../api/accountApi";
import SearchBar from "../../components/common/SearchBar";
import Pagination from "../../components/common/Pagination";
import ConfirmModal from "../../components/common/ConfirmModal";
import AccountModal from "./AccountModal";
import LoadingSpinner from "../../components/common/LoadingSpinner";

export default function AccountListPage() {
  const [accounts, setAccounts] = useState([]);
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
    loadAccounts();
  }, [keyword, page]);

  const loadAccounts = async () => {
    try {
      setLoading(true);
      const res = await accountApi.getAll(keyword, page, 8);
      setAccounts(res.content || []);
      setTotalPages(res.totalPages || 0);
    } catch (err) {
      console.error("Error fetching accounts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data) => {
    try {
      if (modalConfig.mode === "CREATE") {
        await accountApi.create(data);
      } else {
        await accountApi.update(data.id, data);
      }
      setModalConfig({ isOpen: false, mode: "CREATE", data: null });
      loadAccounts();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save account");
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await accountApi.delete(deleteConfig.item.accountId);
      setDeleteConfig({ isOpen: false, item: null });
      loadAccounts();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Cannot delete: Account is associated with existing news articles!",
      );
      setDeleteConfig({ isOpen: false, item: null });
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Account Management</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
            Admin Workspace: Create, Read, Update, Delete & Search System
            Accounts
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() =>
            setModalConfig({ isOpen: true, mode: "CREATE", data: null })
          }
        >
          + Add Account
        </button>
      </div>

      <div className="card">
        <SearchBar
          keyword={keyword}
          onSearchChange={(val) => {
            setKeyword(val);
            setPage(0);
          }}
          placeholder="Search by name or email..."
        />

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Account ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th style={{ textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {accounts.length > 0 ? (
                  accounts.map((acc) => (
                    <tr key={acc.accountId}>
                      <td>
                        <strong>{acc.accountId}</strong>
                      </td>
                      <td>{acc.name}</td>
                      <td>{acc.email}</td>
                      <td>
                        <span
                          className={`badge ${acc.role === 1 ? "badge-admin" : "badge-staff"}`}
                        >
                          {acc.role === 1 ? "Admin" : "Staff"}
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
                              data: acc,
                            })
                          }
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() =>
                            setDeleteConfig({ isOpen: true, item: acc })
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
                      colSpan="5"
                      style={{ textAlign: "center", padding: "30px" }}
                    >
                      No accounts found.
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
        <AccountModal
          key={
            modalConfig.data
              ? modalConfig.data.accountId ?? modalConfig.data.id
              : "create"
          }
          isOpen={modalConfig.isOpen}
          mode={modalConfig.mode}
          initialData={modalConfig.data}
          onClose={() =>
            setModalConfig({ isOpen: false, mode: "CREATE", data: null })
          }
          onSave={handleSave}
        />
      )}

      <ConfirmModal
        isOpen={deleteConfig.isOpen}
        title="Delete Account"
        message={`Are you sure you want to delete account "${deleteConfig.item?.name}" (${deleteConfig.item?.accountId})? This action will fail if the account has created news.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfig({ isOpen: false, item: null })}
      />
    </div>
  );
}
