import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User';
import { config } from 'dotenv';

config();

const jwtSecret = process.env.JWT_SECRET;

export const register = async (req: Request, res: Response) => {
    const { username, email, password, isAdmin } = req.body;

    try {
        if (!username || !email || !password) {
            return res.status(401).json({ message: "E-posta, kullanıcı adı ya da şifre eksik." });
        }

        const isMailFound = await User.findOne({
            where: {
                email: email,
            }
        })

        const isUsernameFound = await User.findOne({
            where: {
                username: username,
            }
        })

        if (isMailFound || isUsernameFound) {
            return res.status(401).json({ message: "Kullancı adı veya e-posta sistemde kayıtlıdır." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        console.log(hashedPassword.length);

        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            isAdmin,
        });
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: 'Kullanıcı oluşturulamadı.', error: error.message });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(401).json({ message: "E-posta veya şifre eksik." });
        }

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ message: 'Geçersiz e-posta veya şifre.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Geçersiz e-posta veya şifre.' });
        }

        const token = jwt.sign({ id: user.id, isAdmin: user.isAdmin }, jwtSecret, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Giriş yapılamadı.', error: error.message });
    }
};

export const getMe = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Kullanıcı bilgileri alınamadı.', error });
    }
};