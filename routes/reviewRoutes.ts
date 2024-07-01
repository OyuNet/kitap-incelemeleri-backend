import { Router } from "express";
import { addReview, deleteReview, getReviews, getReviewsByBookId } from "../controllers/reviewController";
import { authenticateToken, requireAdmin } from "../middleware/authMiddleware";

const router = Router();

router.post("/add", authenticateToken, requireAdmin, addReview);
router.delete("/delete", authenticateToken, requireAdmin, deleteReview);
router.get("/getAll", getReviews);
router.get("/get/:id", getReviewsByBookId);

export default router;