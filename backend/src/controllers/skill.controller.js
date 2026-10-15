import { asyncHandler } from '../utils/asyncHandler.js';
import { Skill } from '../models/Skill.js';
import { ApiError } from '../utils/ApiError.js';

export const skillController = {
  list: asyncHandler(async (req, res) => {
    const filter = { active: true };
    if (req.query.category) filter.category = req.query.category;
    const items = await Skill.find(filter).sort('name');
    res.json({ items });
  }),

  getById: asyncHandler(async (req, res) => {
    const skill = await Skill.findById(req.params.id);
    if (!skill) throw ApiError.notFound('Skill not found');
    res.json({ skill });
  })
};