import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
  HiOutlineCheckCircle,
  HiOutlineCube,
  HiOutlineUserGroup,
  HiOutlineBuildingOffice,
  HiOutlineArrowUpRight,
  HiOutlineArrowPath,
  HiOutlineCreditCard,
  HiOutlineExclamationTriangle,
} from 'react-icons/hi2';

import PageHeader from '../../components/PageHeader';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import Modal from '../../components/Modal';
import { subscriptionApi } from '../../api/subscriptionApi';
import { useBusiness } from '../../context/BusinessContext';
import { formatCurrency } from '../../utils/helpers';

function Subscription() {
  const { refreshBusiness } = useBusiness();
  const [currentPlan, setCurrentPlan] = useState(null);
  const [plans, setPlans] = useState([]);
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [paymentDialog, setPaymentDialog] = useState({ open: false, plan: null, orderId: '', amount: 0 });
  const [paying, setPaying] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [planRes, plansRes, usageRes] = await Promise.allSettled([
        subscriptionApi.getCurrentPlan(),
        subscriptionApi.getPlans(),
        subscriptionApi.getUsage(),
      ]);

      if (planRes.status === 'fulfilled') {
        setCurrentPlan(planRes.value?.data?.data ?? planRes.value?.data ?? null);
      }
      if (plansRes.status === 'fulfilled') {
        const rawPlans = plansRes.value?.data?.data ?? plansRes.value?.data ?? plansRes.value?.data?.plans ?? [];
        setPlans(Array.isArray(rawPlans) ? rawPlans : []);
      }
      if (usageRes.status === 'fulfilled') {
        setUsage(usageRes.value?.data?.data ?? usageRes.value?.data ?? null);
      }
    } catch {
      toast.error('Failed to load subscription data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Resolve plan and expiration details from currentPlan
  const planObj = currentPlan?.planId && typeof currentPlan.planId === 'object' ? currentPlan.planId : null;
  const currentPlanId = planObj?._id || currentPlan?.planId || currentPlan?.id;
  const currentPlanName = (planObj?.name || currentPlan?.name || 'Free').trim();
  const currentPlanPrice = planObj?.price ?? currentPlan?.price ?? 0;
  const currentPlanInterval = planObj?.interval || currentPlan?.interval || 'month';
  const currentPlanEndDate = currentPlan?.endDate || currentPlan?.renewalDate;

  const isExpired =
    currentPlan?.status === 'expired' ||
    (currentPlanEndDate && new Date(currentPlanEndDate) < new Date());

  const handleUpgrade = async (planId) => {
    const plan = plans.find((p) => String(p._id || p.id) === String(planId));
    if (!plan) return;

    if (plan.price > 0) {
      // Show payment dialog for paid plans
      try {
        setUpgrading(true);
        const { data } = await subscriptionApi.createPaymentIntent({
          planId: plan._id || plan.id,
          subscriptionId: currentPlan?._id,
        });
        const intent = data?.data ?? data;
        setPaymentDialog({
          open: true,
          plan,
          orderId: intent.orderId,
          amount: intent.amount || plan.price,
        });
      } catch (err) {
        toast.error(err?.response?.data?.message || 'Failed to initiate payment');
      } finally {
        setUpgrading(false);
      }
    } else {
      // Free plan - subscribe / reactivate directly
      setUpgrading(true);
      try {
        await subscriptionApi.subscribe({ planId: plan._id || plan.id });
        toast.success(
          isExpired
            ? 'Free plan reactivated successfully'
            : 'Subscription plan updated successfully'
        );
        fetchData();
        refreshBusiness?.();
      } catch (err) {
        toast.error(err?.response?.data?.message || 'Failed to update subscription');
      } finally {
        setUpgrading(false);
      }
    }
  };

  const handleSimulatedPayment = async () => {
    setPaying(true);
    try {
      const planId = paymentDialog.plan?._id || paymentDialog.plan?.id;
      const mockPaymentId = `pay_sim_${Date.now()}`;

      // Activate subscription
      await subscriptionApi.subscribe({
        planId,
        paymentMethod: 'card',
      });

      // Verify payment record
      await subscriptionApi.verifyPayment({
        subscriptionId: currentPlan?._id,
        planId,
        paymentId: mockPaymentId,
        orderId: paymentDialog.orderId,
        amount: paymentDialog.amount,
      });

      toast.success('Payment successful! Subscription activated.');
      setPaymentDialog({ open: false, plan: null, orderId: '', amount: 0 });
      fetchData();
      refreshBusiness?.();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Payment verification failed');
    } finally {
      setPaying(false);
    }
  };

  const PLAN_COLORS = {
    free: { border: 'border-gray-200', bg: 'bg-gray-50', badge: 'gray', button: 'secondary' },
    starter: { border: 'border-blue-200', bg: 'bg-blue-50/50', badge: 'info', button: 'primary' },
    business: { border: 'border-purple-200', bg: 'bg-purple-50/50', badge: 'info', button: 'primary' },
    pro: { border: 'border-green-200', bg: 'bg-green-50/50', badge: 'success', button: 'primary' },
  };

  const isCurrentPlan = (plan) => {
    const pId = plan._id || plan.id;
    if (pId && currentPlanId && String(pId) === String(currentPlanId)) return true;
    if (plan.name && currentPlanName && plan.name.toLowerCase() === currentPlanName.toLowerCase()) return true;
    if (!currentPlan && plan.price === 0) return true;
    return false;
  };

  const isHigherPlan = (plan) => {
    if (!currentPlan) return plan.price > 0;
    const planOrder = ['free', 'starter', 'business', 'pro'];
    const currentIdx = planOrder.indexOf(currentPlanName.toLowerCase());
    const planIdx = planOrder.indexOf((plan.name || '').toLowerCase());
    return planIdx > currentIdx;
  };

  const getPlanFeatures = (plan) => {
    const features = plan.limits?.features || plan.features || [];
    if (features.length > 0) {
      return features.map((f) => f.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()));
    }
    const name = (plan.name || '').toLowerCase();
    const defaults = {
      free: ['Up to 50 products', 'Up to 1 user', 'Basic reports', 'POS checkout', 'Single branch'],
      starter: ['Up to 100 products', 'Up to 3 users', 'Standard reports', 'Multi-branch (3)', 'Email support'],
      business: ['Up to 500 products', 'Up to 10 users', 'Advanced analytics', 'Multi-branch (10)', 'Priority support', 'Scan & Stock OCR'],
      pro: ['Unlimited products', 'Unlimited users', 'Full analytics & reports', 'Unlimited branches', '24/7 priority support', 'Custom integrations'],
    };
    return defaults[name] || ['Standard StoreX features'];
  };

  if (loading) return <LoadingSpinner type="card" />;

  return (
    <div>
      <PageHeader
        title="Subscription"
        subtitle="Manage, reactivate, or upgrade your StoreX subscription plan"
      />

      {/* Expired Plan Banner */}
      {isExpired && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
              <HiOutlineExclamationTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-red-900">Your Subscription Plan Has Expired</h4>
              <p className="text-xs text-red-700 mt-1">
                {currentPlanEndDate
                  ? `Your plan expired on ${new Date(currentPlanEndDate).toLocaleDateString('en-IN')}. `
                  : 'Your subscription period has ended. '}
                Reactivate your current plan or upgrade to any plan below to restore full write access.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Current Plan Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900">
                {currentPlanName} Plan
              </h3>
              <Badge
                variant={
                  isExpired
                    ? 'danger'
                    : currentPlan?.status === 'active'
                    ? 'success'
                    : currentPlan?.status === 'trial'
                    ? 'warning'
                    : 'gray'
                }
              >
                {isExpired ? 'Expired' : (currentPlan?.status || 'Active')}
              </Badge>
            </div>
            <p className="text-sm text-gray-500">
              {currentPlanPrice > 0
                ? `${formatCurrency(currentPlanPrice)}/${currentPlanInterval}`
                : 'Free Plan'}
              {currentPlanEndDate && (
                <span className="ml-2">
                  · {isExpired ? 'Expired on' : 'Renews on'}{' '}
                  {new Date(currentPlanEndDate).toLocaleDateString('en-IN')}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Usage Meters */}
        {usage && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6 pt-6 border-t border-gray-100">
            {[
              {
                label: 'Products',
                used: usage.productsUsed ?? usage.products?.used ?? 0,
                limit: usage.productsLimit ?? usage.products?.limit ?? 50,
                icon: HiOutlineCube,
              },
              {
                label: 'Users',
                used: usage.usersUsed ?? usage.users?.used ?? 1,
                limit: usage.usersLimit ?? usage.users?.limit ?? 1,
                icon: HiOutlineUserGroup,
              },
              {
                label: 'Branches',
                used: usage.branchesUsed ?? usage.branches?.used ?? 1,
                limit: usage.branchesLimit ?? usage.branches?.limit ?? 1,
                icon: HiOutlineBuildingOffice,
              },
            ].map((item) => {
              const percentage = item.limit ? Math.min((item.used / item.limit) * 100, 100) : 0;
              const isNearLimit = percentage >= 80;
              const isAtLimit = item.limit && item.used >= item.limit;
              return (
                <div key={item.label} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <item.icon
                        className={`w-4 h-4 ${
                          isAtLimit ? 'text-red-500' : isNearLimit ? 'text-yellow-500' : 'text-gray-400'
                        }`}
                      />
                      <span className="text-sm font-medium text-gray-700">{item.label}</span>
                    </div>
                    <span className={`text-sm font-medium ${isAtLimit ? 'text-red-600' : 'text-gray-500'}`}>
                      {item.used} / {!item.limit || item.limit === Infinity ? '∞' : item.limit}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isAtLimit ? 'bg-red-500' : isNearLimit ? 'bg-yellow-500' : 'bg-blue-600'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  {isAtLimit && (
                    <p className="text-xs text-red-500">Limit reached. Upgrade to add more.</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Plan Comparison */}
      <h3 className="text-base font-semibold text-gray-900 mb-4">Available Plans</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {plans.map((plan) => {
          const planKey = (plan.name || '').toLowerCase() || 'free';
          const isCurrent = isCurrentPlan(plan);
          const isHigher = isHigherPlan(plan);
          const colors = PLAN_COLORS[planKey] || PLAN_COLORS.free;
          const features = getPlanFeatures(plan);
          const planId = plan._id || plan.id;

          return (
            <div
              key={planId}
              className={`bg-white rounded-xl border-2 p-5 relative transition-shadow ${
                isCurrent ? `${colors.border} shadow-md` : 'border-gray-200 hover:shadow-sm'
              }`}
            >
              {isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant={isExpired ? 'danger' : 'success'} className="flex items-center gap-1">
                    <HiOutlineCheckCircle className="w-3.5 h-3.5" />
                    {isExpired ? 'Current (Expired)' : 'Current'}
                  </Badge>
                </div>
              )}

              <div className={`text-center ${isCurrent ? 'pt-2' : ''}`}>
                <h4 className="text-lg font-bold text-gray-900">{plan.name}</h4>
                <div className="mt-2 mb-4">
                  <span className="text-3xl font-bold text-gray-900">
                    {plan.price > 0 ? formatCurrency(plan.price) : 'Free'}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-sm text-gray-500">/{plan.interval || 'month'}</span>
                  )}
                </div>

                <ul className="space-y-2 text-left mb-6 min-h-[140px]">
                  {features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                      <HiOutlineCheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* If it's the current plan and expired: allow reactivating */}
                {isCurrent && isExpired && (
                  <Button
                    className="w-full flex items-center justify-center gap-1.5"
                    variant="primary"
                    onClick={() => handleUpgrade(planId)}
                    loading={upgrading}
                  >
                    {plan.price > 0 ? (
                      <>
                        Reactivate & Pay <HiOutlineCreditCard className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        Reactivate Free Plan <HiOutlineArrowPath className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                )}

                {/* If it's current plan and active */}
                {isCurrent && !isExpired && (
                  <Button className="w-full" variant="secondary" disabled>
                    Current Plan
                  </Button>
                )}

                {/* If it's not the current plan */}
                {!isCurrent && (
                  <Button
                    className="w-full flex items-center justify-center gap-1.5"
                    variant={isHigher || isExpired ? 'primary' : 'secondary'}
                    onClick={() => handleUpgrade(planId)}
                    loading={upgrading}
                  >
                    {plan.price > 0 ? (
                      <>
                        Pay Now <HiOutlineCreditCard className="w-4 h-4" />
                      </>
                    ) : isHigher || isExpired ? (
                      <>
                        Choose Plan <HiOutlineArrowUpRight className="w-4 h-4" />
                      </>
                    ) : (
                      <>Switch Plan</>
                    )}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Payment Dialog */}
      <Modal
        isOpen={paymentDialog.open}
        onClose={() => setPaymentDialog({ open: false, plan: null, orderId: '', amount: 0 })}
        title="Complete Subscription Payment"
        size="sm"
      >
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <HiOutlineCreditCard className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-semibold text-blue-900">{paymentDialog.plan?.name} Plan</span>
            </div>
            <p className="text-2xl font-bold text-blue-900">
              {formatCurrency(paymentDialog.amount)}
              <span className="text-sm font-normal text-blue-600">/{paymentDialog.plan?.interval || 'month'}</span>
            </p>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-500">Order Reference</p>
            <p className="text-sm font-mono text-gray-700 mt-0.5">{paymentDialog.orderId}</p>
          </div>

          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-xs text-amber-800 font-medium">
              Payment Gateway Simulation
            </p>
            <p className="text-xs text-amber-700 mt-0.5">
              Click &quot;Confirm Payment&quot; below to simulate a successful payment and immediately activate the plan.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setPaymentDialog({ open: false, plan: null, orderId: '', amount: 0 })}
              disabled={paying}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 flex items-center justify-center gap-1.5"
              onClick={handleSimulatedPayment}
              loading={paying}
            >
              <HiOutlineCreditCard className="w-4 h-4" />
              Confirm Payment
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Subscription;
