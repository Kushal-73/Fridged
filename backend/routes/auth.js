import express from 'express';
const router = express.Router();
import { login, logout } from '../controllers/authController.js';
import route_authentication from '../middleware/route_auth.js';


router.post('/login', login);

router.post('/logout', logout);


router.get('/me',route_authentication ,(req,res)=>{
    res.status(200).json( {success : true, user : req.user} )
}); 

export default router;