import { Router } from 'express'
import { Add } from '../../controllers/reports/add.js';
import { authenticateUser } from '../../middleware/authenticateUser.js';
import { get } from '../../controllers/reports/get.js';


const ReportsRouter = Router();


//server/reports/add
ReportsRouter.route('/add').post(authenticateUser, Add);
ReportsRouter.route('/getall').get(authenticateUser, get);





export default ReportsRouter;

