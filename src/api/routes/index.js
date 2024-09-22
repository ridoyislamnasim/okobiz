
import AuthUserRouter from './auth.route.js';
import AmountRouter from './amount.route.js';
import NIDRouter from './nid.route.js';


import { Router } from 'express';
const rootRouter = Router();

rootRouter.use('/auth', AuthUserRouter);
rootRouter.use('/amount', AmountRouter);
rootRouter.use('/nid', NIDRouter);


export default rootRouter;
