import React, { useState, useEffect } from "react";
import axios from "../api/apiClient";
import {
  Building2,
  Edit2,
  Trash2,
  PlusCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast } from "react-toastify";
import "../styles/Apartments.css";

export default function Apartments() {
  const [apartments, setApartments] = useState([]);
  const [unit, setUnit] = useState("");
  const [floor, setFloor] = useState("");
  const [rent, setRent] = useState("");
  const [status, setStatus] = useState("vacant");
  const [showForm, setShowForm] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [showTenantModal, setShowTenantModal] = useState(false);
  const [tenantForm, setTenantForm] = useState({
    name: "",
    phone: "",
    email: "",
    idNumber: "",
    moveInDate: "",
  });

  const defaultUnits = ["1A", "1B", "2A", "2B", "3A", "3B"];

  useEffect(() => {
    fetchApartments();
  }, []);

  const fetchApartments = async () => {
    try {
      const res = await axios.get("/apartments");
      setApartments(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch apartments");
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!unit || !floor || !rent)
      return toast.error("Please fill in all fields");

    try {
      const res = await axios.post("/apartments", { unit, floor, rent, status });
      setApartments([...apartments, res.data]);
      toast.success("Unit added successfully");
      setUnit("");
      setFloor("");
      setRent("");
      setStatus("vacant");
      setShowForm(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to add unit");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`/apartments/${id}`);
      setApartments(apartments.filter((apt) => apt._id !== id));
      toast.success("Unit deleted");
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  const handleOpenTenantForm = async (apt) => {
    try {
      // If apartment not yet created, create it automatically
      if (!apt._id) {
        const res = await axios.post("/apartments", {
          unit: apt.unit,
          floor: 1,
          rent: 0,
          status: "vacant",
        });
        apt = res.data;
        setApartments([...apartments, apt]);
        toast.info(`Created new unit ${apt.unit}`);
      }

      setSelectedUnit(apt);
      setShowTenantModal(true);
    } catch (err) {
      console.error("Error preparing tenant form:", err);
      toast.error("Failed to prepare tenant form");
    }
  };

  const handleTenantSubmit = async (e) => {
    e.preventDefault();
    const { name, phone, email, idNumber, moveInDate } = tenantForm;

    if (!name || !phone || !idNumber || !moveInDate)
      return toast.error("Please fill all tenant details");

    if (!selectedUnit?._id) {
      return toast.error("Apartment not found. Please refresh and try again.");
    }

    try {
      const res = await axios.put(
        `/apartments/${selectedUnit._id}/tenant`,
        { name, phone, email, idNumber, moveInDate }
      );

      toast.success("Tenant added successfully");
      setShowTenantModal(false);
      setTenantForm({
        name: "",
        phone: "",
        email: "",
        idNumber: "",
        moveInDate: "",
      });
      fetchApartments();
    } catch (err) {
      console.error("❌ Failed to save tenant:", err);
      toast.error("Failed to add tenant");
    }
  };

  return (
    <div className="page-content fade-in">
      {/* Add Unit Form */}
      <div className="add-apartment-card">
        <button onClick={() => setShowForm(!showForm)} className="add-apartment-btn">
          <PlusCircle size={20} />
          <span>{showForm ? "Hide Form" : "Add Unit"}</span>
          {showForm ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {showForm && (
          <form onSubmit={handleAdd} className="add-apartment-form">
            <input
              type="text"
              placeholder="Unit (e.g. 4A)"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
            />
            <input
              type="number"
              placeholder="Floor"
              value={floor}
              onChange={(e) => setFloor(e.target.value)}
            />
            <input
              type="number"
              placeholder="Rent"
              value={rent}
              onChange={(e) => setRent(e.target.value)}
            />
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="vacant">Vacant</option>
              <option value="occupied">Occupied</option>
            </select>
            <button type="submit" className="save-btn">Save Unit</button>
          </form>
        )}
      </div>

      {/* Units Grid */}
      <div className="apartments-grid">
        {defaultUnits.map((unitName) => {
          const apt = apartments.find((a) => a.unit === unitName);
          const statusClass = apt
            ? apt.status === "vacant"
              ? "status-vacant"
              : "status-occupied"
            : "status-unknown";

          return (
            <div
              key={unitName}
              className="apartment-card"
              onClick={() => handleOpenTenantForm(apt || { unit: unitName })}
            >
              <div className={`status-dot ${statusClass}`}></div>
              <div className="apartment-header">
                <div className="icon-box">
                  <Building2 size={24} />
                </div>
                <h3>{unitName}</h3>
              </div>
              <div className="apartment-details">
                <p><span>Floor:</span> {apt ? apt.floor : "—"}</p>
                <p><span>Rent:</span> {apt ? `$${apt.rent}` : "—"}</p>
                <p><span>Status:</span> {apt ? apt.status : "Not Set"}</p>
                {apt?.tenant && <p><span>Tenant:</span> {apt.tenant.name}</p>}
              </div>

              {apt && (
                <div className="card-actions">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenTenantForm(apt);
                    }}
                    className="edit-btn"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(apt._id);
                    }}
                    className="delete-btn"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Tenant Modal */}
      {showTenantModal && (
        <div className="modal-backdrop" onClick={() => setShowTenantModal(false)}>
          <div
            className="tenant-modal"
            onClick={(e) => e.stopPropagation()} // prevent closing on inner click
          >
            <h3>Add Tenant for {selectedUnit?.unit}</h3>
            <form onSubmit={handleTenantSubmit} className="tenant-form">
              <input
                type="text"
                placeholder="Tenant Name"
                value={tenantForm.name}
                onChange={(e) => setTenantForm({ ...tenantForm, name: e.target.value })}
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={tenantForm.phone}
                onChange={(e) => setTenantForm({ ...tenantForm, phone: e.target.value })}
              />
              <input
                type="email"
                placeholder="Email Address"
                value={tenantForm.email}
                onChange={(e) => setTenantForm({ ...tenantForm, email: e.target.value })}
              />
              <input
                type="text"
                placeholder="Passport / ID Number"
                value={tenantForm.idNumber}
                onChange={(e) => setTenantForm({ ...tenantForm, idNumber: e.target.value })}
              />
              <input
                type="date"
                placeholder="Move-in Date"
                value={tenantForm.moveInDate}
                onChange={(e) => setTenantForm({ ...tenantForm, moveInDate: e.target.value })}
              />

              <div className="modal-actions">
                <button type="submit" className="save-btn">Save Tenant</button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowTenantModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
