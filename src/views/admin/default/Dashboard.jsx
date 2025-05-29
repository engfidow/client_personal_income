import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const storedUser = JSON.parse(sessionStorage.getItem("user"));
  const userId = storedUser?.id;
  const { t } = useTranslation();

  const [data, setData] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    recentTransactions: [],
    monthlyChartData: [],
    categoryBreakdown: [],
  });
  const [loading, setLoading] = useState(true);

  const formatCurrency = (value) => `$${parseFloat(value).toFixed(2)}`;

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://server-personal-income.onrender.com/api/transactions/dashboard/${userId}`
      );
      setData(res.data);
      console.log(res.data.balance)

      if (res.data.balance < 50 && storedUser?.email) {
        await axios.post("https://server-personal-income.onrender.com/api/notify-low-income", {
          email: storedUser.email,
          income: res.data.balance,
        });
      }
    } catch (err) {
      console.error("Error loading dashboard or sending alert:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (userId) fetchDashboard();
  }, [userId]);

  const monthlyLabels = [...new Set(data.monthlyChartData.map((d) => d.month))];

  const incomeData = monthlyLabels.map((month) => {
    const record = data.monthlyChartData.find((d) => d.month === month && d.type === "income");
    return record ? record.total : 0;
  });

  const expenseData = monthlyLabels.map((month) => {
    const record = data.monthlyChartData.find((d) => d.month === month && d.type === "expense");
    return record ? record.total : 0;
  });

  const barChartData = {
    labels: monthlyLabels,
    datasets: [
      {
        label: t("income"),
        data: incomeData,
        backgroundColor: "rgba(0, 200, 81, 0.6)",
      },
      {
        label: t("expense"),
        data: expenseData,
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  const pieChartData = {
    labels: data.categoryBreakdown.map((c) => c.category),
    datasets: [
      {
        label: t("expenses"),
        data: data.categoryBreakdown.map((c) => c.total),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
      },
    ],
  };

  return (
    <div className="p-4 text-navy-700 dark:text-white">
     

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: t("income"), value: data.totalIncome, color: "text-green-600" },
          { label: t("expense"), value: data.totalExpense, color: "text-red-600" },
          { label: t("balance"), value: data.balance, color: "text-blue-600" },
        ].map((card, index) => (
          <div key={index} className="bg-white dark:bg-navy-800 p-4 rounded shadow">
            <p className="text-sm text-gray-500 dark:text-white/70">{card.label}</p>
            <h2 className={`text-xl font-bold ${card.color}`}>
              {loading ? <Skeleton width={80} /> : formatCurrency(card.value)}
            </h2>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-navy-800 p-4 rounded shadow">
          <h3 className="font-bold mb-2">{t("monthly_trend")}</h3>
          {loading ? <Skeleton height={240} /> : <Bar data={barChartData} />}
        </div>
        <div className="bg-white dark:bg-navy-800 p-4 rounded shadow">
          <h3 className="font-bold mb-2">{t("category_breakdown")}</h3>
          {loading ? <Skeleton height={240} /> : <Pie data={pieChartData} />}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white dark:bg-navy-800 p-4 rounded shadow">
        <h3 className="font-bold mb-4">{t("recent_transactions")}</h3>
        {loading ? (
          [...Array(5)].map((_, i) => <Skeleton key={i} height={24} className="mb-2" />)
        ) : (
          <ul className="space-y-2">
            {data.recentTransactions.map((tx) => (
              <li key={tx.id} className="flex justify-between border-b dark:border-white/10 pb-1">
                <span>{tx.category}</span>
                <span
                  className={`font-bold ${
                    tx.type === "income" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {tx.type === "income" ? "+" : "-"}
                  {formatCurrency(tx.amount)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
