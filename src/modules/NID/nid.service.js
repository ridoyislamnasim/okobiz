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
import nidRepository from './nid.repository.js';
import { isMainThread } from 'worker_threads';
import { v4 as uuidv4 } from 'uuid';
import SSLCommerzPayment from 'sslcommerz-lts';
import { UserSchema } from '../../models/auth/userSchema.js';
import authRepository from '../auth/auth.repository.js';
import amountRepository from '../amount/amount.repository.js';
const store_id = process.env.STORE_ID
const store_passwd = process.env.STORE_PASSWD
const is_live = false

class NIDService extends BaseService {
  #repository;
  #amountRepository;
  #authRepository;
  constructor(repository, amountRepository, authRepository, serviceName) {
    super(repository, serviceName);
    this.#repository = repository;
    this.#amountRepository = amountRepository;
    this.#authRepository = authRepository;
  }

  async createNID(payload, payloadFiles, session) {
    const { files, } = payloadFiles;
    const photo = files.find(file => file.fieldname === 'photo');
    const signature = files.find(file => file.fieldname === 'signature');

    if (!photo || !signature) throw new Error('Photo and Signature is required');
    const { user_ref,
      name_bangla, name_english,
      father_name, mother_name,
      date_of_dirth, nid_number,
      address, blood_group,
      issue_date,
    } = payload;
    if (!user_ref || !name_bangla || !name_english || !father_name || !mother_name || !date_of_dirth || !nid_number || !address || !blood_group || !issue_date) {
      throw new Error('Missing required fields');
    }
    const userExit = await this.#authRepository.getUserById(user_ref)
    if (!userExit) throw new NotFoundError('User not found');


    if (userExit?.amount < 100) throw new NotFoundError('unsafisend balance');

    let images;
    if (isArrayElementExist(files) && isMainThread) {
      const imgFile = files.map(
        ({ buffer, originalname, fieldname, mimetype }) => ({
          buffer,
          originalname:
            mimetype == "application/pdf"
              ? convertFileNameWithPdfExt(originalname)
              : convertFileNameWithWebpExt(originalname),
          fieldname,
          mimetype,
        })
      );
      await uploadWorker(imgFile);
      images = convertImgArrayToObject(imgFile);
    }

    for (const key in images) {
      payload[key] = images[key];
    }
    console.log('payload', payload);

    const nidData = await this.#repository.create([payload], session);
    await this.#authRepository.updateUserBalanceById(user_ref, -100, session);
    const transactionPlayload = {
      user_ref,
      amount: 100,
      type: 'Debit',
      status: 'Success',
    }
    const transactionData = await this.#amountRepository.createTransaction(transactionPlayload, session);
    console.log('14',);

    console.log('nidData', nidData);
    console.log('transactionData', transactionData);
    return nidData;
  }

}

export default new NIDService(nidRepository, amountRepository, authRepository, 'nid');
