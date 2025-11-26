import express from 'express';
import { login, logout } from '../controllers/authController.js';
import route_authentication from '../middleware/route_auth.js';

const router = express.Router();

router.post('/login', login);

router.post('/logout', logout);


router.get('/me',route_authentication ,(req,res)=>{
    res.status(200).json( {success : true, user : req.user} )
}); 

export default router;