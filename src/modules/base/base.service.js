import { NotFoundError } from '../../utils/errors.js';
import pagination from '../../utils/pagination.js';

class BaseService {
  #repository;
  constructor(repository, serviceName) {
    this.#repository = repository;
    this.serviceName = serviceName;
  }

}

export default BaseService;
