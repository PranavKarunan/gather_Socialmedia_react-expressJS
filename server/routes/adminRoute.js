import express from 'express';
import { AdminLogin } from '../controllers/adminControllers.js';
const router = express.Router();

router.post('/login' ,AdminLogin)







export default router;