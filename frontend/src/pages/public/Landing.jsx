import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LuBox,
  LuBoxes,
  LuZap,
  LuReceipt,
  LuUsers,
  LuChartBar,
  LuTrendingUp,
  LuCircleCheck,
  LuCheck,
  LuArrowRight,
  LuCloud,
  LuSearch,
  LuBell,
  LuMenu,
  LuX,
  LuPlus,
  LuMinus,
  LuStore,
  LuBuilding2,
  LuClock,
  LuFileText,
  LuEye,
  LuChevronDown,
  LuLayers,
  LuFacebook,
  LuInstagram,
  LuLinkedin,
  LuYoutube,
  LuTruck,
} from 'react-icons/lu';

/* ─────────────────────── Indian Flag SVG Component ─────────────────────── */

function IndianFlag({ className = 'w-4 h-3' }) {
  return (
    <svg className={`${className} inline-block rounded-[2px] shadow-2xs shrink-0`} viewBox="0 0 24 16" fill="none">
      <rect width="24" height="5.33" fill="#FF9933" />
      <rect y="5.33" width="24" height="5.33" fill="#FFFFFF" />
      <rect y="10.66" width="24" height="5.34" fill="#138808" />
      <circle cx="12" cy="8" r="2" stroke="#000088" strokeWidth="0.8" fill="none" />
    </svg>
  );
}

/* ─────────────────────── Static Data ─────────────────────── */

const NAV_LINKS = [
  { label: 'Home', href: '#hero' },
  { label: 'Features', href: '#features' },
  { label: 'Solutions', href: '#solutions' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'About Us', href: '/about' },
];

const BENEFITS_STRIP = [
  {
    icon: LuBox,
    title: 'Inventory Control',
    desc: 'Track products and stock in real time.',
  },
  {
    icon: LuZap,
    title: 'Faster Billing',
    desc: 'Create invoices and bill faster at your store.',
  },
  {
    icon: LuUsers,
    title: 'Customer Management',
    desc: 'Keep customer information organized.',
  },
  {
    icon: LuChartBar,
    title: 'Business Insights',
    desc: 'Get reports and insights to grow your business.',
  },
];

const STEPS = [
  {
    num: '01',
    icon: LuStore,
    title: 'Create your business account',
    desc: 'Set up your store and business information in minutes.',
  },
  {
    num: '02',
    icon: LuBoxes,
    title: 'Manage your operations',
    desc: 'Organize products, sales, customers and suppliers seamlessly.',
  },
  {
    num: '03',
    icon: LuChartBar,
    title: 'Monitor your business',
    desc: 'Use your dashboard to understand business activity and make better decisions.',
  },
];

const SHOWCASE_TABS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    tag: '01 Business Dashboard',
    title: 'Get a complete view of your business',
    desc: 'Track sales, orders, stock, customers and more from a single dashboard. Make informed decisions with real-time insights.',
    highlights: [
      'Key business metrics and daily store KPIs',
      'Sales trends, revenue charts and analytics',
      'Top selling products and inventory valuation',
      'Recent orders, returns and live cashier activities',
    ],
  },
  {
    id: 'inventory',
    label: 'Inventory',
    tag: '02 Inventory Control',
    title: 'Real-time stock tracking across stores',
    desc: 'Eliminate stock-outs and excess holding costs. Monitor inventory levels across warehouses and store counters with instant low-stock alerts.',
    highlights: [
      'Live SKU & rapid barcode scanning',
      'Automated low stock notifications & reorder alerts',
      'Batch numbers, expiry date & variant tracking',
      'Multi-location internal stock transfers',
    ],
  },
  {
    id: 'sales',
    label: 'Sales & Billing',
    tag: '03 Sales & Invoicing',
    title: 'Lightning-fast billing & invoices',
    desc: 'Generate GST-compliant invoices in seconds. Support multiple payment modes including UPI, Cash, Cards, and customer udhaar credit.',
    highlights: [
      'Sub-second barcode checkout experience',
      'GST & tax calculation automatically applied',
      'Split payment, UPI QR & digital wallets support',
      'Thermal receipt printing & WhatsApp PDF sharing',
    ],
  },
  {
    id: 'customers',
    label: 'Customers',
    tag: '04 Customer Directory',
    title: 'Organized customer database & udhaar ledger',
    desc: 'Maintain customer purchase history, manage credit balances effortlessly, and drive repeat visits with personalized insights.',
    highlights: [
      'Complete customer purchase & payment history',
      'Udhaar credit tracking & automated payment reminders',
      'Customer loyalty points, membership & discounts',
      'One-click WhatsApp invoice sharing & reminders',
    ],
  },
  {
    id: 'suppliers',
    label: 'Suppliers',
    tag: '05 Supplier Management',
    title: 'Streamlined purchasing & vendor payables',
    desc: 'Manage your supplier contacts, record purchase orders, track incoming shipments, and stay on top of payment deadlines.',
    highlights: [
      'Centralized vendor & distributor directory',
      'Purchase order creation & GRN invoice matching',
      'Payables ledger, aging & payment status',
      'Supplier purchase history & item pricing records',
    ],
  },
];

const WHY_CHOOSE_ITEMS = [
  {
    icon: LuFileText,
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-50',
    title: 'Less manual work',
    desc: 'Automate routine billing and stock calculation tasks to save valuable business hours every day.',
  },
  {
    icon: LuEye,
    iconColor: 'text-amber-600',
    iconBg: 'bg-amber-50',
    title: 'Better stock visibility',
    desc: "Know exactly what's in stock, what sells fastest, and when to reorder before running out.",
  },
  {
    icon: LuLayers,
    iconColor: 'text-teal-600',
    iconBg: 'bg-teal-50',
    title: 'Organized operations',
    desc: 'Keep all your sales receipts, inventory counts, and customer accounts in one unified system.',
  },
  {
    icon: LuBuilding2,
    iconColor: 'text-indigo-600',
    iconBg: 'bg-indigo-50',
    title: 'Centralized management',
    desc: 'Manage multiple counters, warehouses, and branch stores effortlessly under a single account.',
  },
  {
    icon: LuTrendingUp,
    iconColor: 'text-purple-600',
    iconBg: 'bg-purple-50',
    title: 'Better decision-making',
    desc: 'Get real-time revenue analytics, margin estimates, and profit insights to expand your business.',
  },
];

const PRICING_PLANS = [
  {
    name: 'Starter',
    icon: LuStore,
    desc: 'Perfect for small businesses and single stores.',
    highlight: false,
    badge: null,
    features: [
      'Inventory management',
      'Sales & billing POS counter',
      'Customer management & udhaar',
      'Basic reports & tax summaries',
      'Up to 1,000 products & 1 store counter',
    ],
    buttonText: 'Contact us for pricing',
    buttonVariant: 'secondary',
  },
  {
    name: 'Professional',
    icon: LuBuilding2,
    desc: 'Ideal for growing businesses and multi-store owners.',
    highlight: true,
    badge: 'Most Popular',
    features: [
      'Everything in Starter',
      'Multi-store & multi-branch management',
      'Advanced sales analytics & reports',
      'Supplier management & purchase orders',
      'Staff roles, permissions & cashier controls',
      'Priority 24/7 phone & WhatsApp support',
    ],
    buttonText: 'Contact us for pricing',
    buttonVariant: 'primary',
  },
  {
    name: 'Business',
    icon: LuBoxes,
    desc: 'For large businesses, wholesalers & distributors.',
    highlight: false,
    badge: null,
    features: [
      'Everything in Professional',
      'Unlimited products, branches & counters',
      'Advanced profit & loss analytics',
      'Custom API & hardware integrations',
      'Dedicated account manager',
      'Tailored ERP solutions & data migration',
    ],
    buttonText: 'Contact us for pricing',
    buttonVariant: 'secondary',
  },
];

