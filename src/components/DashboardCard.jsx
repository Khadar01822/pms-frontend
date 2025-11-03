// src/pages/Dashboard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Users, Building2, CreditCard, Wrench } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Apartments",
      value: 12,
      icon: <Building2 size={28} />,
      color: "bg-blue",
      path: "/apartments",
    },
    {
      title: "Tenants",
      value: 45,
      icon: <Users size={28} />,
      color: "bg-green",
      path: "/tenants",
    },
    {
      title: "Payments",
      value: "$12,450",
      icon: <CreditCard size={28} />,
      color: "bg-yellow",
      path: "/payments",
    },
    {
      title: "Maintenance",
      value: 5,
      icon: <Wrench size={28} />,
      color: "bg-red",
      path: "/maintenance",
    },
  ];

  const data = [
    { month: "Jan", payments: 1200 },
    { month: "Feb", payments: 2200 },
    { month: "Mar", payments: 1800 },
    { month: "Apr", payments: 3000 },
    { month: "May", payments: 2500 },
    { month: "Jun", payments: 3100 },
  ];

  return (
    <div className="page-content fade-in">
      <h2 className="text-3xl font-bold mb-6 text-[#033f63]">
        Welcome to Salah Apartments
      </h2>

      {/* Cards Section */}
      <div className="cards-grid">
        {cards.map((card, i) => (
          <div
            key={i}
            className="card"
            onClick={() => navigate(card.path)}
          >
            <div>
              <p className="title">{card.title}</p>
              <h3 className="value">{card.value}</h3>
            </div>
            <div className={`icon-wrap ${card.color}`}>{card.icon}</div>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="chart-card fade-in">
        <h3 className="text-xl font-semibold mb-4 text-[#03455e]">
          Monthly Payment Trend
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <defs>
              <linearGradient id="colorPayments" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#016fb8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#016fb8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#c3dfff" />
            <XAxis dataKey="month" stroke="#016fb8" />
            <YAxis stroke="#016fb8" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="payments"
              stroke="#016fb8"
              fillOpacity={1}
              fill="url(#colorPayments)"
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
