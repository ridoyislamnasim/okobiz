import { Router } from 'express';
import controller from '../../modules/NID/nid.controller.js';
import jwtAuth from '../../middleware/auth/jwtAuth.js';
import { upload } from '../../middleware/upload/index.js';
const NIDRoute = Router();
NIDRoute.use(jwtAuth());
NIDRoute
  .post('/',upload.any(), controller.createNID)

export default NIDRoute;
