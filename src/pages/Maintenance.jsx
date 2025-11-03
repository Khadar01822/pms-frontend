import React, { useEffect, useState } from "react";
import axios from "../api/apiClient";
import { Wrench, PlusCircle, X } from "lucide-react";
import { toast } from "react-toastify";
import "../styles/Maintenance.css";

export default function Maintenance() {
  const [activeList, setActiveList] = useState([]);
  const [completedList, setCompletedList] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("active");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    tenant: "",
    apartment: "",
    description: "",
    amount: "",
    status: "pending",
    reportedBy: "tenant",
  });

  useEffect(() => {
    fetchTenants();
    fetchActive();
    fetchCompleted();
  }, []);

  const fetchTenants = async () => {
    try {
      const res = await axios.get("tenants");
      setTenants(res.data || []);
    } catch (err) {
      console.error("fetchTenants error:", err);
      toast.error("Failed to load tenants");
    }
  };

  const fetchActive = async () => {
    try {
      setLoading(true);
      const res = await axios.get("maintenance/active");
      setActiveList(res.data || []);
    } catch (err) {
      console.error("fetchActive error:", err);
      toast.error("Failed to load active maintenance");
    } finally {
      setLoading(false);
    }
  };

  const fetchCompleted = async () => {
    try {
      const res = await axios.get("maintenance/completed");
      setCompletedList(res.data || []);
    } catch (err) {
      console.error("fetchCompleted error:", err);
      toast.error("Failed to load completed maintenance");
    }
  };

  const refreshAll = () => {
    fetchActive();
    fetchCompleted();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.description || !formData.tenant || !formData.apartment) {
      toast.error("Please select tenant, apartment and describe the issue");
      return;
    }
    try {
      const payload = {
        tenant: formData.tenant,
        apartment: formData.apartment,
        description: formData.description,
        amount: Number(formData.amount) || 0,
        status: formData.status,
        reportedBy: formData.reportedBy || "tenant",
      };

      const res = await axios.post("maintenance", payload);
      toast.success("Maintenance request saved!");
      setShowModal(false);
      setFormData({
        tenant: "",
        apartment: "",
        description: "",
        amount: "",
        status: "pending",
        reportedBy: "tenant",
      });
      refreshAll();

      if (res?.data) setActiveList((prev) => [res.data, ...prev]);
    } catch (err) {
      console.error("handleSubmit error:", err.response?.data || err.message);
      const msg =
        err.response?.data?.message || "Failed to save maintenance request";
      toast.error(msg);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`maintenance/${id}`, { status: newStatus });
      toast.info("Status updated");
      refreshAll();
    } catch (err) {
      console.error("handleStatusChange error:", err);
      toast.error("Failed to update status");
    }
  };

  const handleTenantSelect = (tenantId) => {
    const t = tenants.find((x) => x._id === tenantId);
    setFormData((prev) => ({
      ...prev,
      tenant: tenantId,
      apartment: t?.apartment?._id || "",
    }));
  };

  const statusLabels = {
    pending: "Pending",
    in_progress: "In Progress",
    fixed: "Completed",
  };

  const displayedList = activeTab === "active" ? activeList : completedList;

  return (
    <div className="maintenance-page">
      <div className="header">
        <div className="header-left">
          <Wrench size={22} />
          <h2>Maintenance Requests</h2>
        </div>

        <div className="header-right">
          <button className="add-btn" onClick={() => setShowModal(true)}>
            <PlusCircle size={14} /> Add Request
          </button>
        </div>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === "active" ? "active" : ""}`}
          onClick={() => setActiveTab("active")}
        >
          Active Issues ({activeList.length})
        </button>
        <button
          className={`tab ${activeTab === "completed" ? "active" : ""}`}
          onClick={() => setActiveTab("completed")}
        >
          Completed ({completedList.length})
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : displayedList.length > 0 ? (
        <div className="table-container">
          <table className="maintenance-table">
            <thead>
              <tr>
                <th>Tenant</th>
                <th>Apartment</th>
                <th>Issue</th>
                <th>Amount (KSH)</th>
                <th>Status</th>
                <th>Date Reported</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {displayedList.map((m) => (
                <tr key={m._id}>
                  <td data-label="Tenant">{m.tenant?.name || "—"}</td>
                  <td data-label="Apartment">{m.apartment?.unit || "—"}</td>
                  <td data-label="Issue">{m.description || "—"}</td>
                  <td data-label="Amount">
                    KSH {m.amount?.toLocaleString() ?? "0"}
                  </td>
                  <td data-label="Status">
                    <span className={`status-tag ${m.status}`}>
                      {statusLabels[m.status] || m.status}
                    </span>
                  </td>
                  <td data-label="Date">
                    {m.dateReported
                      ? new Date(m.dateReported).toLocaleDateString()
                      : "—"}
                  </td>
                  <td data-label="Action">
                    {m.status !== "fixed" ? (
                      <button
                        className="complete-btn"
                        onClick={() => handleStatusChange(m._id, "fixed")}
                      >
                        Mark Completed
                      </button>
                    ) : (
                      <span className="muted">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p style={{ marginTop: 16 }}>
          {activeTab === "active"
            ? "No active maintenance requests."
            : "No completed records yet."}
        </p>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="close-btn" onClick={() => setShowModal(false)}>
              <X size={18} />
            </button>

            <h3>Add Maintenance Request</h3>

            <form onSubmit={handleSubmit} className="maintenance-form">
              <label>Tenant</label>
              <select
                value={formData.tenant}
                onChange={(e) => handleTenantSelect(e.target.value)}
              >
                <option value="">Select Tenant</option>
                {tenants.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name} {t.apartment?.unit ? `(${t.apartment.unit})` : ""}
                  </option>
                ))}
              </select>

              <label>Apartment</label>
              <input
                type="text"
                value={
                  tenants.find((t) => t._id === formData.tenant)?.apartment
                    ?.unit || ""
                }
                readOnly
              />

              <label>Issue Description</label>
              <input
                type="text"
                placeholder="Describe the issue"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />

              <label>Amount (KSH)</label>
              <input
                type="number"
                placeholder="Estimated cost (optional)"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
              />

              <label>Status</label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="fixed">Completed</option>
              </select>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  Save Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
