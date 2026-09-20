"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_ORGANIZATIONS = exports.DEFAULT_EVER_ORGANIZATIONS = void 0;
const contracts_1 = require("@gauzy/contracts");
exports.DEFAULT_EVER_ORGANIZATIONS = [
    {
        name: 'Ever Technologies LTD',
        currency: contracts_1.CurrenciesEnum.BGN,
        defaultValueDateType: contracts_1.DefaultValueDateTypeEnum.TODAY,
        imageUrl: 'assets/images/logos/ever-large.jpg',
        isDefault: true,
        totalEmployees: 17
    },
    {
        name: 'Ever Co. Ltd',
        currency: contracts_1.CurrenciesEnum.ILS,
        defaultValueDateType: contracts_1.DefaultValueDateTypeEnum.TODAY,
        imageUrl: 'assets/images/logos/ever-large.jpg',
        isDefault: false,
        totalEmployees: 0
    }
];
exports.DEFAULT_ORGANIZATIONS = [
    {
        name: 'Default Company',
        currency: contracts_1.CurrenciesEnum.USD,
        defaultValueDateType: contracts_1.DefaultValueDateTypeEnum.TODAY,
        imageUrl: 'assets/images/logos/logo_Gauzy.svg',
        isDefault: true,
        totalEmployees: 1
    }
];
//# sourceMappingURL=default-organizations.js.map