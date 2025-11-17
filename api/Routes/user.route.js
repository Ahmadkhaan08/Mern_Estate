import express from "express"
import { deleteUser, updateUser } from "../controllers/user.controller.js"
import { verifyToken } from "../utilis/verifyUser.js"

const router=express.Router()

router.post("/update/:id",verifyToken,updateUser)
router.delete("/delete/:id",verifyToken,deleteUser)
export default router