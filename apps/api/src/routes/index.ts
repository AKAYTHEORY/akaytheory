import { Router } from 'express';
import { healthRouter } from './health.route';
import { authRouter } from '../modules/auth/auth.routes';
import { curriculumRouter } from '../modules/curriculum/curriculum.routes';
import { progressRouter } from '../modules/progress/progress.routes';
import { roadmapRouter } from '../modules/roadmaps/roadmap.routes';
import { searchRouter } from '../modules/search/search.routes';

export const apiRouter = Router();

apiRouter.use('/health', healthRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use('/curriculum', curriculumRouter);
apiRouter.use('/progress', progressRouter);
apiRouter.use('/roadmaps', roadmapRouter);
apiRouter.use('/search', searchRouter);