const FAQS_LIST = [
  {
    q: 'What is StoresX?',
    a: 'StoresX is an all-in-one cloud business management platform tailored for Indian retail, wholesale, and distributor businesses. It brings together inventory control, point-of-sale billing, customer ledger (udhaar), supplier payables, and multi-branch management in a single intuitive interface.',
  },
  {
    q: 'Is StoresX suitable for small businesses?',
    a: 'Yes, StoresX was specifically engineered for businesses of all sizes — from single-counter kirana shops and apparel boutiques to multi-branch wholesalers. Its clean interface requires zero technical training and you can get started in minutes.',
  },
  {
    q: 'Who can use StoresX?',
    a: 'StoresX is used across grocery stores, clothing & garment retailers, mobile & electronics outlets, pharmacies, hardware shops, and distributors across India who want to streamline their day-to-day operations and accelerate sales.',
  },
  {
    q: 'Is there a free trial?',
    a: 'Yes! StoresX offers a free trial with access to all core features. You can test inventory management, create invoices, and explore reports without requiring a credit card.',
  },
  {
    q: 'Can I manage multiple stores?',
    a: 'Yes. StoresX provides comprehensive multi-store and multi-branch support. You can track stock levels across branches, perform internal stock transfers, monitor staff roles, and view consolidated revenue analytics from one place.',
  },
  {
    q: 'How do I get started?',
    a: 'Simply click "Start Free Trial" or "Get Started". Fill out your store name and mobile number, add or import your product catalog, and you are ready to begin billing immediately.',
  },
];

/* ─────────────────────── Component ─────────────────────── */

