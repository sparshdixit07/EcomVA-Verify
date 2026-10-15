import { asyncHandler } from '../utils/asyncHandler.js';
import { adminService } from '../services/admin.service.js';

export const adminController = {
  dashboard: asyncHandler(async (_req, res) => {
    const result = await adminService.dashboard();
    res.json(result);
  }),

  stats: asyncHandler(async (_req, res) => {
    const result = await adminService.stats();
    res.json(result);
  }),

  listUsers: asyncHandler(async (req, res) => {
    const result = await adminService.listUsers(req.query);
    res.json(result);
  }),

  getUser: asyncHandler(async (req, res) => {
    const result = await adminService.getUser(req.params.id);
    res.json(result);
  }),

  suspendUser: asyncHandler(async (req, res) => {
    const result = await adminService.suspend(req.user, req.params.id, req.body.reason);
    res.json(result);
  }),

  activateUser: asyncHandler(async (req, res) => {
    const result = await adminService.activate(req.user, req.params.id);
    res.json(result);
  }),

  listAuditLogs: asyncHandler(async (req, res) => {
    const result = await adminService.listAuditLogs(req.query);
    res.json(result);
  })
};