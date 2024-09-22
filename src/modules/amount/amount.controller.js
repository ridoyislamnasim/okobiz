import catchError from '../../middleware/errors/catchError.js';
import responseHandler from '../../utils/responseHandler.js';
import withTransaction from '../../middleware/transactions/withTransaction.js';
import AmountService from './amount.service.js';

class AmountController {
  //
  addAmount = withTransaction(async (req, res, next, session) => {
    console.log(req.body, req.user.id);
    const { amount } = req.body;
    const payload = {
      amount,
      userId: req.user.id
    };
    const amountResult = await AmountService.addAmount(payload, session);
    console.log('amountResult',amountResult);
    const resDoc = responseHandler(201, 'Amount Created successfully', amountResult);
    res.status(resDoc.statusCode).json(resDoc);
  });
  addAmountSuccess = withTransaction(async (req, res, next, session) => {
    console.log('req.params --',req.params);
    const {id } = req.params;
    const amountResult = await AmountService.addAmountSuccess(id, session);
    console.log('title---');
    if (amountResult) {
      res.redirect('http://localhost:5173/user/success')
    } else {
    }
    // const resDoc = responseHandler(201, 'Amount Created successfully', amountResult);
    // res.status(resDoc.statusCode).json(resDoc);
  })
  addAmountFail = withTransaction(async (req, res, next, session) => {
    const {id } = req.params;
    const amountResult = await AmountService.addAmountFail(id, session);
    if (amountResult) {
      res.redirect('http://localhost:5173/user/fail')
    } else {
    }

  })
  addAmountCancel = withTransaction(async (req, res, next, session) => {
    const {id } = req.params;
    const amountResult = await AmountService.addAmountCancel(id, session);
    if (amountResult) {
      res.redirect('http://localhost:5173/user/cancle')
    } else {
    }
    
  })
  nid = withTransaction(async (req, res, next, session) => {
    console.log('req.body',req.body);
    console.log('req.body',req.files);
  })

  
}

export default new AmountController();
