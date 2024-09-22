import catchError from '../../middleware/errors/catchError.js';
import responseHandler from '../../utils/responseHandler.js';
import withTransaction from '../../middleware/transactions/withTransaction.js';
import AuthService from './auth.service.js';

class AuthController {
  getUserById = withTransaction(async (req,res,next, session) => {
    const userId = req.user.id;
    const user = await AuthService.getUserById(userId, session);
    const resDoc = responseHandler(200, 'User get successfully', user);
    res.status(resDoc.statusCode).json(resDoc);
  });
  authUserSingUp = withTransaction(async (req, res, next ,session) => {
    const { name, email, password,} = req.body;
    const payload = {
      name,
      email,
      password,
    };
    const auth = await AuthService.authUserSingUp(payload, session);
    const resDoc = responseHandler(200, 'login successfully', auth);
    res.status(resDoc.statusCode).json(resDoc);

  })

  authUserSingIn = withTransaction(async (req, res, next, session) => {
    const {  email, password} = req.body;
    const payload = {
      email,
      password
    };

    const auth = await AuthService.authUserSingIn(payload, session);
    const resDoc = responseHandler(201, 'login successfully', auth);
    res.status(resDoc.statusCode).json(resDoc);
  });

 
}

export default new AuthController();
