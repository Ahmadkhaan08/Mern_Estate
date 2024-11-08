import express from 'express'
import { createlisting } from '../controller/listing.controller.js'
import {VerifyUser} from '../utilis/VerifyUser.js'

const router=express.Router()

router.get('/create',VerifyUser,createlisting)

export default router