import { Router } from 'express';
import controller from '../../modules/auth/auth.controller.js';
import { upload } from '../../middleware/upload/upload.js';
import jwtAuth from '../../middleware/auth/jwtAuth.js';

const AuthRouter = Router();
AuthRouter
  .get('/user', jwtAuth(), controller.getUserById)
  .post('/user/singup', controller.authUserSingUp)
  .post('/user/singin', controller.authUserSingIn)




export default AuthRouter;
