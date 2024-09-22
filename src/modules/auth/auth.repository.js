
import { UserSchema } from '../../models/auth/userSchema.js';
import BaseRepository from '../base/base.repository.js';


class AuthRepository extends BaseRepository {
  #model;
  constructor(model) {
    super(model);
    this.#model = model;
  }
  async getUserById(id) {
    return await this.#model.findById(id).select('name email amount +password').exec();

  }

  async getAuthByEmail(email) {
    return await this.#model.findOne({ email }).exec();
  }
  async authUserSingUp(payload, session){
    const {name, email, password} = payload;
    console.log('payload',payload);
    const signingUpObject = {
      name,
      email,
      password ,
    }
    const user = await this.#model.create([signingUpObject], { session });

    console.log('user',user);
    return user;
  }

  async updateUserBalanceById(id, amount, session){
    const updatedUser = await this.#model.findByIdAndUpdate(
      id,
      {
        $inc: {
          amount: amount,
        }
      },
      { new: true }
    ).exec();
    return updatedUser;
  }
   

}

export default new AuthRepository(UserSchema);
