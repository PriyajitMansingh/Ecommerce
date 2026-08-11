import express from 'express'
import { getCountryCodes, getPincodeDetails } from '../controllers/utilController.js'

const router = express.Router()

router.get('/country-codes', getCountryCodes)
router.get('/pincode/:pincode', getPincodeDetails)

export default router