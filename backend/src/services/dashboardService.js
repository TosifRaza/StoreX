const mongoose = require('mongoose');
const Sale = require('../models/Sale');
const Purchase = require('../models/Purchase');
const Expense = require('../models/Expense');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const User = require('../models/User');
const Category = require('../models/Category');

const toObjectId = (id) => (mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : id);

const getDashboardStats = async (businessId) => {
  const bId = toObjectId(businessId);
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

  const [todaySales, thisMonthSales, lastMonthSales, todayPurchases, thisMonthExpenses, totalProducts, totalCustomers, totalUsers, lowStockProducts, creditSales, recentSales] = await Promise.all([
    Sale.aggregate([{ $match: { businessId: bId, status: { $ne: 'voided' }, createdAt: { $gte: todayStart } } }, { $group: { _id: null, count: { $sum: 1 }, revenue: { $sum: '$total' } } }]),
    Sale.aggregate([{ $match: { businessId: bId, status: { $ne: 'voided' }, createdAt: { $gte: thisMonthStart } } }, { $group: { _id: null, count: { $sum: 1 }, revenue: { $sum: '$total' } } }]),
    Sale.aggregate([{ $match: { businessId: bId, status: { $ne: 'voided' }, createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd } } }, { $group: { _id: null, revenue: { $sum: '$total' } } }]),
    Purchase.aggregate([{ $match: { businessId: bId, createdAt: { $gte: todayStart } } }, { $group: { _id: null, count: { $sum: 1 }, total: { $sum: '$total' } } }]),
    Expense.aggregate([{ $match: { businessId: bId, date: { $gte: thisMonthStart } } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
    Product.countDocuments({ businessId: bId, status: 'active' }),
    Customer.countDocuments({ businessId: bId, status: 'active' }),
    User.countDocuments({ businessId: bId, status: 'active' }),
    Product.find({ businessId: bId, status: 'active' }).sort('currentStock').limit(10).select('name sku currentStock minimumStock unit').lean(),
    Sale.aggregate([{ $match: { businessId: bId, status: 'credit' } }, { $group: { _id: null, total: { $sum: '$amountDue' } } }]),
    Sale.find({ businessId: bId, status: { $ne: 'voided' } }).sort({ createdAt: -1 }).limit(10).populate('customerId', 'name').select('invoiceNumber customerId total status createdAt').lean(),
  ]);

  const thisMonthRevenue = thisMonthSales[0]?.revenue || 0;
  const lastMonthRevenue = lastMonthSales[0]?.revenue || 0;
  const revenueGrowth = lastMonthRevenue > 0 ? (((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100).toFixed(1) : 0;

  return {
    todaySales: todaySales[0]?.revenue || 0,
    todayOrders: todaySales[0]?.count || 0,
    todayPurchasesTotal: todayPurchases[0]?.total || 0,
    todayPurchasesCount: todayPurchases[0]?.count || 0,
    monthlyRevenue: thisMonthRevenue,
    monthlyOrders: thisMonthSales[0]?.count || 0,
    monthlyExpenses: thisMonthExpenses[0]?.total || 0,
    profit: thisMonthRevenue - (thisMonthExpenses[0]?.total || 0),
    revenueGrowth: parseFloat(revenueGrowth),
    totalProducts,
    totalCustomers,
    totalUsers,
    totalStockValue: 0,
    lowStockProducts: lowStockProducts.filter(p => p.currentStock <= p.minimumStock),
    outstandingPayments: creditSales[0]?.total || 0,
    recentSales: recentSales.map(s => ({
      id: s._id,
      invoiceNumber: s.invoiceNumber,
      customerName: s.customerId?.name || 'Walk-in',
      total: s.total,
      status: s.status,
      date: s.createdAt,
    })),
  };
};

const getAnalyticsData = async (businessId, query) => {
  const bId = toObjectId(businessId);
  const now = new Date();
  let startDate, endDate;

  const fromStr = query.dateFrom || query.startDate;
  const toStr = query.dateTo || query.endDate;

  if (fromStr && toStr) {
    startDate = new Date(fromStr);
    startDate.setHours(0, 0, 0, 0);
    endDate = new Date(toStr);
    endDate.setHours(23, 59, 59, 999);
  } else if (query.period === 'today') {
    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    endDate = new Date(now);
  } else if (query.period === '7days') {
    startDate = new Date(now); startDate.setDate(startDate.getDate() - 7); startDate.setHours(0, 0, 0, 0);
    endDate = new Date(now);
  } else if (query.period === 'thisMonth') {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    endDate = new Date(now);
  } else if (query.period === 'lastMonth') {
    startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0);
    endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
  } else if (query.period === 'year') {
    startDate = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
    endDate = new Date(now);
  } else if (query.period === 'all') {
    startDate = new Date(2020, 0, 1, 0, 0, 0, 0);
    endDate = new Date(now);
  } else {
    startDate = new Date(now); startDate.setDate(startDate.getDate() - 30); startDate.setHours(0, 0, 0, 0);
    endDate = new Date(now);
  }

  const matchSale = { businessId: bId, status: { $ne: 'voided' }, createdAt: { $gte: startDate, $lte: endDate } };
  const matchExpense = { businessId: bId, date: { $gte: startDate, $lte: endDate } };

  const rangeMs = Math.max(endDate.getTime() - startDate.getTime(), 86400000);
  const prevStartDate = new Date(startDate.getTime() - rangeMs);
  const prevEndDate = new Date(startDate.getTime() - 1);
  const matchPrevSale = { businessId: bId, status: { $ne: 'voided' }, createdAt: { $gte: prevStartDate, $lte: prevEndDate } };

  const rangeDays = Math.ceil(rangeMs / (1000 * 60 * 60 * 24));
  const trendFormat = rangeDays <= 45 ? '%Y-%m-%d' : '%Y-%m';

  const [
    salesSummary,
    prevSalesSummary,
    productsAgg,
    topCustomerAgg,
    stockAgg,
    salesByDate,
    expensesByDate,
    paymentMethodsAgg,
  ] = await Promise.all([
    Sale.aggregate([
      { $match: matchSale },
      { $group: { _id: null, totalRevenue: { $sum: '$total' }, totalOrders: { $sum: 1 }, avgOrderValue: { $avg: '$total' } } },
    ]),
    Sale.aggregate([
      { $match: matchPrevSale },
      { $group: { _id: null, totalRevenue: { $sum: '$total' } } },
    ]),
    Sale.aggregate([
      { $match: matchSale },
      { $unwind: '$items' },
      { $group: { _id: '$items.productName', quantity: { $sum: '$items.quantity' }, revenue: { $sum: '$items.total' } } },
      { $sort: { quantity: -1 } },
    ]),
    Sale.aggregate([
      { $match: matchSale },
      { $group: { _id: '$customerId', amount: { $sum: '$total' }, count: { $sum: 1 } } },
      { $sort: { amount: -1 } },
      { $limit: 1 },
      { $lookup: { from: 'customers', localField: '_id', foreignField: '_id', as: 'customer' } },
      { $unwind: { path: '$customer', preserveNullAndEmptyArrays: true } },
    ]),
    Product.aggregate([
      { $match: { businessId: bId, status: 'active' } },
      { $group: { _id: null, totalStockValue: { $sum: { $multiply: ['$sellingPrice', '$currentStock'] } } } },
    ]),
    Sale.aggregate([
      { $match: matchSale },
      { $group: { _id: { $dateToString: { format: trendFormat, date: '$createdAt' } }, revenue: { $sum: '$total' }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),
    Expense.aggregate([
      { $match: matchExpense },
      { $group: { _id: { $dateToString: { format: trendFormat, date: '$date' } }, amount: { $sum: '$amount' } } },
      { $sort: { _id: 1 } },
    ]),
    Sale.aggregate([
      { $match: matchSale },
      { $group: { _id: '$paymentMethod', amount: { $sum: '$total' }, count: { $sum: 1 } } },
      { $sort: { amount: -1 } },
    ]),
  ]);

  const currRevenue = salesSummary[0]?.totalRevenue || 0;
  const prevRevenue = prevSalesSummary[0]?.totalRevenue || 0;
  let salesGrowth = 0;
  if (prevRevenue > 0) {
    salesGrowth = parseFloat((((currRevenue - prevRevenue) / prevRevenue) * 100).toFixed(1));
  } else if (currRevenue > 0) {
    salesGrowth = 100.0;
  } else {
    salesGrowth = 0;
  }

  const bestProduct = productsAgg.length > 0
    ? { name: productsAgg[0]._id || 'Product', quantity: productsAgg[0].quantity, revenue: productsAgg[0].revenue }
    : { name: '-', quantity: 0, revenue: 0 };

  const worstProduct = productsAgg.length > 0
    ? { name: productsAgg[productsAgg.length - 1]._id || 'Product', quantity: productsAgg[productsAgg.length - 1].quantity }
    : { name: '-', quantity: 0 };

  let highestCustomer = { name: '-', amount: 0 };
  if (topCustomerAgg.length > 0) {
    const cust = topCustomerAgg[0];
    highestCustomer = {
      name: cust.customer?.name || (cust._id ? 'Registered Customer' : 'Walk-in Customer'),
      amount: cust.amount || 0,
    };
  }

  const totalStockValue = stockAgg[0]?.totalStockValue || 0;
  const stockTurnoverRatio = totalStockValue > 0 ? parseFloat((currRevenue / totalStockValue).toFixed(2)) : 0;

  const revenueTrend = salesByDate.map(d => ({
    month: d._id,
    revenue: d.revenue,
  }));

  const expenseTrend = expensesByDate.map(d => ({
    month: d._id,
    amount: d.amount,
  }));

  const revMap = new Map(salesByDate.map(d => [d._id, d.revenue]));
  const expMap = new Map(expensesByDate.map(d => [d._id, d.amount]));
  const allTimelineDates = Array.from(new Set([...revMap.keys(), ...expMap.keys()])).sort();
  const profitTrend = allTimelineDates.map(date => ({
    month: date,
    profit: (revMap.get(date) || 0) - (expMap.get(date) || 0),
  }));

  const topProductsSortedByRevenue = [...productsAgg]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)
    .map(p => ({
      name: p._id || 'Product',
      quantity: p.quantity,
      revenue: p.revenue,
    }));

  const salesByPaymentMethod = paymentMethodsAgg.map(p => ({
    method: (p._id || 'cash').toUpperCase(),
    amount: p.amount,
    count: p.count,
  }));

  return {
    bestSellingProduct: bestProduct,
    worstSellingProduct: worstProduct,
    highestValueCustomer: highestCustomer,
    averageOrderValue: salesSummary[0]?.avgOrderValue ? Math.round(salesSummary[0].avgOrderValue * 100) / 100 : 0,
    totalRevenue: currRevenue,
    totalOrders: salesSummary[0]?.totalOrders || 0,
    stockTurnoverRatio,
    salesGrowth,
    revenueTrend,
    expenseTrend,
    profitTrend,
    topProducts: topProductsSortedByRevenue,
    salesByPaymentMethod,
  };
};

const getChartData = async (businessId, query) => {
  if (query.type === 'analytics') {
    return await getAnalyticsData(businessId, query);
  }

  const bId = toObjectId(businessId);
  const period = query.period || 'month';
  const now = new Date();
  let startDate, endDate = new Date();

  const fromStr = query.dateFrom || query.startDate;
  const toStr = query.dateTo || query.endDate;

  if (fromStr && toStr) {
    startDate = new Date(fromStr);
    startDate.setHours(0, 0, 0, 0);
    endDate = new Date(toStr);
    endDate.setHours(23, 59, 59, 999);
  } else if (period === 'today') {
    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  } else if (period === '7days') {
    startDate = new Date(now); startDate.setDate(startDate.getDate() - 7);
  } else if (period === 'thisMonth') {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  } else if (period === 'lastMonth') {
    startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    now.setDate(0); // last day of previous month
    endDate = new Date(now);
  } else if (period === 'week') {
    startDate = new Date(now); startDate.setDate(startDate.getDate() - 7);
  } else if (period === 'quarter') {
    startDate = new Date(now); startDate.setMonth(startDate.getMonth() - 3);
  } else if (period === 'year') {
    startDate = new Date(now.getFullYear(), 0, 1);
  } else {
    startDate = new Date(now); startDate.setDate(startDate.getDate() - 30);
  }

  // Pick date format based on period range
  const useHourly = period === 'today';
  const dateFormat = useHourly ? '%Y-%m-%d %H:00' : (period === '7days' ? '%Y-%m-%d' : '%Y-%m-%d');

  const [salesOverTime, salesByDate, expensesByDate, topProducts, salesByCategory, paymentMethods] = await Promise.all([
    // Sales over time (for line/area chart)
    Sale.aggregate([
      { $match: { businessId: bId, status: { $ne: 'voided' }, createdAt: { $gte: startDate, $lte: endDate } } },
      { $group: { _id: { $dateToString: { format: dateFormat, date: '$createdAt' } }, revenue: { $sum: '$total' }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),
    // Revenue by date (for revenue vs expenses chart)
    Sale.aggregate([
      { $match: { businessId: bId, status: { $ne: 'voided' }, createdAt: { $gte: startDate, $lte: endDate } } },
      { $group: { _id: { $dateToString: { format: dateFormat, date: '$createdAt' } }, revenue: { $sum: '$total' } } },
      { $sort: { _id: 1 } },
    ]),
    // Expenses by date
    Expense.aggregate([
      { $match: { businessId: bId, date: { $gte: startDate, $lte: endDate } } },
      { $group: { _id: { $dateToString: { format: dateFormat, date: '$date' } }, expenses: { $sum: '$amount' } } },
      { $sort: { _id: 1 } },
    ]),
    // Top products by revenue
    Sale.aggregate([
      { $match: { businessId: bId, status: { $ne: 'voided' }, createdAt: { $gte: startDate, $lte: endDate } } },
      { $unwind: '$items' },
      { $group: { _id: { productId: '$items.productId', name: '$items.productName' }, quantity: { $sum: '$items.quantity' }, revenue: { $sum: '$items.total' } } },
      { $sort: { revenue: -1 } }, { $limit: 10 },
    ]),
    // Sales by category
    Sale.aggregate([
      { $match: { businessId: bId, status: { $ne: 'voided' }, createdAt: { $gte: startDate, $lte: endDate } } },
      { $unwind: '$items' },
      { $lookup: { from: 'products', localField: 'items.productId', foreignField: '_id', as: 'product' } },
      { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
      { $lookup: { from: 'categories', localField: 'product.categoryId', foreignField: '_id', as: 'category' } },
      { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
      { $group: { _id: { $ifNull: ['$category.name', 'Uncategorized'] }, sales: { $sum: '$items.total' } } },
      { $sort: { sales: -1 } },
    ]),
    // Payment methods
    Sale.aggregate([
      { $match: { businessId: bId, status: { $ne: 'voided' }, createdAt: { $gte: startDate, $lte: endDate } } },
      { $group: { _id: '$paymentMethod', count: { $sum: 1 }, amount: { $sum: '$total' } } },
      { $sort: { count: -1 } },
    ]),
  ]);

  // Transform salesOverTime → chart-friendly { date, revenue, count }
  const salesData = salesOverTime.map(d => ({ date: d._id, revenue: d.revenue, count: d.count }));

  // Merge revenue + expenses into a single flat array for the bar chart
  const revenueMap = new Map(salesByDate.map(d => [d._id, d.revenue]));
  const expenseMap = new Map(expensesByDate.map(d => [d._id, d.expenses]));
  const allDates = new Set([...revenueMap.keys(), ...expenseMap.keys()]);
  const revExpData = [...allDates].sort().map(date => ({
    date,
    revenue: revenueMap.get(date) || 0,
    expenses: expenseMap.get(date) || 0,
  }));

  // Transform topProducts: flatten nested _id.name
  const topProductsData = topProducts.map(d => ({
    name: d._id.name,
    quantity: d.quantity,
    revenue: d.revenue,
  }));

  // Transform salesByCategory
  const categoryData = salesByCategory.map(d => ({
    category: d._id,
    sales: d.sales,
  }));

  // Transform paymentMethods: _id → name
  const paymentData = paymentMethods.map(d => ({
    name: d._id.charAt(0).toUpperCase() + d._id.slice(1),
    count: d.count,
    amount: d.amount,
  }));

  return {
    salesOverTime: salesData,
    revenueVsExpenses: revExpData,
    topProducts: topProductsData,
    salesByCategory: categoryData,
    paymentMethods: paymentData,
  };
};

module.exports = { getDashboardStats, getChartData };
