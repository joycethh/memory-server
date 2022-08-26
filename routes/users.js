import express from "express";
import { signin, signup } from "../controllers/userController.js";
const router = express.Router();

//send the userdata
router.post("/signin", signin);

//save userdata
router.post("/signup", signup);

export default router;
