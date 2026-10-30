const Business = require('../models/Business');
const { errorResponse } = require('../utils/response');

// Write methods that should be blocked for expired/suspended subscriptions
const WRITE_METHODS = ['POST', 'PUT', 'DELETE', 'PATCH'];

const setTenant = async (req, res, next) => {
  try {
    if (!req.user) {
      return errorResponse(res, 'Authentication required.', 401, 'NOT_AUTHENTICATED');
    }
    // Super admins bypass all tenant checks
    if (req.user.role === 'super_admin') {
      req.businessId = req.user.businessId || null;
      return next();
    }
    if (!req.user.businessId) {
      return errorResponse(res, 'User is not associated with any business.', 403, 'NO_BUSINESS');
    }
    req.businessId = req.user.businessId;

    // Check if the route is for subscription operations (users must be able to view, pay, reactivate, and upgrade plans!)
    const isSubscriptionPath =
      (req.baseUrl && req.baseUrl.includes('subscription')) ||
      (req.originalUrl && req.originalUrl.includes('/subscription')) ||
      (req.path && req.path.includes('subscription'));

    // --- Trial expiration enforcement ---
    const business = await Business.findById(req.user.businessId).select('subscriptionStatus trialEndDate status').lean();
    if (business) {
      // Auto-expire trials that have passed their end date
      if (business.subscriptionStatus === 'trial' && business.trialEndDate && new Date(business.trialEndDate) < new Date()) {
        await Business.findByIdAndUpdate(req.user.businessId, { subscriptionStatus: 'expired' });
        business.subscriptionStatus = 'expired';
      }

      // Block write operations for expired or suspended subscriptions (except subscription/payment routes)
      if ((business.subscriptionStatus === 'expired' || business.subscriptionStatus === 'suspended') && !isSubscriptionPath) {
        if (WRITE_METHODS.includes(req.method)) {
          const message = business.subscriptionStatus === 'expired'
            ? 'Your trial has expired. Please upgrade your plan to continue using write features.'
            : 'Your business account is currently suspended. Please contact support.';
          return errorResponse(res, message, 403, 'SUBSCRIPTION_INACTIVE');
        }
        // Allow read-only (GET) requests to pass through
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { setTenant };
