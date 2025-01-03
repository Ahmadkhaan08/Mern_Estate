import express from 'express'
import { Google, SignIn, SignOut, signup } from '../controller/auth.controller.js'

const router=express.Router()

router.post('/signup',signup)
router.post('/signin',SignIn)
router.post('/google',Google)
router.get('/signout',SignOut)

export default router