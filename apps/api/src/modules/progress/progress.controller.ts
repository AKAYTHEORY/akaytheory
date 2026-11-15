import type { Response, NextFunction } from 'express';
import { ProgressService } from './progress.service';
import { quizSubmissionSchema, problemSubmissionSchema } from '@akaytheory/shared';
import type { AuthenticatedRequest } from '../../middleware/auth.middleware';
import type { ApiResponse } from '@akaytheory/shared';

export class ProgressController {
  public static async submitQuiz(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = quizSubmissionSchema.parse(req.body);
      const result = await ProgressService.submitQuiz(req.user!.id, validated);

      const response: ApiResponse<typeof result> = {
        success: true,
        data: result,
        meta: { timestamp: new Date().toISOString() },
      };
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  public static async submitProblem(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = problemSubmissionSchema.parse(req.body);
      const submission = await ProgressService.submitProblem(req.user!.id, validated);

      const response: ApiResponse<typeof submission> = {
        success: true,
        data: submission,
        meta: { timestamp: new Date().toISOString() },
      };
      res.status(201).json(response);
    } catch (err) {
      next(err);
    }
  }

  public static async getDueRevisions(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const revisions = await ProgressService.getDueRevisions(req.user!.id);
      const response: ApiResponse<typeof revisions> = {
        success: true,
        data: revisions,
        meta: { timestamp: new Date().toISOString() },
      };
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  public static async getProgressSummary(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const summary = await ProgressService.getProgressSummary(req.user!.id);
      const response: ApiResponse<typeof summary> = {
        success: true,
        data: summary,
        meta: { timestamp: new Date().toISOString() },
      };
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }
}
