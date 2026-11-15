import { Router } from 'express';
import { SearchController } from './search.controller';

export const searchRouter = Router();

searchRouter.get('/', SearchController.search);

