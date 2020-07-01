"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tsyringe = require("tsyringe");

var _ListProviderMonthAvailabilityService = _interopRequireDefault(require("../../../services/ListProviderMonthAvailabilityService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class AppointmentsController {
  async index(request, response) {
    const {
      month,
      year
    } = request.query;
    const {
      provider_id
    } = request.params;

    const listProviderMonthAvailability = _tsyringe.container.resolve(_ListProviderMonthAvailabilityService.default);

    const MonthAvailability = await listProviderMonthAvailability.execute({
      month: Number(month),
      year: Number(year),
      provider_id
    });
    return response.json(MonthAvailability);
  }

}

exports.default = AppointmentsController;