import { NotFoundError } from '../../utils/errors.js';
import BaseService from '../base/base.service.js';
import {
  convertFileNameWithPdfExt,
  convertFileNameWithWebpExt,
  convertImgArrayToObject,
  convertObjOriginalImgNameWithWebpExt,
  uploadWorker,
} from '../../middleware/upload/index.js';
import isArrayElementExist from '../../utils/isArrayElementExist.js';
import amountRepository from './amount.repository.js';
import { isMainThread } from 'worker_threads';
import { v4 as uuidv4 } from 'uuid';
import SSLCommerzPayment from 'sslcommerz-lts';
import { UserSchema } from '../../models/auth/userSchema.js';
const store_id = process.env.STORE_ID
const store_passwd = process.env.STORE_PASSWD
const is_live = false //true for live, false for sandbox

class AmountService extends BaseService {
	#repository;
	constructor(repository, serviceName) {
		super(repository, serviceName);
		this.#repository = repository;
	}

    async addAmount(payload, session) {
        const { amount, userId } = payload;
    
        // Validate payload
        console.log('userId',userId);
        
        if (!amount) {
            throw new NotFoundError('fill up required fields');
        }
        const transactionPlayload = {
            user_ref : userId,
            amount,
            type: 'Credit',
            status: 'Create',
        }
        const createTransaction = await this.#repository.createTransaction(transactionPlayload, session);
        const objectId = createTransaction[0]?._id;
        const idString = objectId?.toString(); // Convert ObjectId to string
        console.log('tran_id', idString);
        const data = {
            total_amount: amount,
            currency: 'BDT',
            tran_id: idString, // use unique tran_id for each api call
            success_url: `http://localhost:3001/api/amount/success/${idString}`,
            fail_url:  `http://localhost:3001/api/amount/fail/${idString}`,
            cancel_url:  `http://localhost:3001/api/amount/cancel/${idString}`,
            ipn_url: 'http://localhost:3030/ipn',
            shipping_method: 'Courier',
            product_name: 'Computer.',
            product_category: 'Electronic',
            product_profile: 'general',
            cus_name: 'Customer Name',
            cus_email: 'customer@example.com',
            cus_add1: 'Dhaka',
            cus_add2: 'Dhaka',
            cus_city: 'Dhaka',
            cus_state: 'Dhaka',
            cus_postcode: '1000',
            cus_country: 'Bangladesh',
            cus_phone: '01711111111',
            cus_fax: '01711111111',
            ship_name: 'Customer Name',
            ship_add1: 'Dhaka',
            ship_add2: 'Dhaka',
            ship_city: 'Dhaka',
            ship_state: 'Dhaka',
            ship_postcode: 1000,
            ship_country: 'Bangladesh',
        };
    
        // SSLCommerz payment initialization
        const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    
        try {
            const apiResponse = await sslcz.init(data);
            const GatewayPageURL = apiResponse.GatewayPageURL;
            console.log('Redirecting to: ', GatewayPageURL);
            return{url: GatewayPageURL};
        } catch (error) {
            console.error('Error initializing payment:', error);
            throw new Error('Payment initialization failed');
        }
    }

    async addAmountSuccess(id, session) {
        console.log('Amount:', id);
        try {
            // Update the transaction based on the provided id
            const status = "Success";
            const transactionUpdate = await this.#repository.transactionUpdate(id,status, session);
            console.log('transactionUpdate:', transactionUpdate);
            console.log('User Ref:', transactionUpdate?.user_ref);
            console.log('Amount:', transactionUpdate?.amount);
    
            // Check if the transaction update was successful
            if (!transactionUpdate) throw new Error('Transaction failed');
    
            const result = await UserSchema.findByIdAndUpdate(
                transactionUpdate?.user_ref, 
                { $inc: { amount: transactionUpdate?.amount } },
                { new: true, session } 
            );
            
            console.log('Amount added successfully:', result);
            return result;
        } catch (error) {
            console.error('Error adding amount:', error);
            throw new Error('Failed to add amount');
        }
    }
    async addAmountFail(id, session){
        console.log('Amount:', id);
        try {
            const status = "Fail";
            const transactionUpdate = await this.#repository.transactionUpdate(id,status, session);
            if (!transactionUpdate) throw new Error('Transaction failed');
            return transactionUpdate;
        } catch (error) {
            console.error('Error adding amount:', error);
            throw new Error('Failed to add amount');
        }
    }

    async addAmountCancel(id, session){
        console.log('Amount:', id);
        try {
            const status = "Cancel";
            const transactionUpdate = await this.#repository.transactionUpdate(id,status, session);
            if (!transactionUpdate) throw new Error('Transaction failed');
            return transactionUpdate;
        } catch (error) {
            console.error('Error adding amount:', error);
            throw new Error('Failed to add amount');
        }
    }
    
    


	
}

export default new AmountService(amountRepository, 'amount');
