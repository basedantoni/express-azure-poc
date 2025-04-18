import express, { Request, Response } from 'express';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const router = express.Router();

// Get all requests
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await prisma.request.findMany();
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching requests', error: err });
  }
});

// Get request by ID
router.get<{ id: string }>(
  '/:id',
  async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await prisma.request.findUnique({
        where: { id: parseInt(id) },
      });
      if (!result) {
        res.status(404).json({ message: 'Request not found' });
        return;
      }
      res.json(result);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching request', error: err });
    }
  }
);

// Create request
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, title, description, status } = req.body;
    const result = await prisma.request.create({
      data: {
        users: {
          connect: {
            id: parseInt(userId),
          },
        },
        title,
        description,
        status: status || 'pending',
      },
    });
    res.status(201).json(result);
  } catch (err) {
    console.error('Error creating request:', err);
    res.status(500).json({ message: 'Error creating request', error: err });
  }
});

// Update request
router.put<{ id: string }>(
  '/:id',
  async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { userId, title, description, status } = req.body;
      const result = await prisma.request.update({
        where: { id: parseInt(id) },
        data: {
          users: {
            connect: {
              id: parseInt(userId),
            },
          },
          title,
          description,
          status: status || 'pending',
        },
      });
      if (!result) {
        res.status(404).json({ message: 'Request not found' });
        return;
      }
      res.json(result);
    } catch (err) {
      console.error('Error updating request:', err);
      res.status(500).json({ message: 'Error updating request', error: err });
    }
  }
);

// Delete request
router.delete<{ id: string }>(
  '/:id',
  async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await prisma.request.delete({
        where: { id: parseInt(id) },
      });
      if (!result) {
        res.status(404).json({ message: 'Request not found' });
        return;
      }
      res.json({ message: 'Request deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Error deleting request', error: err });
    }
  }
);

export default router;
