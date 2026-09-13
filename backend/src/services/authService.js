const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const Business = require('../models/Business');
const Role = require('../models/Role');
const Subscription = require('../models/Subscription');
const Plan = require('../models/Plan');
const config = require('../config');
const { ALL_PERMISSIONS } = require('../utils/constants');

class AuthError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

const getUserPermissions = async (user) => {
  if (user.role === 'super_admin' || user.role === 'owner') {
    return ALL_PERMISSIONS;
  }
  const userRole = await Role.findOne({ businessId: user.businessId, name: user.role });
  return userRole ? userRole.permissions : [];
};

const generateTokens = (user) => {
  const payload = { id: user._id, email: user.email, role: user.role, businessId: user.businessId };
  const accessToken = jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
  const refreshToken = jwt.sign({ id: user._id }, config.jwt.refreshSecret, { expiresIn: config.jwt.refreshExpiresIn });
  return { accessToken, refreshToken };
};

// ─── register (FIXED — accepts all fields, saves them to Business) ──────
const register = async ({
  name, email, phone, password,
  businessName, businessType,
  address, city, state, pincode,
  enableTax, taxRate, invoicePrefix,
}) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new AuthError('Email already registered', 409);

  const session = await User.startSession();
  session.startTransaction();
  try {
    const freePlan = await Plan.findOne({ name: 'Free' });

    const business = new Business({
      name: businessName,
      type: businessType || 'retail',
      address: address || '',
      city: city || '',
      state: state || '',
      pincode: pincode || '',
      taxEnabled: enableTax ?? true,
      taxRate: Number(taxRate) || 0,
      invoicePrefix: invoicePrefix || 'INV',
      subscriptionStatus: 'trial',
      trialStartDate: new Date(),
      trialEndDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      planId: freePlan?._id,
      usage: { productsUsed: 0, usersUsed: 1, branchesUsed: 1 },
      createdBy: null,
    });
    await business.save({ session });

    const user = new User({ name, email, phone, password, role: 'owner', businessId: business._id });
    await user.save({ session });
    business.createdBy = user._id;
    await business.save({ session });

    // ── Role + Subscription block (restored — was missing) ───────
    const ownerRole = new Role({
      name: 'owner',
      description: 'Business owner with full access',
      permissions: ALL_PERMISSIONS,
      isDefault: true,
      businessId: business._id,
    });
    await ownerRole.save({ session });

    const managerRole = new Role({
      name: 'manager',
      description: 'Manager with limited access',
      permissions: ALL_PERMISSIONS.filter((p) => !p.includes('delete') && p !== 'roles.create' && p !== 'roles.delete'),
      isDefault: false,
      businessId: business._id,
    });
    await managerRole.save({ session });

    const staffRole = new Role({
      name: 'staff',
      description: 'Staff with basic access',
      permissions: ALL_PERMISSIONS.filter(
        (p) =>
          p.includes('.view') || p === 'sales.create' || p === 'customers.create' || p === 'products.create'
      ),
      isDefault: true,
      businessId: business._id,
    });
    await staffRole.save({ session });

    if (freePlan) {
      const subscription = new Subscription({
        businessId: business._id,
        planId: freePlan._id,
        status: 'trial',
        startDate: new Date(),
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        trialStartDate: new Date(),
        trialEndDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      });
      await subscription.save({ session });
    }
    // ── end Role + Subscription block ─────────────────────────────

    await session.commitTransaction();
    session.endSession();

    const tokens = generateTokens(user);
    const permissions = await getUserPermissions(user);
    return { user: user.toJSON(), business: business.toJSON(), tokens, permissions };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// ─── login (restored) ────────────────────────────────────────────────────
const login = async ({ email, password, ipAddress, userAgent }) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) throw new AuthError('Invalid email or password', 401);
  if (user.status === 'suspended') throw new AuthError('Account suspended. Contact support.', 403);
  if (user.status === 'inactive') throw new AuthError('Account is inactive.', 403);

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new AuthError('Invalid email or password', 401);

  user.lastLogin = new Date();
  await user.save();

  const AuditLog = require('../models/AuditLog');
  await AuditLog.create({
    userId: user._id,
    businessId: user.businessId,
    action: 'login',
    resource: 'auth',
    ipAddress,
    userAgent,
  });

  const tokens = generateTokens(user);
  const permissions = await getUserPermissions(user);
  // Also return the business so the frontend can store it alongside the user
  const business = await Business.findById(user.businessId);
  return { user: user.toJSON(), business: business ? business.toJSON() : null, tokens, permissions };
};

// ─── refreshToken (restored) ─────────────────────────────────────────────
const refreshToken = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new AuthError('Invalid refresh token', 401);
  if (user.status !== 'active') throw new AuthError('Account is not active', 403);
  return generateTokens(user);
};

// ─── forgotPassword (restored) ───────────────────────────────────────────
const forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new AuthError('No account found with this email', 404);

  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordToken = resetTokenHash;
  user.resetPasswordExpires = new Date(Date.now() + 3600000);
  await user.save();
  return { message: 'Password reset link sent to your email', token: resetToken };
};

// ─── resetPassword (restored) ────────────────────────────────────────────
const resetPassword = async (token, newPassword) => {
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    resetPasswordToken: tokenHash,
    resetPasswordExpires: { $gt: new Date() },
  });
  if (!user) throw new AuthError('Invalid or expired reset token', 400);
  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  return { message: 'Password reset successfully' };
};

// ─── changePassword (restored) ───────────────────────────────────────────
const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select('+password');
  if (!user) throw new AuthError('User not found', 404);
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) throw new AuthError('Current password is incorrect', 400);
  user.password = newPassword;
  await user.save();
  return { message: 'Password changed successfully' };
};

// ─── getProfile (FIXED — now populates businessId) ──────────────────────
const getProfile = async (userId) => {
  const user = await User.findById(userId).populate('businessId');
  if (!user) throw new AuthError('User not found', 404);
  const permissions = await getUserPermissions(user);
  return { ...user.toJSON(), permissions };
};

// ─── updateProfile (FIXED — updates both User and Business) ──────────────
const updateProfile = async (userId, updateData) => {
  const userFields = ['name', 'phone'];
  const businessFieldMap = {
    businessName: 'name',
    businessType: 'type',
    address: 'address',
    city: 'city',
    state: 'state',
    pincode: 'pincode',
    enableTax: 'taxEnabled',
    taxRate: 'taxRate',
    invoicePrefix: 'invoicePrefix',
  };

  const userUpdate = {};
  const businessUpdate = {};
  for (const key of Object.keys(updateData)) {
    if (userFields.includes(key)) {
      userUpdate[key] = updateData[key];
    } else if (key in businessFieldMap) {
      const mapped = businessFieldMap[key];
      businessUpdate[mapped] = key === 'taxRate' ? Number(updateData[key]) : updateData[key];
    }
  }

  const user = await User.findByIdAndUpdate(userId, userUpdate, { new: true, runValidators: true });
  if (!user) throw new AuthError('User not found', 404);

  if (Object.keys(businessUpdate).length > 0 && user.businessId) {
    await Business.findByIdAndUpdate(user.businessId, businessUpdate, { new: true, runValidators: true });
  }

  const populated = await User.findById(userId).populate('businessId');
  return populated.toJSON();
};

module.exports = {
  register,
  login,
  refreshToken,
  forgotPassword,
  resetPassword,
  changePassword,
  getProfile,
  updateProfile,
};
