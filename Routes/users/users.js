import { Router } from 'express'
import { register } from '../../controllers/users/register.js';
import { verify } from '../../controllers/users/verify.js';
import { login } from '../../controllers/users/login.js';
import { logout } from '../../controllers/users/logout.js';
import { getUser } from '../../controllers/users/getUser.js';
import { isUserLogged } from '../../controllers/users/islogged.js';
import { user } from '../../controllers/reports/user.js';
import { authenticateUser } from '../../middleware/authenticateUser.js';


const UserRouter=Router();



UserRouter.route('/register').post(register);
UserRouter.route('/verify').post(verify);
UserRouter.route('/login').post(login);
UserRouter.route('/logout').post(logout);
UserRouter.route('/getuser').post(getUser);
UserRouter.route('/isuserlogged').post(isUserLogged);
UserRouter.route('/user').get(authenticateUser,user);





export default UserRouter;

