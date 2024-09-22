import { Router } from 'express';
import controller from '../../modules/amount/amount.controller.js';
import jwtAuth from '../../middleware/auth/jwtAuth.js';
import { upload } from '../../middleware/upload/index.js';
const AmountRoute = Router();
AmountRoute
  .post('/success/:id', controller.addAmountSuccess)
  .post('/fail/:id', controller.addAmountFail)
  .post('/cancel/:id', controller.addAmountCancel);

AmountRoute.use(jwtAuth());
AmountRoute
  .post('/', controller.addAmount)
  .post('/nid',upload.any(), controller.nid)

export default AmountRoute;
