class BaseRepository {
  #model;
  constructor(model) {
    this.#model = model;
  }

  async create(item, session){ // use mongoose mongDB use sesstion
    return await this.#model.create(item, session);
  }

  
  async findAll(filter = {}, populateFields = []) { // my
    let query = this.#model.find(filter);
    
    // Apply populate if fields are provided
    if (populateFields.length > 0) {
      populateFields.forEach((field) => {
        query = query.populate(field);
      });
    }
    const results = await query;
    return results;
  }
  async findOne(filter = {}, populateFields = []) { // mongoose
    let query = this.#model.findOne(filter);
    
    // Apply populate if fields are provided
    if (populateFields.length > 0) {
      populateFields.forEach((field) => {
        query = query.populate(field);
      });
    }
    const results = await query;
    return results;
  }
  async findById(id, populateFields = []){ // mongoose
    let query = this.#model.findById(id);
    
    // Apply populate if fields are provided
    if (populateFields.length > 0) {
      populateFields.forEach((field) => {
        query = query.populate(field);
      });
    }
    const results = await query;
    return results;
  }

 

  async updateById(id, updatedData, session) { // mongodb updateById
    return await this.#model.updateOne(
      { _id: id },
      { $set: updatedData }
      // { session }
    );
  }


}

export default BaseRepository;
