import React, { useEffect, useState } from "react";
import api from "../api/apiClient";
import { toast } from "react-toastify";
import { CreditCard, PlusCircle, X } from "lucide-react";
import "../styles/Payments.css";

export default function Payments() {
  const [tenants, setTenants] = useState([]);
  const [payments, setPayments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [formData, setFormData] = useState({
    amount: "",
    month: "",
    paymentMethod: "cash",
    datePaid: new Date().toISOString().slice(0, 10),
  });

  useEffect(() => {
    fetchTenants();
    fetchPayments();
  }, []);

  const fetchTenants = async () => {
    try {
      const res = await api.get("/tenants");
      setTenants(res.data || []);
    } catch {
      toast.error("Failed to load tenants");
    }
  };

  const fetchPayments = async () => {
    try {
      const res = await api.get("/payments");
      setPayments(res.data || []);
    } catch {
      toast.error("Failed to load payments");
    }
  };

  const handleRecordClick = (tenant) => {
    setSelectedTenant(tenant);
    setShowModal(true);
    setFormData({
      amount: tenant.apartment?.rent || "",
      month: "",
      paymentMethod: "cash",
      datePaid: new Date().toISOString().slice(0, 10),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.month || !formData.amount) {
      return toast.error("Please fill all fields");
    }

    try {
      await api.post("/payments", {
        tenant: selectedTenant._id,
        apartment: selectedTenant.apartment?._id,
        amount: Number(formData.amount),
        month: formData.month,
        paymentMethod: formData.paymentMethod,
        datePaid: formData.datePaid ? new Date(formData.datePaid) : new Date(),
      });

      toast.success("Payment recorded successfully!");
      setShowModal(false);
      setSelectedTenant(null);
      setFormData({
        amount: "",
        month: "",
        paymentMethod: "cash",
        datePaid: new Date().toISOString().slice(0, 10),
      });
      fetchPayments();
    } catch {
      toast.error("Failed to record payment");
    }
  };

  const safeFormatDate = (d) => {
    if (!d) return "—";
    const dt = new Date(d);
    return isNaN(dt.getTime()) ? "—" : dt.toLocaleDateString("en-KE");
  };

  return (
    <div className="payments-page">
      <div className="header">
        <CreditCard size={22} />
        <h2>Payments</h2>
      </div>

      <div className="tenant-list">
        {tenants.length > 0 ? (
          tenants.map((t) => (
            <div key={t._id} className="tenant-card">
              <h3>{t.name}</h3>
              <p>🏠 {t.apartment?.unit || "—"}</p>
              <p>💰 Rent: KSH {t.apartment?.rent ? Number(t.apartment.rent).toLocaleString() : "—"}</p>
              <button className="record-btn" onClick={() => handleRecordClick(t)}>
                <PlusCircle size={16} /> Record Payment
              </button>
            </div>
          ))
        ) : (
          <p>No tenants found</p>
        )}
      </div>

      <hr className="divider" />

      <div className="payments-records">
        <h3>Recent Payments</h3>
        {payments.length > 0 ? (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Tenant</th>
                  <th>Apartment</th>
                  <th>Month</th>
                  <th>Amount (KSH)</th>
                  <th>Method</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p._id}>
                    <td>{p.tenant?.name || "—"}</td>
                    <td>{p.apartment?.unit || "—"}</td>
                    <td>{p.month || "—"}</td>
                    <td>KSH {p.amount ? Number(p.amount).toLocaleString() : "—"}</td>
                    <td>{p.paymentMethod || "—"}</td>
                    <td>{safeFormatDate(p.datePaid)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No payments recorded yet.</p>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="close-btn" onClick={() => setShowModal(false)}><X size={20} /></button>
            <h3>Record Payment for {selectedTenant?.name}</h3>

            <form onSubmit={handleSubmit} className="payment-form">
              <label>Month</label>
              <input type="text" placeholder="e.g. October 2025" value={formData.month} onChange={(e) => setFormData({ ...formData, month: e.target.value })} />

              <label>Amount (KSH)</label>
              <input type="number" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} />

              <label>Payment Method</label>
              <select value={formData.paymentMethod} onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}>
                <option value="cash">Cash</option>
                <option value="mpesa">M-Pesa</option>
                <option value="bank">Bank Transfer</option>
              </select>

              <label>Date Paid</label>
              <input type="date" value={formData.datePaid} onChange={(e) => setFormData({ ...formData, datePaid: e.target.value })} />

              <button type="submit" className="save-btn">Save Payment</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
