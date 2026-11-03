import { useState, useEffect, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid,
} from 'recharts';
import {
  HiOutlineChartBar,
  HiOutlineArrowTrendingUp,
  HiOutlineArrowTrendingDown,
  HiOutlineMinus,
  HiOutlineCube,
  HiOutlineUserGroup,
  HiOutlineBanknotes,
  HiOutlineShoppingCart,
  HiOutlineCalendarDays,
  HiOutlineInformationCircle,
  HiOutlineArrowPath,
} from 'react-icons/hi2';

import PageHeader from '../../components/PageHeader';
import StatCard from '../../components/StatCard';
import ChartCard from '../../components/ChartCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { dashboardApi } from '../../api/dashboardApi';
import { formatCurrency } from '../../utils/helpers';

const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16'];

const PRESET_RANGES = [
  {
    key: '7days',
    label: 'Last 7 Days',
    getRange: () => {
      const to = new Date();
      const from = new Date();
      from.setDate(from.getDate() - 7);
      return { from: from.toISOString().split('T')[0], to: to.toISOString().split('T')[0] };
    },
  },
  {
    key: '30days',
    label: 'Last 30 Days',
    getRange: () => {
      const to = new Date();
      const from = new Date();
      from.setDate(from.getDate() - 30);
      return { from: from.toISOString().split('T')[0], to: to.toISOString().split('T')[0] };
    },
  },
  {
    key: 'thisMonth',
    label: 'This Month',
    getRange: () => {
      const to = new Date();
      const from = new Date(to.getFullYear(), to.getMonth(), 1);
      return { from: from.toISOString().split('T')[0], to: to.toISOString().split('T')[0] };
    },
  },
  {
    key: 'thisYear',
    label: 'This Year',
    getRange: () => {
      const to = new Date();
      const from = new Date(to.getFullYear(), 0, 1);
      return { from: from.toISOString().split('T')[0], to: to.toISOString().split('T')[0] };
    },
  },
  {
    key: 'allTime',
    label: 'All Time',
    getRange: () => {
      const to = new Date();
      const from = new Date(2024, 0, 1);
      return { from: from.toISOString().split('T')[0], to: to.toISOString().split('T')[0] };
    },
  },
];

function ChartEmptyState({ message = 'No data recorded for this period', subtext = 'Try selecting another range or record new transactions' }) {
  return (
    <div className="flex flex-col items-center justify-center h-[280px] text-center p-6 bg-gray-50/60 rounded-xl border border-dashed border-gray-200">
      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-2.5">
        <HiOutlineChartBar className="w-5 h-5" />
      </div>
      <p className="text-sm font-medium text-gray-700">{message}</p>
      <p className="text-xs text-gray-400 mt-1 max-w-xs">{subtext}</p>
    </div>
  );
}

