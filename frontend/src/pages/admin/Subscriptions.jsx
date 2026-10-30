import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
  HiOutlineArrowPath,
  HiOutlineSparkles,
  HiOutlineCalendarDays,
  HiOutlineBuildingOffice2,
  HiOutlineCreditCard,
} from 'react-icons/hi2';
import PageHeader from '../../components/PageHeader';
import DataTable from '../../components/DataTable';
import Badge from '../../components/Badge';
import FormSelect from '../../components/FormSelect';
import FormInput from '../../components/FormInput';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import { adminApi } from '../../api/adminApi';
import { formatDate } from '../../utils/helpers';

const STATUS_VARIANT = {
  active: 'success',
  trial: 'warning',
  expired: 'danger',
  cancelled: 'gray',
};

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'trial', label: 'Trial' },
  { value: 'expired', label: 'Expired' },
  { value: 'cancelled', label: 'Cancelled' },
];

const durationOptions = [
  { value: '30', label: '1 Month (30 Days)' },
  { value: '60', label: '2 Months (60 Days)' },
  { value: '90', label: '3 Months (90 Days)' },
  { value: '180', label: '6 Months (180 Days)' },
  { value: '365', label: '1 Year (365 Days)' },
  { value: 'custom', label: 'Custom End Date' },
];

const reactivateStatusOptions = [
  { value: 'active', label: 'Active (Paid / Subscribed)' },
  { value: 'trial', label: 'Trial (Free Trial Extension)' },
];

