import express from "express";
import {
  userLogin,
  userRegister,
} from "../../controller/auth/auth.Controller.js";
import { verifyJwtToken } from "../../middleware/verifyJwtToken.js";

const router = express.Router();

router.post("/signup", userRegister);
router.post("/signin", userLogin);
router.get("/check-auth", verifyJwtToken, (req, res) => {
  const user = req.user;

  res.status(200).json({
    message: "Profile fetched successfully",
    success: true,
    flag: 1,
    user: { _id: user.userId, username: user.username, email: user.email },
  });
});

export default router;
