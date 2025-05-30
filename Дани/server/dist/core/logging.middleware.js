"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingMiddleware = void 0;
const common_1 = require("@nestjs/common");
let LoggingMiddleware = class LoggingMiddleware {
    use(req, res, next) {
        const { method, originalUrl, body, query, params } = req;
        const startTime = Date.now();
        console.log(`[${new Date().toISOString()}] Request:`, {
            method,
            url: originalUrl,
            body,
            query,
            params,
        });
        const originalSend = res.send;
        res.send = function (body) {
            const responseTime = Date.now() - startTime;
            console.log(`[${new Date().toISOString()}] Response:`, {
                statusCode: res.statusCode,
                responseTime: `${responseTime}ms`,
                url: originalUrl,
                method,
            });
            return originalSend.call(this, body);
        };
        next();
    }
};
exports.LoggingMiddleware = LoggingMiddleware;
exports.LoggingMiddleware = LoggingMiddleware = __decorate([
    (0, common_1.Injectable)()
], LoggingMiddleware);
//# sourceMappingURL=logging.middleware.js.map