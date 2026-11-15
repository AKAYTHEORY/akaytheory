import { Router } from 'express';
import { RoadmapController } from './roadmap.controller';
import { optionalAuthMiddleware } from '../../middleware/auth.middleware';

export const roadmapRouter = Router();

roadmapRouter.get('/', optionalAuthMiddleware, RoadmapController.getRoadmaps);
roadmapRouter.get('/:slug', optionalAuthMiddleware, RoadmapController.getRoadmap);

