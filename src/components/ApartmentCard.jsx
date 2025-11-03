import React from "react";

function ApartmentCard({ apartment }) {
  return (
    <div className="border p-4 rounded shadow">
      <h2 className="font-bold">{apartment.unit}</h2>
      <p>Floor: {apartment.floor}</p>
      <p>Status: {apartment.status}</p>
      <p>Rent: {apartment.rent}</p>
      <p>Tenant: {apartment.tenant ? apartment.tenant.name : "None"}</p>
    </div>
  );
}

export default ApartmentCard;
