"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BingoEngineModule = void 0;
const common_1 = require("@nestjs/common");
const game_logic_service_1 = require("./game-logic/game-logic.service");
const realtime_gateway_1 = require("./realtime/realtime.gateway");
const scheduler_service_1 = require("./scheduler/scheduler.service");
let BingoEngineModule = class BingoEngineModule {
};
exports.BingoEngineModule = BingoEngineModule;
exports.BingoEngineModule = BingoEngineModule = __decorate([
    (0, common_1.Module)({
        providers: [game_logic_service_1.GameLogicService, realtime_gateway_1.RealtimeGateway, scheduler_service_1.SchedulerService],
        exports: [game_logic_service_1.GameLogicService]
    })
], BingoEngineModule);
//# sourceMappingURL=bingo-engine.module.js.map