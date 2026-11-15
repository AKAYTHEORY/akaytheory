import { Router } from 'express';
import { ProgressController } from './progress.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

export const progressRouter = Router();

progressRouter.post('/quiz', authMiddleware, ProgressController.submitQuiz);
progressRouter.post('/problem', authMiddleware, ProgressController.submitProblem);
progressRouter.get('/revisions/due', authMiddleware, ProgressController.getDueRevisions);
progressRouter.get('/summary', authMiddleware, ProgressController.getProgressSummary);
