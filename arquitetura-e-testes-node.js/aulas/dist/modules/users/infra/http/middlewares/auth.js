"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = auth;

var _jsonwebtoken = require("jsonwebtoken");

var _auth = _interopRequireDefault(require("../../../../../config/auth"));

var _AppError = _interopRequireDefault(require("../../../../../shared/errors/AppError"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function auth(request, response, next) {
  const {
    authorization
  } = request.headers;

  if (!authorization) {
    throw new _AppError.default('Missing JWT token', 401);
  }

  const [, token] = authorization.split(' ');

  try {
    const decoded = (0, _jsonwebtoken.verify)(token, _auth.default.jwt.secret);
    const {
      sub
    } = decoded;
    request.user = {
      id: sub
    };
    return next();
  } catch {
    throw new _AppError.default('Invalid JWT token', 401);
  }
}