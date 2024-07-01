import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { config } from 'dotenv';

config();

const jwtSecret = process.env.JWT_SECRET;

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Token bulunamadı.' });
    }

    try {
        const decoded = jwt.verify(token, jwtSecret) as { id: number };
        const user = await User.findByPk(decoded.id);

        if (!user) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Geçersiz token.', error });
    }
};

export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id;

    try {
        const user = await User.findByPk(userId);
        if (user && user.isAdmin) {
            next();
        } else {
            res.sendStatus(403);
        }
    } catch (error) {
        res.sendStatus(500);
    }
};