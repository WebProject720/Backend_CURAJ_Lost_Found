import { Router } from 'express'
import { register } from '../../controllers/users/register.js';
import { verify } from '../../controllers/users/verify.js';
import { login } from '../../controllers/users/login.js';
import { logout } from '../../controllers/users/logout.js';


const UserRouter=Router();



UserRouter.route('/register').post(register);
UserRouter.route('/verify').post(verify);
UserRouter.route('/login').post(login);
UserRouter.route('/logout').post(logout);





export default UserRouter;

