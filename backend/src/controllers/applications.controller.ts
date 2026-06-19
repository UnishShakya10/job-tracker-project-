import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import * as repo from '../db/applications.repository';
import { ApplicationStatus, ListQuery } from '../types';

export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const query: ListQuery = {
      status: req.query.status as ApplicationStatus | undefined,
      search: req.query.search as string | undefined,
      page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 20,
    };
    const result = await repo.findAll(query);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getOne(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const app = await repo.findById(String(req.params.id));
    if (!app) {
      res.status(404).json({ message: 'Application not found' });
      return;
    }
    res.json(app);
  } catch (err) {
    next(err);
  }
}

export async function createOne(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ message: 'Validation failed', errors: errors.mapped() });
      return;
    }
    const app = await repo.create(req.body);
    res.status(201).json(app);
  } catch (err) {
    next(err);
  }
}

export async function updateOne(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ message: 'Validation failed', errors: errors.mapped() });
      return;
    }
    const app = await repo.update(String(req.params.id), req.body);
    if (!app) {
      res.status(404).json({ message: 'Application not found' });
      return;
    }
    res.json(app);
  } catch (err) {
    next(err);
  }
}

export async function deleteOne(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const deleted = await repo.remove(String(req.params.id));
    if (!deleted) {
      res.status(404).json({ message: 'Application not found' });
      return;
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
