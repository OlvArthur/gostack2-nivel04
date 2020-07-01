"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = rateLimiterRedis;

var _rateLimiterFlexible = require("rate-limiter-flexible");

var _redis = _interopRequireDefault(require("redis"));

var _AppError = _interopRequireDefault(require("../../../errors/AppError"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const redisClient = _redis.default.createClient({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASS || undefined,
  enable_offline_queue: false
});

const rateLimiter = new _rateLimiterFlexible.RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'middleware',
  points: 5,
  duration: 1
});

async function rateLimiterRedis(request, response, next) {
  try {
    await rateLimiter.consume(request.ip);
    return next();
  } catch (error) {
    throw new _AppError.default('Too Many Requests', 429);
  }
}