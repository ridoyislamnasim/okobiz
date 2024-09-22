import BaseRepository from '../base/base.repository.js';
import pagination from '../../utils/pagination.js';
import { TransactionSchema } from '../../models/index.js';
// import { AmountSchema } from '../../models/index.js';;
 
class AmountRepository extends BaseRepository {
  #model;
  constructor(model) {
    super(model);
    this.#model = model;
  }

  async createTransaction(payload, session){
    // user_ref, amount, type, status
    const { nid, user_ref, amount, type, status  } = payload;
    const transactionObject = {
      nid,
      user_ref,
      amount,
      type,
      status,
      };
    const newTransaction = await this.#model.create([transactionObject], { session });
    console.log('newTransaction', newTransaction);
    return newTransaction;

  }

  async transactionUpdate(id, status, session){
    const updatedTransaction = await this.#model.findByIdAndUpdate(
      id,
      {
        $set: {
          status: status,
        }
      },
      { session }
    );
    console.log('updatedTransaction',updatedTransaction);
    return updatedTransaction;
  }





}

export default new AmountRepository(TransactionSchema);