export default function Landing() {
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleFaq = (index) => {
    setOpenFaq((prev) => (prev === index ? null : index));
  };

  const currentTab = SHOWCASE_TABS.find((t) => t.id === activeTab) || SHOWCASE_TABS[0];

  return (
    <div className="min-h-screen bg-white text-[#101828] selection:bg-blue-100 selection:text-blue-900 w-full overflow-x-hidden">
      {/* ────────────────── A. NAVIGATION BAR ────────────────── */}
      <nav
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-xs border-b border-slate-200/80 py-2.5'
            : 'bg-white/90 backdrop-blur-xs py-3 sm:py-3.5'
        }`}
      >
        <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <LuBoxes className="w-5 h-5" />
              </div>
              <span className="text-2xl sm:text-3xl font-black tracking-tight text-[#101828]">
                Stores<span className="text-[#2563EB]">X</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-8 lg:gap-10">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm sm:text-base font-semibold text-slate-600 hover:text-[#2563EB] transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Desktop Auth / CTA */}
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <Link
                  to="/app/dashboard"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm sm:text-base font-bold text-white bg-[#2563EB] hover:bg-blue-700 rounded-xl shadow-md hover:shadow-blue-600/25 transition-all"
                >
                  Go to Dashboard
                  <LuArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-sm sm:text-base font-bold text-slate-700 hover:text-[#2563EB] px-3.5 py-2 transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center px-5 py-2.5 text-sm sm:text-base font-bold text-white bg-[#2563EB] hover:bg-blue-700 rounded-xl shadow-md hover:shadow-blue-600/25 transition-all"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
              className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              {mobileOpen ? <LuX className="w-6 h-6" /> : <LuMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white/98 backdrop-blur-lg px-6 pt-3 pb-6 space-y-3 shadow-2xl">
            <div className="flex flex-col space-y-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-3.5 py-2 text-sm sm:text-base font-semibold text-slate-700 hover:bg-blue-50 hover:text-[#2563EB] rounded-xl transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
              {user ? (
                <Link
                  to="/app/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm sm:text-base font-bold text-white bg-[#2563EB] rounded-xl shadow-md"
                >
                  Go to Dashboard
                  <LuArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="w-full text-center px-4 py-2 text-sm sm:text-base font-bold text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className="w-full text-center px-4 py-2.5 text-sm sm:text-base font-bold text-white bg-[#2563EB] rounded-xl shadow-md shadow-blue-500/20"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* ────────────────── B. HERO SECTION (Enlarged & Prominent) ────────────────── */}
      <section
        id="hero"
        className="relative pt-20 pb-10 sm:pt-24 sm:pb-14 lg:pt-28 lg:pb-16 overflow-hidden bg-gradient-to-b from-[#F5F8FF] via-[#F8FAFF] to-white"
      >
        {/* Soft radial glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-to-tr from-blue-200/50 via-blue-100/40 to-indigo-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 xl:gap-12 items-center">
            {/* Hero Left Content */}
            <div className="xl:col-span-5 text-left space-y-4 sm:space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-blue-200/80 shadow-2xs text-xs sm:text-sm font-bold text-blue-700">
                <IndianFlag className="w-4 h-3" />
                <span>Built for growing Indian businesses</span>
              </div>

              {/* Main Headline - Bigger, bolder */}
              <h1 className="text-4xl sm:text-6xl lg:text-[4rem] xl:text-[4.35rem] font-black text-[#101828] tracking-tight leading-[1.08]">
                Run Your Entire Business. All From One Place.
              </h1>

              {/* Description */}
              <p className="text-lg sm:text-xl lg:text-2xl text-slate-600 leading-relaxed max-w-xl">
                Manage inventory, sales, customers and suppliers from one simple dashboard.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-4 text-base sm:text-lg font-bold text-white bg-[#2563EB] hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-600/30 hover:scale-[1.01] transition-all"
                >
                  Start Free Trial
                  <LuArrowRight className="w-5 h-5" />
                </Link>
                <a
                  href="#features"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base sm:text-lg font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-2xs transition-colors"
                >
                  Explore Features
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="pt-5 border-t border-slate-200/70 flex flex-wrap items-center gap-y-2.5 gap-x-8 text-xs sm:text-sm font-semibold text-slate-500">
                <div className="inline-flex items-center gap-2">
                  <LuCircleCheck className="w-4 h-4 text-emerald-500" />
                  <span>Easy to use</span>
                </div>
                <div className="inline-flex items-center gap-2">
                  <LuCloud className="w-4 h-4 text-blue-500" />
                  <span>Cloud based</span>
                </div>
                <div className="inline-flex items-center gap-2">
                  <IndianFlag className="w-4 h-3" />
                  <span>Built for Indian businesses</span>
                </div>
              </div>
            </div>

            {/* Hero Right: StoresX Dashboard Mockup (Enlarged Size) */}
            <div className="xl:col-span-7">
              <div className="relative rounded-3xl bg-white border border-slate-200/90 shadow-2xl shadow-blue-900/15 overflow-hidden text-left transition-all duration-300">
                {/* Mockup Topbar */}
                <div className="bg-white border-b border-slate-200/80 px-5 sm:px-6 py-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-[#2563EB] flex items-center justify-center text-white shadow-xs">
                        <LuBoxes className="w-4.5 h-4.5" />
                      </div>
                      <span className="text-base font-black text-slate-900 tracking-tight">StoresX</span>
                    </div>
                    {/* Search box */}
                    <div className="hidden sm:flex items-center gap-2.5 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-400 w-64 lg:w-80">
                      <LuSearch className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>Search products, customers, invoices...</span>
                    </div>
                  </div>

                  {/* Profile and Bell */}
                  <div className="flex items-center gap-3.5">
                    <button className="relative p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50">
                      <LuBell className="w-4.5 h-4.5" />
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
                    </button>
                    <div className="flex items-center gap-2.5 border-l border-slate-200 pl-3.5">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs sm:text-sm font-black">
                        RK
                      </div>
                      <div className="text-left hidden sm:block">
                        <p className="text-xs sm:text-sm font-bold text-slate-800 leading-tight">Ramesh Kumar</p>
                        <p className="text-[11px] text-slate-400">Store Owner</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mockup Body with Sidebar & Dashboard Content */}
                <div className="flex">
                  {/* Left Mini Sidebar */}
                  <div className="w-12 sm:w-44 lg:w-48 bg-[#0F172A] py-4 px-2 sm:px-3 flex flex-col gap-1.5 text-xs sm:text-sm shrink-0 font-medium">
                    <div className="flex items-center justify-center sm:justify-start gap-3 px-2.5 py-2 rounded-xl bg-[#2563EB] text-white font-bold shadow-xs">
                      <LuChartBar className="w-4 h-4 shrink-0" />
                      <span className="hidden sm:inline">Dashboard</span>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start gap-3 px-2.5 py-2 rounded-xl text-slate-400 hover:text-white transition-colors">
                      <LuBox className="w-4 h-4 shrink-0" />
                      <span className="hidden sm:inline">Inventory</span>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start gap-3 px-2.5 py-2 rounded-xl text-slate-400 hover:text-white transition-colors">
                      <LuReceipt className="w-4 h-4 shrink-0" />
                      <span className="hidden sm:inline">Sales</span>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start gap-3 px-2.5 py-2 rounded-xl text-slate-400 hover:text-white transition-colors">
                      <LuUsers className="w-4 h-4 shrink-0" />
                      <span className="hidden sm:inline">Customers</span>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start gap-3 px-2.5 py-2 rounded-xl text-slate-400 hover:text-white transition-colors">
                      <LuTruck className="w-4 h-4 shrink-0" />
                      <span className="hidden sm:inline">Suppliers</span>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start gap-3 px-2.5 py-2 rounded-xl text-slate-400 hover:text-white transition-colors">
                      <LuFileText className="w-4 h-4 shrink-0" />
                      <span className="hidden sm:inline">Reports</span>
                    </div>
                    <div className="mt-auto flex items-center justify-center sm:justify-start gap-3 px-2.5 py-2 rounded-xl text-slate-400">
                      <LuClock className="w-4 h-4 shrink-0" />
                      <span className="hidden sm:inline">Settings</span>
                    </div>
                  </div>

                  {/* Main Dashboard Canvas */}
                  <div className="flex-1 p-4 sm:p-6 bg-[#F8FAFC] space-y-4 sm:space-y-5 overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">Dashboard Overview</h4>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs sm:text-sm text-slate-600 font-semibold shadow-2xs">
                        <span>This Month</span>
                        <LuChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    </div>

                    {/* 4 Stat Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-3.5">
                      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-500">Total Sales</span>
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        </div>
                        <p className="mt-1 text-base sm:text-xl font-black text-slate-900 tracking-tight">₹2,48,320</p>
                        <span className="text-[10px] sm:text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md mt-1.5 inline-block">
                          +12.5% vs last month
                        </span>
                      </div>

                      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-500">Total Orders</span>
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                        </div>
                        <p className="mt-1 text-base sm:text-xl font-black text-slate-900 tracking-tight">1,243</p>
                        <span className="text-[10px] sm:text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md mt-1.5 inline-block">
                          +8% vs last week
                        </span>
                      </div>

                      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-500">Stock Items</span>
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                        </div>
                        <p className="mt-1 text-base sm:text-xl font-black text-slate-900 tracking-tight">892</p>
                        <span className="text-[10px] sm:text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md mt-1.5 inline-block">
                          -2% Low stock alert
                        </span>
                      </div>

                      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-500">New Customers</span>
                          <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                        </div>
                        <p className="mt-1 text-base sm:text-xl font-black text-slate-900 tracking-tight">186</p>
                        <span className="text-[10px] sm:text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md mt-1.5 inline-block">
                          +24% increase
                        </span>
                      </div>
                    </div>

                    {/* Bottom Row: Chart + Top Products */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
                      {/* Left: Sales Overview Chart */}
                      <div className="sm:col-span-7 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs sm:text-sm font-bold text-slate-900">Sales Overview</span>
                          <span className="text-xs text-slate-500 border border-slate-200 rounded-lg px-2 py-0.5">
                            Last 6 Months ▾
                          </span>
                        </div>

                        <div className="relative h-40 sm:h-52 lg:h-56 w-full mt-1">
                          {/* Floating Tooltip */}
                          <div className="absolute top-2 left-[62%] -translate-x-1/2 z-10 bg-slate-900 text-white rounded-lg px-2.5 py-1 text-xs shadow-xl flex flex-col items-center pointer-events-none">
                            <span className="font-bold text-blue-300">₹2,48,320</span>
                            <span className="text-[10px] text-slate-300">Jun 2026</span>
                            <div className="w-2 h-2 bg-slate-900 rotate-45 -mb-1 mt-0.5" />
                          </div>

                          <svg className="w-full h-full overflow-visible" viewBox="0 0 300 100" preserveAspectRatio="none">
                            <defs>
                              <linearGradient id="heroBlueGradCompact" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#2563EB" stopOpacity="0.35" />
                                <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                              </linearGradient>
                            </defs>
                            <line x1="0" y1="20" x2="300" y2="20" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
                            <line x1="0" y1="50" x2="300" y2="50" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
                            <line x1="0" y1="80" x2="300" y2="80" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />

                            <path
                              d="M 0,75 C 45,70 50,60 90,65 C 130,70 150,45 190,30 C 220,18 240,40 270,35 C 285,32 295,25 300,20 L 300,95 L 0,95 Z"
                              fill="url(#heroBlueGradCompact)"
                            />
                            <path
                              d="M 0,75 C 45,70 50,60 90,65 C 130,70 150,45 190,30 C 220,18 240,40 270,35 C 285,32 295,25 300,20"
                              fill="none"
                              stroke="#2563EB"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                            />
                            <circle cx="190" cy="30" r="5" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2.5" />
                          </svg>

                          <div className="flex justify-between text-xs text-slate-400 mt-2 font-semibold">
                            <span>Jan</span>
                            <span>Feb</span>
                            <span>Mar</span>
                            <span>Apr</span>
                            <span>May</span>
                            <span className="font-bold text-blue-600">Jun</span>
                            <span>Jul</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Top Products */}
                      <div className="sm:col-span-5 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs sm:text-sm font-bold text-slate-900">Top Products</span>
                          <span className="text-xs font-bold text-blue-600 hover:underline cursor-pointer">
                            View All
                          </span>
                        </div>
                        <div className="space-y-2.5 text-xs sm:text-sm">
                          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                            <div className="flex items-center gap-2.5">
                              <span className="text-base">👕</span>
                              <span className="font-bold text-slate-800">Premium T-Shirt</span>
                            </div>
                            <span className="text-slate-700 font-black">142</span>
                          </div>
                          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                            <div className="flex items-center gap-2.5">
                              <span className="text-base">🎧</span>
                              <span className="font-bold text-slate-800">Wireless Headphones</span>
                            </div>
                            <span className="text-slate-700 font-black">98</span>
                          </div>
                          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                            <div className="flex items-center gap-2.5">
                              <span className="text-base">👟</span>
                              <span className="font-bold text-slate-800">Running Shoes</span>
                            </div>
                            <span className="text-slate-700 font-black">74</span>
                          </div>
                          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                            <div className="flex items-center gap-2.5">
                              <span className="text-base">⌚</span>
                              <span className="font-bold text-slate-800">Smart Watch</span>
                            </div>
                            <span className="text-slate-700 font-black">56</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <span className="text-base">🎒</span>
                              <span className="font-bold text-slate-800">Travel Backpack</span>
                            </div>
                            <span className="text-slate-700 font-black">42</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────── C. BENEFITS STRIP (Compact Margin) ────────────────── */}
      <section className="py-2.5 sm:py-3.5 bg-white border-y border-slate-100">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
            {BENEFITS_STRIP.map((item) => (
              <div
                key={item.title}
                className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#F8FAFF] border border-slate-200/80 hover:border-blue-200 hover:shadow-md transition-all group"
              >
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0 group-hover:bg-[#2563EB] group-hover:text-white transition-all">
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">{item.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5 leading-snug">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────── D. CORE FEATURES (No Massive Gaps) ────────────────── */}
      <section id="features" className="py-5 sm:py-7 bg-[#F8FAFF]">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
          {/* Section Header */}
          <div className="text-center max-w-4xl mx-auto mb-3.5 sm:mb-4">
            <span className="text-xs font-bold text-[#2563EB] tracking-wider uppercase">
              CORE FEATURES
            </span>
            <h2 className="mt-0.5 text-2xl sm:text-3xl lg:text-4xl font-black text-[#101828] tracking-tight">
              Everything You Need in One Platform
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-600">
              Powerful features to help you manage and grow your business efficiently.
            </p>
          </div>

          {/* 4 Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {/* Feature 1: Inventory Management */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              {/* Mini Preview Box */}
              <div className="bg-white border border-slate-200/80 rounded-xl p-3 sm:p-3.5 mb-3 shadow-2xs">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-800">Products</span>
                  <span className="text-[10px] font-bold text-white bg-[#2563EB] px-2.5 py-0.5 rounded-md">
                    + Add Product
                  </span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between bg-slate-50/80 p-2 rounded-lg border border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">👕</span>
                      <div>
                        <p className="font-bold text-slate-800 leading-none">T-Shirt</p>
                        <p className="text-[9px] text-slate-400 mt-0.5">SKU: 74892</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                      In Stock
                    </span>
                    <span className="font-black text-slate-800 text-xs">120</span>
                  </div>
                  <div className="flex items-center justify-between bg-slate-50/80 p-2 rounded-lg border border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">👖</span>
                      <div>
                        <p className="font-bold text-slate-800 leading-none">Jeans</p>
                        <p className="text-[9px] text-slate-400 mt-0.5">SKU: 34901</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                      In Stock
                    </span>
                    <span className="font-black text-slate-800 text-xs">85</span>
                  </div>
                  <div className="flex items-center justify-between bg-slate-50/80 p-2 rounded-lg border border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">👟</span>
                      <div>
                        <p className="font-bold text-slate-800 leading-none">Sneakers</p>
                        <p className="text-[9px] text-slate-400 mt-0.5">SKU: 29012</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded">
                      Low Stock
                    </span>
                    <span className="font-black text-slate-800 text-xs">12</span>
                  </div>
                </div>
              </div>

              {/* Card Meta */}
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center mb-2">
                  <LuBox className="w-5 h-5" />
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">Inventory Management</h3>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  Track products, stock levels and availability in real time across all branches.
                </p>
              </div>
            </div>

            {/* Feature 2: Sales & Billing */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              {/* Mini Preview Box */}
              <div className="bg-white border border-slate-200/80 rounded-xl p-3 sm:p-3.5 mb-3 shadow-2xs">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-800">New Sale</span>
                  <span className="text-[10px] text-slate-400 font-medium">POS Counter</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-[11px] text-slate-400 mb-2 flex items-center gap-1.5">
                  <LuSearch className="w-3 h-3 text-slate-400" />
                  <span>Search product or scan barcode...</span>
                </div>
                <div className="space-y-1 text-xs mb-2">
                  <div className="flex justify-between text-slate-700">
                    <span>T-Shirt (x1)</span>
                    <span className="font-bold">₹799</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>Jeans (x1)</span>
                    <span className="font-bold">₹1,299</span>
                  </div>
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount</span>
                    <span>- ₹100</span>
                  </div>
                  <div className="flex justify-between font-black text-slate-900 pt-1 border-t border-slate-100 text-xs">
                    <span>Total</span>
                    <span className="text-blue-600 text-sm">₹1,998</span>
                  </div>
                </div>
                <button className="w-full bg-[#2563EB] text-white py-1.5 rounded-lg text-xs font-bold shadow-xs">
                  Create Invoice
                </button>
              </div>

              {/* Card Meta */}
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center mb-2">
                  <LuReceipt className="w-5 h-5" />
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">Sales & Billing</h3>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  Manage counter sales, create GST invoices and handle instant billing workflows.
                </p>
              </div>
            </div>

            {/* Feature 3: Customer Management */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              {/* Mini Preview Box */}
              <div className="bg-white border border-slate-200/80 rounded-xl p-3 sm:p-3.5 mb-3 shadow-2xs">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-800">Customers</span>
                  <span className="text-[10px] font-bold text-white bg-[#2563EB] px-2.5 py-0.5 rounded-md">
                    + Add Customer
                  </span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between bg-slate-50/80 p-2 rounded-lg border border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold">
                        AS
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 leading-none">Amit Sharma</p>
                        <p className="text-[9px] text-slate-400 mt-0.5">amit@gmail.com</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-600 font-bold">14 Orders ›</span>
                  </div>
                  <div className="flex items-center justify-between bg-slate-50/80 p-2 rounded-lg border border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-[10px] font-bold">
                        PM
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 leading-none">Priya Mehta</p>
                        <p className="text-[9px] text-slate-400 mt-0.5">priya@gmail.com</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-600 font-bold">9 Orders ›</span>
                  </div>
                  <div className="flex items-center justify-between bg-slate-50/80 p-2 rounded-lg border border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-[10px] font-bold">
                        RV
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 leading-none">Rahul Verma</p>
                        <p className="text-[9px] text-slate-400 mt-0.5">rahul@gmail.com</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-600 font-bold">6 Orders ›</span>
                  </div>
                </div>
              </div>

              {/* Card Meta */}
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center mb-2">
                  <LuUsers className="w-5 h-5" />
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">Customer Management</h3>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  Organize customer ledgers, track udhaar credit balances and send reminders.
                </p>
              </div>
            </div>

            {/* Feature 4: Supplier Management */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              {/* Mini Preview Box */}
              <div className="bg-white border border-slate-200/80 rounded-xl p-3 sm:p-3.5 mb-3 shadow-2xs">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-800">Suppliers</span>
                  <span className="text-[10px] font-bold text-white bg-[#2563EB] px-2.5 py-0.5 rounded-md">
                    + Add Supplier
                  </span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between bg-slate-50/80 p-2 rounded-lg border border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold">
                        RT
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 leading-none">Raj Trading Co</p>
                        <p className="text-[9px] text-slate-400 mt-0.5">raj@gmail.com</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-slate-50/80 p-2 rounded-lg border border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold">
                        SD
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 leading-none">Shree Distributors</p>
                        <p className="text-[9px] text-slate-400 mt-0.5">shree@gmail.com</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-slate-50/80 p-2 rounded-lg border border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold">
                        GS
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 leading-none">Global Suppliers</p>
                        <p className="text-[9px] text-slate-400 mt-0.5">info@globalsuppliers.com</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Meta */}
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center mb-2">
                  <LuTruck className="w-5 h-5" />
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">Supplier Management</h3>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  Manage vendors, record purchase orders and monitor payable dues effortlessly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────── E. HOW IT WORKS (Compact Flow) ────────────────── */}
      <section className="py-5 sm:py-7 bg-white">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
          {/* Header */}
          <div className="text-center max-w-4xl mx-auto mb-3.5 sm:mb-4">
            <span className="text-xs font-bold text-[#2563EB] tracking-wider uppercase">
              HOW IT WORKS
            </span>
            <h2 className="mt-0.5 text-2xl sm:text-3xl lg:text-4xl font-black text-[#101828] tracking-tight">
              Get Started in Three Simple Steps
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-600">
              Start managing your business in minutes. No complicated setup required.
            </p>
          </div>

          {/* 3 Steps cleanly spaced with connecting arrows */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 items-stretch relative max-w-6xl mx-auto">
            {STEPS.map((step, idx) => (
              <div
                key={step.num}
                className="relative text-center flex flex-col items-center bg-[#F8FAFF] border border-slate-200/80 hover:border-blue-300 hover:shadow-lg transition-all rounded-2xl p-5 sm:p-6 group"
              >
                {/* Arrow connector for desktop */}
                {idx < STEPS.length - 1 && (
                  <div className="hidden md:flex items-center justify-center absolute -right-3 sm:-right-4 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-white border border-slate-200 text-blue-600 shadow-xs pointer-events-none">
                    <LuArrowRight className="w-3.5 h-3.5" />
                  </div>
                )}

                {/* Soft blue icon circle */}
                <div className="w-12 h-12 rounded-xl bg-blue-100/70 text-[#2563EB] flex items-center justify-center mb-2.5 group-hover:scale-105 group-hover:bg-[#2563EB] group-hover:text-white transition-all shadow-2xs">
                  <step.icon className="w-6 h-6" />
                </div>

                {/* Number pill */}
                <span className="text-[11px] font-black text-[#2563EB] bg-blue-50 border border-blue-200/80 px-2.5 py-0.5 rounded-full mb-1.5">
                  {step.num}
                </span>

                {/* Title */}
                <h3 className="text-base sm:text-lg font-black text-slate-900 mb-1">{step.title}</h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────── F. PRODUCT SHOWCASE (Compact Margin) ────────────────── */}
      <section id="solutions" className="py-5 sm:py-7 bg-[#F8FAFF]">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
          {/* Header with Title & Filter Tabs */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3.5 mb-4 sm:mb-5">
            <div>
              <span className="text-xs font-bold text-[#2563EB] tracking-wider uppercase">
                PRODUCT SHOWCASE
              </span>
              <h2 className="mt-0.5 text-2xl sm:text-3xl lg:text-4xl font-black text-[#101828] tracking-tight">
                A Closer Look at StoresX
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-xl">
                See how StoresX helps you manage your business with powerful and easy-to-use tools.
              </p>
            </div>

            {/* Interactive Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-200/70 rounded-xl">
              {SHOWCASE_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-[#2563EB] text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Showcase Split Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Column: Feature Highlights */}
            <div className="lg:col-span-5 text-left space-y-3.5">
              <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider">
                {currentTab.tag}
              </span>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                {currentTab.title}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {currentTab.desc}
              </p>

              {/* Checkmarks */}
              <div className="pt-1 space-y-2.5">
                {currentTab.highlights.map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-100 text-[#2563EB] flex items-center justify-center shrink-0">
                      <LuCheck className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span className="text-sm sm:text-base font-semibold text-slate-700">{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm sm:text-base font-bold text-[#2563EB] bg-blue-50 hover:bg-blue-100 rounded-xl transition-all"
                >
                  Try this feature for free
                  <LuArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Column: Realistic Dynamic App Screen Mockup */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl bg-white border border-slate-200/90 shadow-xl shadow-blue-900/10 overflow-hidden text-left">
                {/* Mockup Topbar */}
                <div className="bg-white border-b border-slate-200/80 px-4 py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-md bg-[#2563EB] flex items-center justify-center text-white">
                        <LuBoxes className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold text-slate-800">StoresX</span>
                    </div>
                    <span className="text-xs text-slate-400 hidden sm:inline">|</span>
                    <span className="text-xs font-semibold text-slate-600 hidden sm:inline capitalize">
                      {currentTab.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold">
                      RK
                    </div>
                    <span className="text-xs font-medium text-slate-700 hidden sm:inline">Ramesh Kumar</span>
                  </div>
                </div>

                {/* Mockup Body with Left Mini-Sidebar and Dynamic Screen */}
                <div className="flex min-h-[360px]">
                  {/* Left Mini Sidebar */}
                  <div className="w-10 sm:w-36 bg-[#0F172A] py-3 px-1 sm:px-2 flex flex-col gap-1 text-xs font-medium shrink-0">
                    {SHOWCASE_TABS.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setActiveTab(t.id)}
                        className={`flex items-center justify-center sm:justify-start gap-2 px-2 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                          activeTab === t.id
                            ? 'bg-[#2563EB] text-white font-bold'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <span className="hidden sm:inline truncate">{t.label}</span>
                        <span className="sm:hidden">{t.label[0]}</span>
                      </button>
                    ))}
                    <div className="mt-auto flex items-center justify-center sm:justify-start gap-2 px-2 py-1.5 rounded-lg text-slate-400">
                      <LuClock className="w-3.5 h-3.5 shrink-0" />
                      <span className="hidden sm:inline">Settings</span>
                    </div>
                  </div>

                  {/* Dynamic Content View */}
                  <div className="flex-1 p-4 bg-[#F8FAFC] overflow-hidden">
                    {/* 1. DASHBOARD VIEW */}
                    {activeTab === 'dashboard' && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs sm:text-sm font-black text-slate-800">Dashboard Overview</h4>
                          <span className="text-[10px] bg-white border border-slate-200 rounded px-2 py-0.5 text-slate-600 font-medium">
                            This Month ▾
                          </span>
                        </div>

                        {/* 4 Stat Cards */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-2xs">
                            <span className="text-[10px] text-slate-500 font-medium">Total Sales</span>
                            <p className="text-sm sm:text-base font-black text-slate-900 mt-0.5">₹2,48,320</p>
                            <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1 py-0.2 rounded mt-0.5 inline-block">
                              +12.5%
                            </span>
                          </div>
                          <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-2xs">
                            <span className="text-[10px] text-slate-500 font-medium">Orders</span>
                            <p className="text-sm sm:text-base font-black text-slate-900 mt-0.5">1,243</p>
                            <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1 py-0.2 rounded mt-0.5 inline-block">
                              +8%
                            </span>
                          </div>
                          <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-2xs">
                            <span className="text-[10px] text-slate-500 font-medium">Stock</span>
                            <p className="text-sm sm:text-base font-black text-slate-900 mt-0.5">892</p>
                            <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-1 py-0.2 rounded mt-0.5 inline-block">
                              -2% Low
                            </span>
                          </div>
                          <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-2xs">
                            <span className="text-[10px] text-slate-500 font-medium">Customers</span>
                            <p className="text-sm sm:text-base font-black text-slate-900 mt-0.5">186</p>
                            <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1 py-0.2 rounded mt-0.5 inline-block">
                              +24%
                            </span>
                          </div>
                        </div>

                        {/* Chart + Top Products */}
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                          <div className="sm:col-span-7 bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
                            <div className="flex justify-between items-center mb-1.5">
                              <span className="text-[11px] font-bold text-slate-800">Sales Trend</span>
                              <span className="text-[9px] text-slate-500 border rounded px-1.5 py-0.5">Last 6 Months ▾</span>
                            </div>
                            <div className="relative h-24 w-full">
                              <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
                                <defs>
                                  <linearGradient id="scDashBlueCompact" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#2563EB" stopOpacity="0.3" />
                                    <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                                  </linearGradient>
                                </defs>
                                <path
                                  d="M 0,75 C 45,70 50,60 90,65 C 130,70 150,45 190,30 C 220,18 240,40 270,35 C 285,32 295,25 300,20 L 300,95 L 0,95 Z"
                                  fill="url(#scDashBlueCompact)"
                                />
                                <path
                                  d="M 0,75 C 45,70 50,60 90,65 C 130,70 150,45 190,30 C 220,18 240,40 270,35 C 285,32 295,25 300,20"
                                  fill="none"
                                  stroke="#2563EB"
                                  strokeWidth="2"
                                />
                                <circle cx="190" cy="30" r="3.5" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2" />
                              </svg>
                              <div className="flex justify-between text-[9px] text-slate-400 mt-0.5">
                                <span>Jan</span>
                                <span>Feb</span>
                                <span>Mar</span>
                                <span>Apr</span>
                                <span>May</span>
                                <span className="font-bold text-blue-600">Jun</span>
                                <span>Jul</span>
                              </div>
                            </div>
                          </div>

                          <div className="sm:col-span-5 bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs text-[10px] space-y-1.5">
                            <div className="flex justify-between items-center mb-0.5">
                              <span className="font-bold text-slate-800">Top Items</span>
                              <span className="text-blue-600 font-bold cursor-pointer text-[9px]">View All</span>
                            </div>
                            <div className="flex justify-between items-center pb-1 border-b border-slate-100">
                              <span className="font-medium text-slate-800">Premium T-Shirt</span>
                              <span className="text-slate-600 font-bold">142</span>
                            </div>
                            <div className="flex justify-between items-center pb-1 border-b border-slate-100">
                              <span className="font-medium text-slate-800">Wireless Headphones</span>
                              <span className="text-slate-600 font-bold">98</span>
                            </div>
                            <div className="flex justify-between items-center pb-1 border-b border-slate-100">
                              <span className="font-medium text-slate-800">Running Shoes</span>
                              <span className="text-slate-600 font-bold">74</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-slate-800">Smart Watch</span>
                              <span className="text-slate-600 font-bold">56</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 2. INVENTORY VIEW */}
                    {activeTab === 'inventory' && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs sm:text-sm font-black text-slate-800">Product Inventory</h4>
                          <span className="text-[10px] font-bold text-white bg-[#2563EB] px-2.5 py-0.5 rounded shadow-2xs">
                            + Add Product
                          </span>
                        </div>
                        <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden text-[11px] shadow-2xs">
                          <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                              <tr>
                                <th className="p-2.5">Item</th>
                                <th className="p-2.5">SKU</th>
                                <th className="p-2.5">Stock</th>
                                <th className="p-2.5">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700">
                              <tr>
                                <td className="p-2.5 font-bold">Cotton T-Shirt (M)</td>
                                <td className="p-2.5 text-slate-400">TS-012</td>
                                <td className="p-2.5 font-black text-slate-900">120 pcs</td>
                                <td className="p-2.5">
                                  <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded font-bold text-[9px]">
                                    In Stock
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td className="p-2.5 font-bold">Slim Fit Denim</td>
                                <td className="p-2.5 text-slate-400">DN-342</td>
                                <td className="p-2.5 font-black text-slate-900">85 pcs</td>
                                <td className="p-2.5">
                                  <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded font-bold text-[9px]">
                                    In Stock
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td className="p-2.5 font-bold">Running Shoes 8</td>
                                <td className="p-2.5 text-slate-400">SH-901</td>
                                <td className="p-2.5 font-black text-amber-600">8 pcs</td>
                                <td className="p-2.5">
                                  <span className="bg-amber-50 text-amber-700 px-1.5 py-0.2 rounded font-bold text-[9px]">
                                    Low Stock
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td className="p-2.5 font-bold">Wireless Earbuds</td>
                                <td className="p-2.5 text-slate-400">EB-702</td>
                                <td className="p-2.5 font-black text-rose-600">0 pcs</td>
                                <td className="p-2.5">
                                  <span className="bg-rose-50 text-rose-700 px-1.5 py-0.2 rounded font-bold text-[9px]">
                                    Out of Stock
                                  </span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* 3. SALES & BILLING VIEW */}
                    {activeTab === 'sales' && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs sm:text-sm font-black text-slate-800">Quick POS Billing</h4>
                          <span className="text-[10px] text-slate-500 font-semibold">Invoice #INV-2026-089</span>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-slate-200/80 space-y-2 text-[11px] shadow-2xs">
                          <div className="flex justify-between items-center pb-1.5 border-b border-slate-100">
                            <div>
                              <p className="font-bold text-slate-800">Premium T-Shirt</p>
                              <p className="text-[9px] text-slate-400">Qty: 2 × ₹799</p>
                            </div>
                            <span className="font-black text-slate-800">₹1,598</span>
                          </div>
                          <div className="flex justify-between items-center pb-1.5 border-b border-slate-100">
                            <div>
                              <p className="font-bold text-slate-800">Running Shoes</p>
                              <p className="text-[9px] text-slate-400">Qty: 1 × ₹1,299</p>
                            </div>
                            <span className="font-black text-slate-800">₹1,299</span>
                          </div>
                          <div className="space-y-1 text-slate-500 pt-1">
                            <div className="flex justify-between">
                              <span>Subtotal</span>
                              <span>₹2,897</span>
                            </div>
                            <div className="flex justify-between">
                              <span>GST (18%)</span>
                              <span>₹521</span>
                            </div>
                            <div className="flex justify-between font-black text-slate-900 text-xs pt-1 border-t border-slate-100">
                              <span>Grand Total</span>
                              <span className="text-blue-600 text-sm">₹3,418</span>
                            </div>
                          </div>
                          <button className="w-full bg-[#2563EB] text-white py-2 rounded-lg text-xs font-bold shadow-xs mt-1">
                            Generate & Print Bill
                          </button>
                        </div>
                      </div>
                    )}

                    {/* 4. CUSTOMERS VIEW */}
                    {activeTab === 'customers' && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs sm:text-sm font-black text-slate-800">Customer Credit & Ledger</h4>
                          <span className="text-[10px] font-bold text-white bg-[#2563EB] px-2.5 py-0.5 rounded shadow-2xs">
                            + Add Customer
                          </span>
                        </div>
                        <div className="space-y-1.5 text-[11px]">
                          <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 flex items-center justify-between shadow-2xs">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px]">
                                AS
                              </div>
                              <div>
                                <p className="font-bold text-slate-800">Amit Sharma</p>
                                <p className="text-[9px] text-slate-400">+91 98765 43210</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-black text-slate-900">₹4,250 Udhaar</p>
                              <span className="text-[9px] text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded font-bold">
                                Reminder Sent
                              </span>
                            </div>
                          </div>
                          <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 flex items-center justify-between shadow-2xs">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-[10px]">
                                PM
                              </div>
                              <div>
                                <p className="font-bold text-slate-800">Priya Mehta</p>
                                <p className="text-[9px] text-slate-400">+91 98234 11223</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-black text-emerald-600">₹0 Dues</p>
                              <span className="text-[9px] text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded font-bold">
                                Clear
                              </span>
                            </div>
                          </div>
                          <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 flex items-center justify-between shadow-2xs">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-[10px]">
                                RV
                              </div>
                              <div>
                                <p className="font-bold text-slate-800">Rahul Verma</p>
                                <p className="text-[9px] text-slate-400">+91 97112 99887</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-black text-slate-900">₹1,800 Udhaar</p>
                              <span className="text-[9px] text-slate-500 bg-slate-50 px-1.5 py-0.2 rounded font-bold">
                                Due in 3 days
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 5. SUPPLIERS VIEW */}
                    {activeTab === 'suppliers' && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs sm:text-sm font-black text-slate-800">Supplier Directory & POs</h4>
                          <span className="text-[10px] font-bold text-white bg-[#2563EB] px-2.5 py-0.5 rounded shadow-2xs">
                            + Add Supplier
                          </span>
                        </div>
                        <div className="space-y-1.5 text-[11px]">
                          <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 flex items-center justify-between shadow-2xs">
                            <div>
                              <p className="font-bold text-slate-800">Raj Trading Co</p>
                              <p className="text-[9px] text-slate-400">Garment Supplier | Mumbai</p>
                            </div>
                            <div className="text-right">
                              <p className="font-black text-slate-900">₹32,500</p>
                              <span className="text-[9px] text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded font-bold">
                                Payment Pending
                              </span>
                            </div>
                          </div>
                          <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 flex items-center justify-between shadow-2xs">
                            <div>
                              <p className="font-bold text-slate-800">Shree Distributors</p>
                              <p className="text-[9px] text-slate-400">Electronics & Accessories | Delhi</p>
                            </div>
                            <div className="text-right">
                              <p className="font-black text-emerald-600">₹0</p>
                              <span className="text-[9px] text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded font-bold">
                                Paid
                              </span>
                            </div>
                          </div>
                          <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 flex items-center justify-between shadow-2xs">
                            <div>
                              <p className="font-bold text-slate-800">Global Suppliers</p>
                              <p className="text-[9px] text-slate-400">Footwear & Goods | Surat</p>
                            </div>
                            <div className="text-right">
                              <p className="font-black text-slate-900">₹14,200</p>
                              <span className="text-[9px] text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded font-bold">
                                In Transit
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────── G. WHY CHOOSE STORESX (Compact) ────────────────── */}
      <section className="py-5 sm:py-7 bg-white">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Left Header */}
            <div className="lg:col-span-5 text-left space-y-2">
              <span className="text-xs font-bold text-[#2563EB] tracking-wider uppercase">
                WHY CHOOSE STORESX
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#101828] tracking-tight leading-tight">
                Everything Your Business Needs to Grow
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-lg">
                Simplify your operations, save time and make better decisions with an all-in-one business management platform.
              </p>
            </div>

            {/* Right Grid of Benefit Cards */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
              {WHY_CHOOSE_ITEMS.map((item) => (
                <div
                  key={item.title}
                  className="bg-[#F8FAFF] rounded-2xl p-4 sm:p-4.5 border border-slate-200/90 hover:border-blue-200 hover:shadow-md transition-all flex items-start gap-3.5"
                >
                  <div
                    className={`w-10 h-10 rounded-xl ${item.iconBg} ${item.iconColor} flex items-center justify-center shrink-0 mt-0.5 shadow-2xs`}
                  >
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">{item.title}</h3>
                    <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────── H. PRICING SECTION (Compact) ────────────────── */}
      <section id="pricing" className="py-5 sm:py-7 bg-[#F8FAFF]">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
          {/* Header */}
          <div className="text-center max-w-4xl mx-auto mb-3.5 sm:mb-4">
            <span className="text-xs font-bold text-[#2563EB] tracking-wider uppercase">
              PRICING
            </span>
            <h2 className="mt-0.5 text-2xl sm:text-3xl lg:text-4xl font-black text-[#101828] tracking-tight">
              Choose the Right Plan for Your Business
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-600">
              Flexible plans designed for businesses of all sizes. Contact us for detailed pricing information.
            </p>
          </div>

          {/* 3 Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 items-stretch max-w-6xl mx-auto">
            {PRICING_PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl p-5 sm:p-6 bg-white transition-all duration-300 ${
                  plan.highlight
                    ? 'border-2 border-[#2563EB] shadow-xl shadow-blue-600/15 md:-translate-y-1.5'
                    : 'border border-slate-200/90 hover:shadow-lg'
                }`}
              >
                {/* Popular Pill */}
                {plan.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center px-3 py-0.5 rounded-full text-[11px] font-black bg-[#2563EB] text-white shadow-md tracking-wide">
                    {plan.badge}
                  </span>
                )}

                {/* Plan Header */}
                <div className="flex items-center gap-3 mb-1.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
                    <plan.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900">{plan.name}</h3>
                  </div>
                </div>

                <p className="text-xs text-slate-500 min-h-[28px] mt-0.5">{plan.desc}</p>

                {/* Feature List */}
                <div className="mt-3 pt-3 border-t border-slate-100 flex-1 space-y-2">
                  {plan.features.map((feat) => (
                    <div key={feat} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                      <LuCheck className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5 stroke-[2.5]" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <div className="mt-5 pt-1">
                  <Link
                    to="/contact"
                    className={`w-full inline-flex items-center justify-center px-5 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                      plan.buttonVariant === 'primary'
                        ? 'bg-[#2563EB] hover:bg-blue-700 text-white shadow-md shadow-blue-500/25'
                        : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-2xs'
                    }`}
                  >
                    {plan.buttonText}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────── I. FREQUENTLY ASKED QUESTIONS (Compact) ────────────────── */}
      <section className="py-5 sm:py-7 bg-white">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
          {/* Header */}
          <div className="text-center max-w-4xl mx-auto mb-3.5 sm:mb-4">
            <span className="text-xs font-bold text-[#2563EB] tracking-wider uppercase">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="mt-0.5 text-2xl sm:text-3xl lg:text-4xl font-black text-[#101828] tracking-tight">
              Got Questions? We&apos;ve Got Answers.
            </h2>
          </div>

          {/* 2-Column Accordion */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-3.5">
            {FAQS_LIST.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={faq.q}
                  className="bg-white rounded-xl border border-slate-200/90 overflow-hidden shadow-2xs transition-all duration-200 hover:border-blue-200"
                >
                  <button
                    onClick={() => toggleFaq(i)}
                    aria-expanded={isOpen}
                    className="flex items-center justify-between w-full px-4.5 py-3 sm:py-3.5 text-left cursor-pointer"
                  >
                    <span className="text-xs sm:text-sm font-bold text-slate-900 pr-3">{faq.q}</span>
                    <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-slate-500 transition-colors">
                      {isOpen ? <LuMinus className="w-3 h-3" /> : <LuPlus className="w-3 h-3" />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-4.5 pb-3 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ────────────────── J. FINAL CTA & FOOTER (Compact) ────────────────── */}
      <div className="bg-white">
        {/* Final CTA Container */}
        <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 pb-4 sm:pb-6">
          <div className="relative rounded-2xl bg-[#0B132B] px-6 py-6 sm:px-10 sm:py-7 overflow-hidden shadow-xl flex flex-col md:flex-row items-center justify-between gap-5">
            {/* Subtle background glow */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

            {/* Left Copy */}
            <div className="text-left relative z-10 space-y-1">
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Ready to Take Control of Your Business?
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Start managing your business smarter with StoresX today.
              </p>
            </div>

            {/* Right Action Button */}
            <div className="relative z-10 shrink-0 w-full sm:w-auto">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 text-xs sm:text-sm font-bold text-white bg-[#2563EB] hover:bg-blue-600 rounded-xl shadow-lg shadow-blue-600/35 transition-all"
              >
                Get Started Today
                <LuArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Multi-Column Footer */}
        <footer className="border-t border-slate-100 pt-6 pb-6 text-left bg-white">
          <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
            <div className="grid grid-cols-2 md:grid-cols-12 gap-6 lg:gap-8">
              {/* Brand Column (Span 4) */}
              <div className="col-span-2 md:col-span-4 space-y-2.5">
                <Link to="/" className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#2563EB] flex items-center justify-center text-white shadow-xs">
                    <LuBoxes className="w-4 h-4" />
                  </div>
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-[#101828]">
                    Stores<span className="text-[#2563EB]">X</span>
                  </span>
                </Link>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-sm">
                  An all-in-one business management platform for Indian businesses. Manage inventory, sales, customers and suppliers from one simple dashboard.
                </p>
                {/* Social Links */}
                <div className="pt-1 flex items-center gap-2.5 text-slate-400">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Facebook"
                    className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    <LuFacebook className="w-4 h-4" />
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Instagram"
                    className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center hover:text-pink-600 hover:bg-pink-50 transition-colors"
                  >
                    <LuInstagram className="w-4 h-4" />
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn"
                    className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center hover:text-blue-700 hover:bg-blue-50 transition-colors"
                  >
                    <LuLinkedin className="w-4 h-4" />
                  </a>
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="YouTube"
                    className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LuYoutube className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Product Column (Span 2) */}
              <div className="col-span-1 md:col-span-2">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">Product</h4>
                <ul className="mt-3 space-y-2 text-xs sm:text-sm text-slate-600 font-medium">
                  <li>
                    <a href="#features" className="hover:text-[#2563EB] transition-colors">
                      Features
                    </a>
                  </li>
                  <li>
                    <Link to="/pricing" className="hover:text-[#2563EB] transition-colors">
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link to="/integrations" className="hover:text-[#2563EB] transition-colors">
                      Integrations
                    </Link>
                  </li>
                  <li>
                    <Link to="/changelog" className="hover:text-[#2563EB] transition-colors">
                      Updates
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Solutions Column (Span 2) */}
              <div className="col-span-1 md:col-span-2">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">Solutions</h4>
                <ul className="mt-3 space-y-2 text-xs sm:text-sm text-slate-600 font-medium">
                  <li>
                    <a href="#solutions" className="hover:text-[#2563EB] transition-colors">
                      Retail Stores
                    </a>
                  </li>
                  <li>
                    <a href="#solutions" className="hover:text-[#2563EB] transition-colors">
                      Wholesale Business
                    </a>
                  </li>
                  <li>
                    <a href="#solutions" className="hover:text-[#2563EB] transition-colors">
                      Multi-Store Management
                    </a>
                  </li>
                  <li>
                    <a href="#solutions" className="hover:text-[#2563EB] transition-colors">
                      Small Businesses
                    </a>
                  </li>
                </ul>
              </div>

              {/* Company Column (Span 2) */}
              <div className="col-span-1 md:col-span-2">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">Company</h4>
                <ul className="mt-3 space-y-2 text-xs sm:text-sm text-slate-600 font-medium">
                  <li>
                    <Link to="/about" className="hover:text-[#2563EB] transition-colors">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link to="/careers" className="hover:text-[#2563EB] transition-colors">
                      Careers
                    </Link>
                  </li>
                  <li>
                    <Link to="/blog" className="hover:text-[#2563EB] transition-colors">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" className="hover:text-[#2563EB] transition-colors">
                      Contact Us
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Support Column (Span 2) */}
              <div className="col-span-1 md:col-span-2">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">Support</h4>
                <ul className="mt-3 space-y-2 text-xs sm:text-sm text-slate-600 font-medium">
                  <li>
                    <Link to="/contact" className="hover:text-[#2563EB] transition-colors">
                      Help Center
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" className="hover:text-[#2563EB] transition-colors">
                      Documentation
                    </Link>
                  </li>
                  <li>
                    <Link to="/privacy" className="hover:text-[#2563EB] transition-colors">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link to="/terms" className="hover:text-[#2563EB] transition-colors">
                      Terms &amp; Conditions
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Sub-footer Bar */}
            <div className="mt-8 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-slate-500">
              <p>&copy; 2026 StoresX. All rights reserved.</p>
              <div className="flex items-center gap-4">
                <a href="mailto:support@storesx.in" className="hover:text-slate-800 transition-colors">
                  support@storesx.in
                </a>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <span>Made with pride in India</span>
                  <IndianFlag className="w-3.5 h-2.5" />
                </span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
