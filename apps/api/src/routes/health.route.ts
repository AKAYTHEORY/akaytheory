import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import type { ApiResponse } from '@akaytheory/shared';

export const healthRouter = Router();

healthRouter.get('/', async (_req: Request, res: Response) => {
  let dbStatus = 'CONNECTED';
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch {
    dbStatus = 'DISCONNECTED';
  }

  const payload: ApiResponse<{
    status: 'HEALTHY' | 'DEGRADED';
    uptimeSeconds: number;
    database: string;
    version: string;
  }> = {
    success: true,
    data: {
      status: dbStatus === 'CONNECTED' ? 'HEALTHY' : 'DEGRADED',
      uptimeSeconds: Math.floor(process.uptime()),
      database: dbStatus,
      version: '1.0.0',
    },
    meta: {
      timestamp: new Date().toISOString(),
    },
  };

  res.status(dbStatus === 'CONNECTED' ? 200 : 503).json(payload);
});

