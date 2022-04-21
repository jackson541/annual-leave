import * as express from "express";
import { register_controller } from '../controllers/user';
import { validate_register_user_request } from '../middlewares/user';

const user_router = express.Router();

user_router.post('/register', validate_register_user_request, register_controller);


export {
    user_router
};

