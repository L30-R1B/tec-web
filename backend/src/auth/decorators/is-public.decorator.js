"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsPublic = exports.IS_PUBLIC_KEY = void 0;
// path: src/auth/decorators/is-public.decorator.ts
var common_1 = require("@nestjs/common");
exports.IS_PUBLIC_KEY = 'isPublic';
var IsPublic = function () { return (0, common_1.SetMetadata)(exports.IS_PUBLIC_KEY, true); };
exports.IsPublic = IsPublic;
