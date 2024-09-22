import catchError from '../../middleware/errors/catchError.js';
import responseHandler from '../../utils/responseHandler.js';
import withTransaction from '../../middleware/transactions/withTransaction.js';
import NIDService from './nid.service.js';

class NIDController {
  //
  createNID = withTransaction(async (req, res, next, session) => {
    console.log(req.body);
    const userId = req.user.id;
    const payload = {
      name_bangla: req.body?.name_bangla,
      name_english: req.body?.name_english,
      father_name: req.body?.father_name,
      mother_name: req.body?.mother_name,
      date_of_dirth: req.body?.date_of_dirth,
      nid_number: req.body?.nid_number,
      address: req.body?.address,
      blood_group: req.body?.blood_group,
      issue_date: req.body?.issue_date,
      user_ref: userId,
    };
    const payloadFiles = {
      files: req.files,
    };
    const nidResult = await NIDService.createNID(payload, payloadFiles, session);
    console.log('nidResult',nidResult);
    const resDoc = responseHandler(201, 'NID Created successfully', nidResult);
    res.status(resDoc.statusCode).json(resDoc);
  });


  
}

export default new NIDController();
