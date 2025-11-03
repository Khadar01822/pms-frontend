import React, { useEffect, useState } from "react";
import axios from "../api/apiClient";
import { Trash2, Edit3, UserPlus, X } from "lucide-react";
import { toast } from "react-toastify";
import "../styles/Tenants.css"; // ✅ Import the CSS file

export default function Tenants() {
  const [tenants, setTenants] = useState([]);
  const [editingTenant, setEditingTenant] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    idNumber: "",
    rent: "",
  });

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      const res = await axios.get("/tenants");
      setTenants(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load tenants");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this tenant?")) return;
    try {
      await axios.delete(`/tenants/${id}`);
      toast.success("Tenant removed");
      fetchTenants();
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  const handleEdit = (tenant) => {
    setEditingTenant(tenant);
    setFormData({
      name: tenant.name,
      phone: tenant.phone,
      email: tenant.email,
      idNumber: tenant.idNumber,
      rent: tenant.apartment?.rent || "",
    });
  };

  const handleUpdate = async () => {
  try {
    // Update tenant basic info
    await axios.put(`/tenants/${editingTenant._id}`, {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      idNumber: formData.idNumber,
    });

    // Update apartment rent if it has changed
    if (editingTenant.apartment?._id && formData.rent) {
      await axios.put(`/apartments/${editingTenant.apartment._id}`, {
        rent: formData.rent,
      });
    }

    toast.success("Tenant and rent updated successfully");
    setEditingTenant(null);
    fetchTenants();
  } catch (err) {
    console.error(err);
    toast.error("Update failed");
  }
};


  return (
    <div className="tenants-page">
      <div className="tenants-header">
        <UserPlus size={22} />
        <h2>Current Tenants</h2>
      </div>

      {tenants.length > 0 ? (
        <div className="tenants-container">
          {tenants.map((t) => (
            <div className="tenant-card" key={t._id}>
              <h3>{t.name}</h3>
              <p>📞 {t.phone || "—"}</p>
              <p>✉️ {t.email || "—"}</p>
              <p>🪪 {t.idNumber || "—"}</p>
              <p>🏠 {t.apartment?.unit || "—"}</p>
              <p>💰 Rent: KSH {t.apartment?.rent || "—"}</p>
              <p>📅 {t.moveInDate ? new Date(t.moveInDate).toLocaleDateString() : "—"}</p>
              <p>
                ⚙️ Status:{" "}
                <span className={`status ${t.apartment?.status?.toLowerCase()}`}>
                  {t.apartment?.status || "—"}
                </span>
              </p>

              <div className="tenant-actions">
                <button className="edit-btn" onClick={() => handleEdit(t)}>
                  <Edit3 size={16} /> Edit
                </button>
                <button className="delete-btn" onClick={() => handleDelete(t._id)}>
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No tenants found.</p>
      )}

      {/* 🧾 Edit Modal */}
      {editingTenant && (
        <div className="modal-overlay">
          <div className="modal">
            <button onClick={() => setEditingTenant(null)} className="close-btn">
              <X size={20} />
            </button>
            <h3>Edit Tenant</h3>

            <div className="form-fields">
              {["name", "phone", "email", "idNumber", "rent"].map((field) => (
                <div key={field} className="form-group">
                  <label>{field}</label>
                  <input
                    type={field === "rent" ? "number" : "text"}
                    value={formData[field]}
                    onChange={(e) =>
                      setFormData({ ...formData, [field]: e.target.value })
                    }
                  />
                </div>
              ))}
            </div>

            <div className="modal-actions">
              <button onClick={() => setEditingTenant(null)} className="cancel-btn">
                Cancel
              </button>
              <button onClick={handleUpdate} className="save-btn">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
