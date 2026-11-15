import type { Request, Response, NextFunction } from 'express';
import { CurriculumService } from './curriculum.service';
import type { AuthenticatedRequest } from '../../middleware/auth.middleware';
import type { ApiResponse } from '@akaytheory/shared';

export class CurriculumController {
  public static async getDomains(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const domains = await CurriculumService.getDomains();
      const response: ApiResponse<typeof domains> = {
        success: true,
        data: domains,
        meta: { timestamp: new Date().toISOString() },
      };
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  public static async getTopicBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = Array.isArray(req.params.slug) ? req.params.slug[0]! : req.params.slug!;
      const topic = await CurriculumService.getTopicBySlug(slug);
      const response: ApiResponse<typeof topic> = {
        success: true,
        data: topic,
        meta: { timestamp: new Date().toISOString() },
      };
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  public static async getLessonBySlug(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const isStaff =
        req.user?.role === 'CONTENT_AUTHOR' ||
        req.user?.role === 'CONTENT_REVIEWER' ||
        req.user?.role === 'CONTENT_PUBLISHER' ||
        req.user?.role === 'CONTENT_ADMINISTRATOR' ||
        req.user?.role === 'SYSTEM_ADMINISTRATOR';

      const slug = Array.isArray(req.params.slug) ? req.params.slug[0]! : req.params.slug!;
      const lesson = await CurriculumService.getLessonBySlug(slug, isStaff);
      const response: ApiResponse<typeof lesson> = {
        success: true,
        data: lesson,
        meta: { timestamp: new Date().toISOString() },
      };
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  public static async getProblems(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const difficulty = req.query.difficulty as string | undefined;
      const problems = await CurriculumService.getProblems(difficulty);
      const response: ApiResponse<typeof problems> = {
        success: true,
        data: problems,
        meta: { timestamp: new Date().toISOString() },
      };
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  public static async getProblemBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = Array.isArray(req.params.slug) ? req.params.slug[0]! : req.params.slug!;
      const problem = await CurriculumService.getProblemBySlug(slug);
      const response: ApiResponse<typeof problem> = {
        success: true,
        data: problem,
        meta: { timestamp: new Date().toISOString() },
      };
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }
}
