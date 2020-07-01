"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _typeorm = require("typeorm");

var _User = _interopRequireDefault(require("../entities/User"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class UsersRepository {
  constructor() {
    this.ormRepository = void 0;
    this.ormRepository = (0, _typeorm.getRepository)(_User.default);
  }

  async findByEmail(email) {
    const user = await this.ormRepository.findOne({
      where: {
        email
      }
    });
    return user;
  }

  async findById(id) {
    const user = await this.ormRepository.findOne(id);
    return user;
  }

  async create({
    name,
    email,
    password
  }) {
    const user = this.ormRepository.create({
      email,
      name,
      password
    });
    await this.ormRepository.save(user);
    return user;
  }

  async save(user) {
    return this.ormRepository.save(user);
  }

  async findAllProviders({
    except_user_id
  }) {
    if (!except_user_id) {
      return this.ormRepository.find();
    }

    return this.ormRepository.find({
      where: {
        id: (0, _typeorm.Not)(except_user_id)
      }
    });
  }

}

var _default = UsersRepository;
exports.default = _default;