function Analytics() {
  const [activePreset, setActivePreset] = useState('30days');
  const [dateRange, setDateRange] = useState(() => PRESET_RANGES[1].getRange());
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const { data: resp } = await dashboardApi.getChartData({
        type: 'analytics',
        dateFrom: dateRange.from,
        dateTo: dateRange.to,
      });
      setData(resp?.data ?? resp ?? {});
    } catch {
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const handlePresetClick = (preset) => {
    setActivePreset(preset.key);
    setDateRange(preset.getRange());
  };

  const handleCustomDateChange = (field, value) => {
    setActivePreset('custom');
    setDateRange((prev) => ({ ...prev, [field]: value }));
  };

  const d = data || {};

  const bestProduct = d.bestSellingProduct || { name: '-', quantity: 0, revenue: 0 };
  const worstProduct = d.worstSellingProduct || { name: '-', quantity: 0 };
  const topCustomer = d.highestValueCustomer || { name: '-', amount: 0 };
  const avgOrderValue = d.averageOrderValue ?? 0;
  const stockTurnover = d.stockTurnoverRatio ?? 0;
  const salesGrowth = d.salesGrowth ?? 0;
  const totalRevenue = d.totalRevenue ?? 0;
  const totalOrders = d.totalOrders ?? 0;

  // Determine sales growth trend cleanly (no fake +0.0% Growing)
  const growthTrend = salesGrowth > 0 ? 'up' : salesGrowth < 0 ? 'down' : 'neutral';
  const growthTrendValue =
    salesGrowth > 0
      ? `+${salesGrowth.toFixed(1)}% Growing`
      : salesGrowth < 0
      ? `${salesGrowth.toFixed(1)}% Declining`
      : '0.0% No change';
  const growthColor = salesGrowth > 0 ? 'green' : salesGrowth < 0 ? 'red' : 'blue';
  const GrowthIcon =
    salesGrowth > 0 ? HiOutlineArrowTrendingUp : salesGrowth < 0 ? HiOutlineArrowTrendingDown : HiOutlineMinus;

  const stats = [
    {
      title: 'Best Selling Product',
      value: bestProduct.name !== '-' ? bestProduct.name : 'No sales yet',
      subtitle:
        bestProduct.quantity > 0
          ? `${bestProduct.quantity} unit${bestProduct.quantity === 1 ? '' : 's'} sold (${formatCurrency(bestProduct.revenue || 0)})`
          : '0 units sold in this period',
      icon: HiOutlineCube,
      color: 'green',
    },
    {
      title: 'Lowest Selling Product',
      value: worstProduct.name !== '-' ? worstProduct.name : 'No sales yet',
      subtitle:
        worstProduct.quantity > 0
          ? `${worstProduct.quantity} unit${worstProduct.quantity === 1 ? '' : 's'} sold`
          : '0 units sold in this period',
      icon: HiOutlineShoppingCart,
      color: 'red',
    },
    {
      title: 'Highest Value Customer',
      value: topCustomer.name !== '-' ? topCustomer.name : 'No activity yet',
      subtitle: topCustomer.amount > 0 ? `${formatCurrency(topCustomer.amount)} spent` : '₹0 total spend in period',
      icon: HiOutlineUserGroup,
      color: 'purple',
    },
    {
      title: 'Average Order Value',
      value: formatCurrency(avgOrderValue),
      subtitle:
        totalOrders > 0
          ? `${formatCurrency(totalRevenue)} total across ${totalOrders} order${totalOrders === 1 ? '' : 's'}`
          : '0 orders recorded',
      icon: HiOutlineBanknotes,
      color: 'blue',
    },
    {
      title: 'Stock Turnover Ratio',
      value: stockTurnover.toFixed(2) + 'x',
      subtitle: stockTurnover > 0 ? 'Sales to inventory velocity' : 'No inventory turnover yet',
      icon: HiOutlineChartBar,
      color: 'orange',
    },
    {
      title: 'Sales Growth',
      value: `${salesGrowth > 0 ? '+' : ''}${salesGrowth.toFixed(1)}%`,
      subtitle: 'vs prior period of equal length',
      icon: GrowthIcon,
      color: growthColor,
      trend: growthTrend,
      trendValue: growthTrendValue,
    },
  ];

  const hasSalesData = totalOrders > 0 || (d.revenueTrend && d.revenueTrend.length > 0);

  return (
    <div>
      <PageHeader
        title="Analytics"
        subtitle="Deep dive into your business metrics, product velocity, and financial trends"
      />

      {/* Date Filter & Presets */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mr-1">Timeframe:</span>
            {PRESET_RANGES.map((preset) => {
              const isSelected = activePreset === preset.key;
              return (
                <button
                  key={preset.key}
                  type="button"
                  onClick={() => handlePresetClick(preset)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>

          {/* Date Range Inputs */}
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium text-gray-500">From</span>
              <input
                type="date"
                value={dateRange.from}
                onChange={(e) => handleCustomDateChange('from', e.target.value)}
                className="rounded-lg border border-gray-300 px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium text-gray-500">To</span>
              <input
                type="date"
                value={dateRange.to}
                onChange={(e) => handleCustomDateChange('to', e.target.value)}
                className="rounded-lg border border-gray-300 px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={fetchAnalytics}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition shadow-2xs"
            >
              <HiOutlineArrowPath className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Helpful Hint Banner when empty */}
      {!loading && !hasSalesData && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-3">
            <HiOutlineInformationCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <p className="text-sm">
              No sales recorded between <strong>{dateRange.from}</strong> and <strong>{dateRange.to}</strong>.
              Select <strong>&quot;This Year&quot;</strong> or <strong>&quot;All Time&quot;</strong> to view lifetime metrics.
            </p>
          </div>
          <button
            onClick={() => handlePresetClick(PRESET_RANGES.find((p) => p.key === 'thisYear'))}
            className="text-xs font-semibold px-3.5 py-1.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition self-start sm:self-auto cursor-pointer"
          >
            View This Year
          </button>
        </div>
      )}

      {loading ? (
        <LoadingSpinner type="card" />
      ) : (
        <>
          {/* Stats Grid 2x3 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {stats.map((stat) => (
              <StatCard
                key={stat.title}
                title={stat.title}
                value={stat.value}
                subtitle={stat.subtitle}
                icon={stat.icon}
                color={stat.color}
                trend={stat.trend}
                trendValue={stat.trendValue}
              />
            ))}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend */}
            <ChartCard title="Revenue Trend" subtitle="Revenue over time">
              {d.revenueTrend && d.revenueTrend.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={d.revenueTrend}>
                    <defs>
                      <linearGradient id="analyticsRevGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#9ca3af" />
                    <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                    <Tooltip formatter={(val) => formatCurrency(val)} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      fill="url(#analyticsRevGrad)"
                      name="Revenue"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <ChartEmptyState
                  message="No revenue data for this period"
                  subtext="Revenue trends will plot here as sales transactions are recorded"
                />
              )}
            </ChartCard>

            {/* Expense Trend */}
            <ChartCard title="Expense Trend" subtitle="Expenses over time">
              {d.expenseTrend && d.expenseTrend.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={d.expenseTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#9ca3af" />
                    <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                    <Tooltip formatter={(val) => formatCurrency(val)} />
                    <Legend />
                    <Bar dataKey="amount" fill="#ef4444" radius={[4, 4, 0, 0]} name="Expenses" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <ChartEmptyState
                  message="No expenses recorded for this period"
                  subtext="Operational expenses recorded under Expenses will appear here"
                />
              )}
            </ChartCard>

            {/* Profit Trend */}
            <ChartCard title="Profit Trend" subtitle="Net profit over time (Revenue - Expenses)">
              {d.profitTrend && d.profitTrend.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={d.profitTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#9ca3af" />
                    <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                    <Tooltip formatter={(val) => formatCurrency(val)} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="profit"
                      stroke="#10b981"
                      strokeWidth={2.5}
                      dot={{ r: 4 }}
                      name="Profit"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <ChartEmptyState
                  message="No profit trend data for this period"
                  subtext="Shows profit margin curves based on recorded revenue and expenses"
                />
              )}
            </ChartCard>

            {/* Top 5 Products by Revenue */}
            <ChartCard title="Top 5 Products by Revenue" subtitle="Highest grossing products">
              {d.topProducts && d.topProducts.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={d.topProducts}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#9ca3af" />
                    <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                    <Tooltip formatter={(val) => formatCurrency(val)} />
                    <Legend />
                    <Bar dataKey="revenue" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Revenue" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <ChartEmptyState
                  message="No product sales in this period"
                  subtext="Top revenue-generating items will display here once sales are logged"
                />
              )}
            </ChartCard>

            {/* Sales by Payment Method */}
            <div className="lg:col-span-2">
              <ChartCard title="Sales by Payment Method" subtitle="Distribution of transaction methods">
                {d.salesByPaymentMethod && d.salesByPaymentMethod.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={d.salesByPaymentMethod}
                        dataKey="amount"
                        nameKey="method"
                        cx="50%"
                        cy="50%"
                        outerRadius={95}
                        innerRadius={45}
                        paddingAngle={3}
                        label={({ method, percent }) => `${method} ${(percent * 100).toFixed(0)}%`}
                      >
                        {d.salesByPaymentMethod.map((_, idx) => (
                          <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(val) => formatCurrency(val)} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <ChartEmptyState
                    message="No payment transactions recorded for this period"
                    subtext="Breakdown across Cash, UPI, Card, and Credit will display here"
                  />
                )}
              </ChartCard>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Analytics;
