import { Router } from 'express'
import { Add } from '../../controllers/reports/add.js';
import { authenticateUser } from '../../middleware/authenticateUser.js';
import { get } from '../../controllers/reports/get.js';
import { ChgStatus } from '../../controllers/reports/statuschange.js';
import { stats } from '../../controllers/reports/stats.js';
import { reply } from '../../controllers/reports/reply.js';


const ReportsRouter = Router();


//server/reports/add
ReportsRouter.route('/add').post(authenticateUser, Add);
ReportsRouter.route('/getall').get(authenticateUser, get);
ReportsRouter.route('/changeStatus').post(authenticateUser, ChgStatus);
ReportsRouter.route('/stats').get(authenticateUser, stats);
ReportsRouter.route('/reply').post(authenticateUser, reply);




export default ReportsRouter;

