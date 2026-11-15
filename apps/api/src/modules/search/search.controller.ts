import type { Request, Response, NextFunction } from 'express';
import { SearchService } from './search.service';
import type { ApiResponse } from '@akaytheory/shared';

export class SearchController {
  public static async search(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const q = typeof req.query.q === 'string' ? req.query.q : '';
      const results = await SearchService.searchAll(q);

      const response: ApiResponse<typeof results> = {
        success: true,
        data: results,
        meta: { timestamp: new Date().toISOString() },
      };
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }
}

