import type { Request, Response, NextFunction } from 'express';
import { RoadmapService } from './roadmap.service';
import type { AuthenticatedRequest } from '../../middleware/auth.middleware';
import type { ApiResponse } from '@akaytheory/shared';

export class RoadmapController {
  public static async getRoadmaps(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const roadmaps = await RoadmapService.getRoadmaps();
      const response: ApiResponse<typeof roadmaps> = {
        success: true,
        data: roadmaps,
        meta: { timestamp: new Date().toISOString() },
      };
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  public static async getRoadmap(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const rawSlug = req.params.slug;
      const slug = Array.isArray(rawSlug) ? rawSlug[0]! : rawSlug!;
      const userId = req.user?.id;
      const roadmap = await RoadmapService.getRoadmapBySlug(slug, userId);
      const response: ApiResponse<typeof roadmap> = {
        success: true,
        data: roadmap,
        meta: { timestamp: new Date().toISOString() },
      };
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }
}
