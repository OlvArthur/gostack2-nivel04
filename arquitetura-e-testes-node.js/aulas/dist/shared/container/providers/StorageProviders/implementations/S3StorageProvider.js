"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _s = _interopRequireDefault(require("aws-sdk/clients/s3"));

var _mime = _interopRequireDefault(require("mime"));

var _AppError = _interopRequireDefault(require("../../../../errors/AppError"));

var _upload = _interopRequireDefault(require("../../../../../config/upload"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class S3StorageProvider {
  constructor() {
    this.client = void 0;
    this.client = new _s.default();
  }

  async saveFile(file) {
    await _fs.default.promises.rename(_path.default.resolve(_upload.default.tmpFolder, file), _path.default.resolve(_upload.default.uploadsFolder, file));

    const originalPath = _path.default.resolve(_upload.default.uploadsFolder, file);

    const ContentType = _mime.default.getType(originalPath);

    if (!ContentType) {
      throw new _AppError.default('File not found');
    }

    const fileContent = await _fs.default.promises.readFile(originalPath);
    await _fs.default.promises.unlink(originalPath);
    await this.client.putObject({
      Bucket: _upload.default.config.aws.bucket,
      Key: file,
      ACL: 'public-read',
      Body: fileContent,
      ContentType,
      ContentDisposition: `inline; filename=${file}`
    }).promise();
    return file;
  }

  async deleteFile(file) {
    await this.client.deleteObject({
      Bucket: _upload.default.config.aws.bucket,
      Key: file
    }).promise();
  }

}

exports.default = S3StorageProvider;