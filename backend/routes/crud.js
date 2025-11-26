import route_authentication  from "../middleware/route_auth.js";
import express from "express";
import { updateItems , addItem,newUpdateList,otherUser,newScore} from "../controllers/crudController.js";


const router = express.Router();

router.use(route_authentication );

router.post('/addNewItem',addItem);

router.put('/updateItems',updateItems);

router.delete('/newUpdateList',newUpdateList);

router.patch('/updateScore',newScore);

router.get('/otherUser',otherUser);


export default router;