function Subscriptions() {
  const [loading, setLoading] = useState(true);
  const [subscriptions, setSubscriptions] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 10;

  const [statusFilter, setStatusFilter] = useState('');
  const [planFilter, setPlanFilter] = useState('');
  const [availablePlans, setAvailablePlans] = useState([]);

  // Reactivate Modal State
  const [reactivateModal, setReactivateModal] = useState({ open: false, sub: null });
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    planId: '',
    duration: '30',
    customEndDate: '',
    status: 'active',
    note: '',
  });

  // Fetch available plans for modal & filter
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await adminApi.getPlans();
        const data = res.data?.data || res.data || [];
        const plans = Array.isArray(data) ? data : data.plans || [];
        setAvailablePlans(plans);
      } catch (err) {
        console.error('Failed to load plans:', err);
      }
    };
    fetchPlans();
  }, []);

  const fetchSubscriptions = useCallback(async () => {
    try {
      setLoading(true);
      const params = { page, limit };
      if (statusFilter) params.status = statusFilter;
      if (planFilter) params.plan = planFilter;

      const res = await adminApi.getSubscriptions(params);
      const raw = res.data;

      // Backend returns { success, data: [...], pagination: { total, page, limit } }
      let items = [];
      if (Array.isArray(raw?.data)) {
        items = raw.data;
      } else if (Array.isArray(raw)) {
        items = raw;
      } else if (raw?.data && !Array.isArray(raw.data) && Array.isArray(raw.data.subscriptions)) {
        items = raw.data.subscriptions;
      }

      setSubscriptions(items);
      setTotal(raw?.pagination?.total ?? items.length ?? 0);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, planFilter]);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  const getDaysRemaining = (endDate, status) => {
    if (status === 'cancelled') return null;
    if (!endDate) return null;
    const end = new Date(endDate);
    const now = new Date();
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const openReactivateModal = (sub) => {
    const defaultPlanId = sub.planId?._id || sub.planId || availablePlans[0]?._id || '';
    setForm({
      planId: defaultPlanId,
      duration: '30',
      customEndDate: '',
      status: 'active',
      note: '',
    });
    setReactivateModal({ open: true, sub });
  };

  const closeReactivateModal = () => {
    if (!submitting) {
      setReactivateModal({ open: false, sub: null });
    }
  };

  const handleReactivateSubmit = async (e) => {
    e.preventDefault();
    if (!reactivateModal.sub) return;

    if (form.duration === 'custom' && !form.customEndDate) {
      toast.error('Please specify a custom end date');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        planId: form.planId,
        status: form.status,
        note: form.note,
      };

      if (form.duration === 'custom') {
        payload.endDate = form.customEndDate;
      } else {
        payload.durationDays = Number(form.duration);
      }

      await adminApi.reactivateSubscription(reactivateModal.sub._id, payload);
      toast.success(
        `Subscription for ${reactivateModal.sub.businessId?.name || 'Business'} reactivated successfully!`
      );
      closeReactivateModal();
      fetchSubscriptions();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reactivate subscription');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickReactivate = async (sub) => {
    try {
      await adminApi.reactivateSubscription(sub._id, {
        durationDays: 30,
        status: 'active',
        note: 'Quick 30-day reactivation by Admin',
      });
      toast.success(
        `Reactivated 30 days for ${sub.businessId?.name || 'Business'}`
      );
      fetchSubscriptions();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Quick reactivation failed');
    }
  };

  const planOptions = [
    { value: '', label: 'All Plans' },
    ...availablePlans.map((p) => ({
      value: p.name.toLowerCase(),
      label: p.name,
    })),
  ];

  const modalPlanSelectOptions = availablePlans.map((p) => ({
    value: p._id,
    label: `${p.name} (${p.price > 0 ? `₹${p.price}/${p.interval || 'mo'}` : 'Free'})`,
  }));

  const columns = [
    {
      key: 'businessId',
      label: 'Business Name',
      render: (val) => (
        <span className="font-semibold text-gray-900">
          {val?.name || 'N/A'}
        </span>
      ),
    },
    {
      key: 'planId',
      label: 'Plan',
      render: (val) => (
        <Badge variant="info">{val?.name || 'N/A'}</Badge>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (val, row) => {
        const isExp =
          val === 'expired' ||
          (row.endDate && new Date(row.endDate) < new Date());
        const displayStatus = isExp && val !== 'active' ? 'Expired' : (val || 'Unknown');
        const variant = isExp && val !== 'active' ? 'danger' : (STATUS_VARIANT[val?.toLowerCase()] || 'gray');
        return (
          <Badge variant={variant}>
            {displayStatus}
          </Badge>
        );
      },
    },
    {
      key: 'startDate',
      label: 'Start Date',
      render: (val) => <span className="text-gray-600">{formatDate(val)}</span>,
    },
    {
      key: 'endDate',
      label: 'End Date',
      render: (val) => <span className="text-gray-600">{formatDate(val)}</span>,
    },
    {
      key: 'daysRemaining',
      label: 'Days Remaining',
      render: (val, row) => {
        const days = getDaysRemaining(row.endDate, row.status);
        if (days === null) return <span className="text-gray-400">—</span>;
        if (days < 0) return <Badge variant="danger">Expired</Badge>;
        if (days <= 7) return <Badge variant="danger">{days} days</Badge>;
        if (days <= 30) return <Badge variant="warning">{days} days</Badge>;
        return <Badge variant="success">{days} days</Badge>;
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => {
        const isExp =
          row.status === 'expired' ||
          (row.endDate && new Date(row.endDate) < new Date());
        return (
          <div className="flex items-center gap-1.5">
            <Button
              size="xs"
              variant={isExp ? 'primary' : 'secondary'}
              onClick={() => openReactivateModal(row)}
              className="flex items-center gap-1 font-medium whitespace-nowrap"
            >
              <HiOutlineArrowPath className="w-3.5 h-3.5" />
              {isExp ? 'Reactivate' : 'Extend / Edit'}
            </Button>
            {isExp && (
              <Button
                size="xs"
                variant="ghost"
                onClick={() => handleQuickReactivate(row)}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium whitespace-nowrap"
                title="Quick 30-day reactivation"
              >
                +30d
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  const hasFilters = statusFilter || planFilter;

  return (
    <div>
      <PageHeader
        title="Subscriptions"
        subtitle="Manage and reactivate business subscriptions"
      />

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          <div className="w-full sm:w-48">
            <FormSelect
              name="status"
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              options={statusOptions}
              placeholder="All Statuses"
            />
          </div>
          <div className="w-full sm:w-48">
            <FormSelect
              name="plan"
              value={planFilter}
              onChange={(e) => { setPlanFilter(e.target.value); setPage(1); }}
              options={planOptions}
              placeholder="All Plans"
            />
          </div>
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setStatusFilter(''); setPlanFilter(''); setPage(1); }}
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {loading ? (
        <LoadingSpinner type="table" />
      ) : subscriptions.length === 0 ? (
        <EmptyState
          title="No subscriptions found"
          description={
            hasFilters
              ? 'Try adjusting your filters to see more results.'
              : 'Subscription records will appear here.'
          }
        />
      ) : (
        <DataTable
          columns={columns}
          data={subscriptions}
          pagination={{
            page,
            limit,
            total,
            onPageChange: setPage,
          }}
        />
      )}

      {/* Reactivate / Manage Modal */}
      <Modal
        isOpen={reactivateModal.open}
        onClose={closeReactivateModal}
        title="Reactivate / Extend Subscription"
        size="md"
      >
        {reactivateModal.sub && (
          <form onSubmit={handleReactivateSubmit} className="space-y-4">
            {/* Business summary card */}
            <div className="p-3.5 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">
                    {reactivateModal.sub.businessId?.name || 'Business'}
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {reactivateModal.sub.businessId?.email || 'No email'}
                  </p>
                </div>
                <Badge
                  variant={
                    reactivateModal.sub.endDate && new Date(reactivateModal.sub.endDate) < new Date()
                      ? 'danger'
                      : (STATUS_VARIANT[reactivateModal.sub.status?.toLowerCase()] || 'gray')
                  }
                >
                  {reactivateModal.sub.endDate && new Date(reactivateModal.sub.endDate) < new Date()
                    ? 'Expired'
                    : reactivateModal.sub.status}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-gray-200/70 text-xs text-gray-600">
                <div>
                  <span className="text-gray-400">Current Plan:</span>{' '}
                  <span className="font-medium text-gray-800">{reactivateModal.sub.planId?.name || 'Free'}</span>
                </div>
                <div>
                  <span className="text-gray-400">Current Expiry:</span>{' '}
                  <span className="font-medium text-gray-800">{formatDate(reactivateModal.sub.endDate)}</span>
                </div>
              </div>
            </div>

            {/* Select Plan */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Assign Plan
              </label>
              <FormSelect
                name="planId"
                value={form.planId}
                onChange={(e) => setForm((prev) => ({ ...prev, planId: e.target.value }))}
                options={modalPlanSelectOptions}
                required
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Extension Duration
              </label>
              <FormSelect
                name="duration"
                value={form.duration}
                onChange={(e) => setForm((prev) => ({ ...prev, duration: e.target.value }))}
                options={durationOptions}
              />
            </div>

            {/* Custom End Date if selected */}
            {form.duration === 'custom' && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Custom Expiration Date
                </label>
                <FormInput
                  type="date"
                  name="customEndDate"
                  value={form.customEndDate}
                  onChange={(e) => setForm((prev) => ({ ...prev, customEndDate: e.target.value }))}
                  required
                />
              </div>
            )}

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Subscription Status
              </label>
              <FormSelect
                name="status"
                value={form.status}
                onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
                options={reactivateStatusOptions}
              />
            </div>

            {/* Note */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Admin Note (Optional)
              </label>
              <FormInput
                name="note"
                placeholder="Reason or reference for reactivation..."
                value={form.note}
                onChange={(e) => setForm((prev) => ({ ...prev, note: e.target.value }))}
              />
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
              <Button
                type="button"
                variant="secondary"
                onClick={closeReactivateModal}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={submitting}
                className="flex items-center gap-1.5"
              >
                <HiOutlineSparkles className="w-4 h-4" />
                Reactivate Plan
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}

export default Subscriptions;
