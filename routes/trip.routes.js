import express from "express";
import { bookTrip, getAllTrips, getUserTrips } from "../controllers/tripController.js";

const router = express.Router();

router.post("/book", bookTrip);
router.get("/", getAllTrips);
router.get("/:userId", getUserTrips);

export default router;
