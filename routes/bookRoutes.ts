import { Router } from "express";
import { addBook, deleteBook, getBooks, getBookById } from "../controllers/bookController";
import { authenticateToken, requireAdmin } from "../middleware/authMiddleware";

const router = Router();

router.post("/add", authenticateToken, requireAdmin, addBook);
router.delete("/delete/:id", authenticateToken, requireAdmin, deleteBook);
router.get("/getAll", getBooks);
router.get("/get/:id", getBookById);

export default router;