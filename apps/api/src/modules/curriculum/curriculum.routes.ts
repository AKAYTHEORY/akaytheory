import { Router } from 'express';
import { CurriculumController } from './curriculum.controller';
import { optionalAuthMiddleware } from '../../middleware/auth.middleware';

export const curriculumRouter = Router();

curriculumRouter.get('/domains', CurriculumController.getDomains);
curriculumRouter.get('/topics/:slug', CurriculumController.getTopicBySlug);
curriculumRouter.get('/lessons/:slug', optionalAuthMiddleware, CurriculumController.getLessonBySlug);
curriculumRouter.get('/problems', CurriculumController.getProblems);
curriculumRouter.get('/problems/:slug', CurriculumController.getProblemBySlug);

