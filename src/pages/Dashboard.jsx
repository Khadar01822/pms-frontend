import React, { useEffect, useState } from "react";
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
import api from "../api/apiClient.js";

const Dashboard = () => {
  const navigate = useNavigate();
  const TOTAL_UNITS = 6;
  const [summary, setSummary] = useState({
    tenants: 0,
    payments: 0,
    maintenance: 0,
  });
  const [chartData, setChartData] = useState([]);

  // ✅ Calculate available units dynamically
  const availableUnits = Math.max(TOTAL_UNITS - summary.tenants, 0);
  const availableUnitsText =
    availableUnits === 1
      ? "1 Unit Available"
      : `${availableUnits} Units Available`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const summaryRes = await api.get("/dashboard/summary");
        setSummary(summaryRes.data);

        const chartRes = await api.get("/dashboard/monthly-payments");
        setChartData(chartRes.data);
      } catch (err) {
        console.error("Dashboard data error:", err);
      }
    };
    fetchData();
  }, []);

  const cards = [
    {
      title: "Apartments",
      value: availableUnitsText,
      icon: <Building2 size={28} />,
      color: "bg-blue",
      path: "/apartments",
    },
    {
      title: "Tenants",
      value: summary.tenants,
      icon: <Users size={28} />,
      color: "bg-green",
      path: "/tenants",
    },
    {
      title: "Payments",
      value: `KSH ${summary.payments.toLocaleString()}`,
      icon: <CreditCard size={28} />,
      color: "bg-yellow",
      path: "/payments",
    },
    {
      title: "Maintenance",
      value: summary.maintenance,
      icon: <Wrench size={28} />,
      color: "bg-red",
      path: "/maintenance",
    },
    {
  title: "Commercial",
  value: "2 Units", // you can later make it dynamic
  icon: <Building2 size={28} />,
  color: "bg-purple",
  path: "/commercial",
},

  ];

  return (
    <div className="page-content fade-in">
      <h2 className="text-3xl font-bold mb-8 text-[#033f63]">
        Welcome to <span className="text-[#016fb8]">Salah Apartments</span>
      </h2>

      {/* ✅ Summary Cards Section */}
      <div className="cards-grid">
        {cards.map((card, i) => (
          <div
            key={i}
            className="card fade-in hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            onClick={() => navigate(card.path)}
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div>
              <p className="title text-gray-500 font-semibold text-sm uppercase mb-1">
                {card.title}
              </p>
              <h3 className="value text-2xl font-bold text-[#03455e]">
                {card.value}
              </h3>
            </div>
            <div className={`icon-wrap ${card.color}`}>{card.icon}</div>
          </div>
        ))}
      </div>

      {/* ✅ Chart Section - Monthly Payment History */}
      <div className="chart-card fade-in mt-10" style={{ animationDelay: "0.5s" }}>
        <h3 className="text-xl font-semibold mb-4 text-[#03455e]">
          Monthly Payment History (KSH)
        </h3>

        <ResponsiveContainer width="100%" height={380}>
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 40, left: 20, bottom: 20 }}
          >
            <defs>
              <linearGradient id="colorPayments" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#016fb8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#016fb8" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              dataKey="month"
              stroke="#016fb8"
              tick={{ fontSize: 13 }}
              interval={0} // ✅ Show all months
            />
            <YAxis
              stroke="#016fb8"
              domain={[0, "auto"]} // ✅ Dynamic scaling
              tickFormatter={(value) => `KSH ${value.toLocaleString()}`}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              formatter={(value) => [`KSH ${value.toLocaleString()}`, "Total Payments"]}
              contentStyle={{
                borderRadius: "10px",
                backgroundColor: "#f9fcff",
                borderColor: "#016fb8",
              }}
              labelStyle={{ color: "#016fb8", fontWeight: "bold" }}
            />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#016fb8"
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 7 }}
              fill="url(#colorPayments)"
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
