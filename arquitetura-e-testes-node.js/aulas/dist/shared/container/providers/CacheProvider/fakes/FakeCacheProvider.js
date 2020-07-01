"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class FakeCacheProvider {
  constructor() {
    this.cache = {};
  }

  async save(key, value) {
    this.cache[key] = JSON.stringify(value);
  }

  async recover(key) {
    const value = this.cache[key];

    if (!value) {
      return null;
    }

    const parsedValue = JSON.parse(value);
    return parsedValue;
  }

  async invalidate(key) {
    delete this.cache[key];
  }

  async invalidateByPrefix(prefix) {
    const keys = Object.keys(this.cache).filter(key => key.startsWith(`${prefix}:`));
    keys.forEach(key => delete this.cache[key]);
  }

}

exports.default = FakeCacheProvider;