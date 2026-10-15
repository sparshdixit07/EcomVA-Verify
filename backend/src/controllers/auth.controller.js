import { asyncHandler } from '../utils/asyncHandler.js';
import { authService } from '../services/auth.service.js';

export const authController = {
  register: asyncHandler(async (req, res) => {
    const { user } = await authService.register(req.body);
    const token = (await authService.login({ email: req.body.email, password: req.body.password })).token;
    authService.issueCookie(res, token);
    res.status(201).json({ user });
  }),

  login: asyncHandler(async (req, res) => {
    const { user, token } = await authService.login(req.body);
    authService.issueCookie(res, token);
    res.json({ user });
  }),

  logout: asyncHandler(async (_req, res) => {
    authService.clearCookie(res);
    res.json({ ok: true });
  }),

  me: asyncHandler(async (req, res) => {
    const { user } = await authService.me(req.user._id);
    res.json({ user });
  }),

  forgotPassword: asyncHandler(async (req, res) => {
    const result = await authService.forgotPassword(req.body.email);
    res.json({ ok: true, sent: result.sent });
  }),

  resetPassword: asyncHandler(async (req, res) => {
    await authService.resetPassword(req.body);
    res.json({ ok: true });
  }),

  changePassword: asyncHandler(async (req, res) => {
    await authService.changePassword(req.user._id, req.body);
    res.json({ ok: true });
  })
};