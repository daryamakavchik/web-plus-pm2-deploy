"use strict";
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.linkRegex = exports.SECRET_KEY = exports.LINK = exports.PORT = exports.STATUS_11000 = exports.STATUS_409 = exports.STATUS_404 = exports.STATUS_403 = exports.STATUS_401 = exports.STATUS_400 = exports.STATUS_500 = void 0;
exports.STATUS_500 = 500;
exports.STATUS_400 = 400;
exports.STATUS_401 = 401;
exports.STATUS_403 = 403;
exports.STATUS_404 = 404;
exports.STATUS_409 = 409;
exports.STATUS_11000 = 11000;
_a = process.env, _b = _a.PORT, exports.PORT = _b === void 0 ? 3000 : _b, _c = _a.LINK, exports.LINK = _c === void 0 ? 'mongodb://127.0.0.1:27017/mestodb' : _c, _d = _a.SECRET_KEY, exports.SECRET_KEY = _d === void 0 ? 'some-secret-key' : _d;
exports.linkRegex = /^((http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-/])*)?/;
