"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tsyringe = require("tsyringe");

var _classTransformer = require("class-transformer");

var _UpdateProfileService = _interopRequireDefault(require("../../../services/UpdateProfileService"));

var _ShowProfileService = _interopRequireDefault(require("../../../services/ShowProfileService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ProfileController {
  async show(request, response) {
    const {
      id: user_id
    } = request.user;

    const showProfileService = _tsyringe.container.resolve(_ShowProfileService.default);

    const user = await showProfileService.execute({
      user_id
    });
    return response.json((0, _classTransformer.classToClass)(user));
  }

  async update(request, response) {
    const {
      email,
      name,
      old_password,
      password
    } = request.body;
    const {
      id: user_id
    } = request.user;

    const updateProfileService = _tsyringe.container.resolve(_UpdateProfileService.default);

    const user = await updateProfileService.execute({
      user_id,
      email,
      name,
      old_password,
      password
    });
    return response.json((0, _classTransformer.classToClass)(user));
  }

}

exports.default = ProfileController;