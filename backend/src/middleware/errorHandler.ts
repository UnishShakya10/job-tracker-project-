import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error(err);

  // PostgreSQL unique violation
  if ((err as NodeJS.ErrnoException).code === '23505') {
    res.status(409).json({ message: 'Duplicate entry' });
    return;
  }

  // PostgreSQL invalid enum
  if ((err as NodeJS.ErrnoException).code === '22P02') {
    res.status(400).json({ message: 'Invalid value provided' });
    return;
  }

  res.status(500).json({ message: 'Internal server error' });
}

export function notFound(_req: Request, res: Response): void {
  res.status(404).json({ message: 'Route not found' });
}
