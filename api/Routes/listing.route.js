import express from 'express'
import { createlisting } from '../controller/listing.controller.js'
import {VerifyUser} from '../utilis/VerifyUser.js'
import upload from '../utilis/uploadMiddleware.js'
const router=express.Router()

router.get('/create',VerifyUser,upload.single('file'),createlisting)

export default router