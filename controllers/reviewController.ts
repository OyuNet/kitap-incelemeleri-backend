import type { Request, Response } from 'express';
import Review from '../models/Review';
import Book from '../models/Book';

export const addReview = async (req: Request, res: Response) => {
    const { content, rating, bookId, userId } = req.body;

    if (!content || !rating || !bookId || !userId) {
        return res.status(401).json({ message: "İçerik, puanlama, kitap ID'si ya da kullanıcı ID'si eksik." });
    }

    try {
        const newReview = await Review.create({ content, rating, bookId, userId });
        res.status(201).json(newReview);
    } catch (error) {
        res.status(500).json({ message: 'İnceleme eklenemedi.', error });
    }
};

export const deleteReview = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
        return res.status(401).json({ message: "ID eksik." });
    }

    try {
        const review = await Review.findByPk(id);
        if (!review) {
            return res.status(404).json({ message: 'İnceleme bulunamadı.' });
        }

        await review.destroy();
        res.status(200).json({ message: 'İnceleme silindi.' });
    } catch (error) {
        res.status(500).json({ message: 'İnceleme silinemedi.', error });
    }
};

export const getReviews = async (req: Request, res: Response) => {
    try {
        const reviews = await Review.findAll({
            include: [
                {
                    model: Book,
                    attributes: ['title']
                }
            ]
        });
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'İncelemeler alınamadı.', error });
    }
};

export const getReviewsByBookId = async (req: Request, res: Response) => {
    const id = req.params.id

    try {
        const reviews = await Review.findAll({
            where: {
                bookId: id,
            }
        })
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: "İncelemeler alınamadı.", error });
    }
}