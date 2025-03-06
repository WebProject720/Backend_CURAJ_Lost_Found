import { Router } from 'express'
import { Add } from '../../controllers/reports/add.js';
import { authenticateUser } from '../../middleware/authenticateUser.js';
import { getall } from '../../controllers/reports/getall.js';
import { ChgStatus } from '../../controllers/reports/statuschange.js';
import { stats } from '../../controllers/reports/stats.js';
import { reply } from '../../controllers/reports/reply.js';
import { getOne } from '../../controllers/reports/get.js';
import { ImageUpload } from '../../controllers/reports/uploadImage.js';
import { upload } from '../../middleware/multer.js';
import { ImageUploadonDB } from '../../middleware/UploadImage.js';


const ReportsRouter = Router();


//server/reports/add
ReportsRouter.route('/add').post(authenticateUser,upload.single('file'),ImageUploadonDB, Add);
ReportsRouter.route('/getall').get(authenticateUser, getall);
ReportsRouter.route('/changeStatus').post(authenticateUser, ChgStatus);
ReportsRouter.route('/stats').get(authenticateUser, stats);
ReportsRouter.route('/reply').post(authenticateUser, reply);
ReportsRouter.route('/get').post(authenticateUser, getOne);
ReportsRouter.route('/imgupload').post(authenticateUser,upload.single('file'),ImageUploadonDB, ImageUpload);




export default ReportsRouter;

