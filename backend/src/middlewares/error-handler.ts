import { Context } from 'hono';
import fs from 'fs';
import path from 'path';

const LOG_FILE = path.join(process.cwd(), '.cursor', 'debug.log');
const log = (data: any) => {
  try {
    const dir = path.dirname(LOG_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.appendFileSync(LOG_FILE, JSON.stringify(data) + '\n');
  } catch {}
};

export const errorHandler = (error: Error, c: Context) => {
  console.error('Error:', error);
  // #region agent log
  log({location:'backend/src/middlewares/error-handler.ts:11',message:'Error handler invoked',data:{errorName:error?.name,errorMessage:error?.message,errorCode:(error as any)?.code,path:c.req.path,method:c.req.method,hasStack:!!error?.stack},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'});
  // #endregion

  // Erori de validare
  if (error.name === 'ZodError') {
    return c.json(
      {
        error: 'Validation error',
        details: error.message,
      },
      400
    );
  }

  // Erori de bază de date
  if (error.message.includes('duplicate key') || error.message.includes('unique constraint')) {
    return c.json(
      {
        error: 'Duplicate entry',
        message: 'This record already exists',
      },
      409
    );
  }

  // Erori default
  return c.json(
    {
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
    },
    500
  );
};