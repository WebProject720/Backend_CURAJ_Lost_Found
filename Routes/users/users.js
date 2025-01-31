import { Router } from 'express'
import { register } from '../../controllers/users/register.js';
import { verify } from '../../controllers/users/verify.js';


const UserRouter=Router();



UserRouter.route('/register').post(register);
UserRouter.route('/verify').post(verify);





export default UserRouter;

