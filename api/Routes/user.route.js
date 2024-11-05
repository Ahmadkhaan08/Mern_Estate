import express from 'express'
import { DeleteUser, test,UpdateUser } from '../controller/user.controller.js'
import { VerifyUser } from '../utilis/VerifyUser.js'

const router=express.Router()

router.get('/test',test)
router.post('/update/:id',VerifyUser,UpdateUser)
router.delete('/delete/:id',VerifyUser,DeleteUser)
export default router