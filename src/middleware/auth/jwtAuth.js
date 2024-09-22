
import { BadRequestError } from '../../utils/errors.js';
import { verifyAccessToken } from '../../utils/jwt.js';

const jwtAuth = () => {
  return async (req, res, next) => {

    // console.log(req.headers);

    try {
      const bearer = req.headers.authorization || req.headers.Authorization;
      // console.log(req.headers);
      if (!bearer || !bearer.startsWith('Bearer ')) {
        throw new BadRequestError('token not found');
      }
      const token = bearer.split('Bearer ')[1].trim();
      const payload = await verifyAccessToken(token);
      // console.log("payload: ", payload)

      if (!payload) throw new BadRequestError('unauthorized');
      req.user = { ...payload.userInfo.user_info_encrypted };
      next();
    } catch (err) {
      next(err);
    }
  }
};
export default jwtAuth;

