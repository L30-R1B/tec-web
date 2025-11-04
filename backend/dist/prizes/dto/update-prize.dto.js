"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePrizeDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_prize_dto_1 = require("./create-prize.dto");
class UpdatePrizeDto extends (0, mapped_types_1.PartialType)(create_prize_dto_1.CreatePrizeDto) {
}
exports.UpdatePrizeDto = UpdatePrizeDto;
//# sourceMappingURL=update-prize.dto.js.map