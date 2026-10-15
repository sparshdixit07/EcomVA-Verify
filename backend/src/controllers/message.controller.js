import { asyncHandler } from '../utils/asyncHandler.js';
import { messageService } from '../services/message.service.js';

export const messageController = {
  listConversations: asyncHandler(async (req, res) => {
    const result = await messageService.listConversations(req.user);
    res.json(result);
  }),

  startConversation: asyncHandler(async (req, res) => {
    const result = await messageService.startConversation(req.user, req.body);
    res.status(201).json(result);
  }),

  getConversation: asyncHandler(async (req, res) => {
    const result = await messageService.getConversation(req.user, req.params.id);
    res.json(result);
  }),

  listMessages: asyncHandler(async (req, res) => {
    const result = await messageService.listMessages(req.user, req.params.id, req.query);
    res.json(result);
  }),

  send: asyncHandler(async (req, res) => {
    const result = await messageService.send(req.user, req.params.id, req.body);
    res.status(201).json(result);
  }),

  markRead: asyncHandler(async (req, res) => {
    const result = await messageService.markRead(req.user, req.params.id);
    res.json(result);
  })
};