import * as express from "express";
import * as user_controller from '../controllers/user';
import * as user_middleware from '../middlewares/user';

const user_router = express.Router();

user_router.post('/validate_email', user_middleware.validate_code_email_request, user_controller.send_code_to_register_controller);
user_router.post('/register', user_middleware.validate_register_user_request, user_middleware.validate_code_to_register, user_controller.register_controller);
user_router.post('/refresh_token', user_middleware.validate_refresh_token_request, user_controller.refresh_token_controller);
user_router.post('/login', user_middleware.validate_login_request, user_controller.user_login_controller);
user_router.get('/google_login_url', user_controller.google_login_url_controller);
user_router.get('/google_login_callback', user_controller.google_login_callback_controller);


export {
    user_router
};

