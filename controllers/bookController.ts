import type { Request, Response } from 'express';
import Book from '../models/Book';

export const addBook = async (req: Request, res: Response) => {
    const { title, author, summary, imageUrl } = req.body;

    try {
        const newBook = await Book.create({ title, author, summary, imageUrl });
        res.status(201).json(newBook);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Kitap eklenemedi.', error });
    }
};

export const deleteBook = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const book = await Book.findByPk(id);
        if (!book) {
            return res.status(404).json({ message: 'Kitap bulunamadı.' });
        }

        await book.destroy();
        res.status(200).json({ message: 'Kitap silindi.' });
    } catch (error) {
        res.status(500).json({ message: 'Kitap silinemedi.', error });
    }
};

export const getBooks = async (req: Request, res: Response) => {
    try {
        const books = await Book.findAll();
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: 'Kitaplar alınamadı.', error });
    }
};

export const getBookById = async (req: Request, res: Response) => {
    const reqId = req.params.id;

    try {
        
        const book = await Book.findOne({
            where: {
                id: reqId
            }
        });

        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ message: "Kitap bulunamadı.", error });
    }
}