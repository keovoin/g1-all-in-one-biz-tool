"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_HELP_CENTER_MENUS = void 0;
exports.DEFAULT_HELP_CENTER_MENUS = [
    {
        name: 'Gauzy Platform',
        icon: 'book-open-outline',
        flag: 'base',
        privacy: 'eye-outline',
        language: 'en',
        color: '#d53636',
        index: 0,
        children: [
            {
                name: 'Cookies',
                icon: 'alert-circle-outline',
                flag: 'category',
                privacy: 'eye-outline',
                description: 'Information',
                language: 'en',
                color: '#d53636',
                index: 0
            },
            {
                name: 'Device',
                icon: 'book-open-outline',
                flag: 'category',
                privacy: 'eye-off-outline',
                description: 'Device Information',
                language: 'en',
                color: '#d53636',
                index: 1
            },
            {
                flag: 'category',
                icon: 'book-open-outline',
                privacy: 'eye-off-outline',
                name: 'Privacy',
                description: 'Gauzy Privacy Statement',
                data: 'Usage Information',
                language: 'en',
                color: '#d53636',
                index: 2
            },
            {
                flag: 'category',
                icon: 'book-open-outline',
                privacy: 'eye-off-outline',
                name: 'Testing',
                description: 'Gauzy Testing',
                language: 'en',
                color: '#d53636',
                index: 3
            }
        ]
    },
    {
        name: 'Ever Platform',
        icon: 'book-open-outline',
        flag: 'base',
        privacy: 'eye-off-outline',
        language: 'en',
        color: '#d53636',
        index: 1,
        children: [
            {
                name: 'Cookies',
                icon: 'alert-circle-outline',
                flag: 'category',
                privacy: 'eye-outline',
                description: 'Information',
                language: 'en',
                color: '#d53636',
                index: 0
            }
        ]
    },
    {
        flag: 'base',
        icon: 'book-open-outline',
        privacy: 'eye-off-outline',
        name: 'Privacy',
        language: 'en',
        color: '#d53636',
        index: 2,
        children: [
            {
                name: 'Cookies',
                icon: 'alert-circle-outline',
                flag: 'category',
                privacy: 'eye-outline',
                description: 'Information',
                language: 'en',
                color: '#d53636',
                index: 0
            }
        ]
    }
];
//# sourceMappingURL=default-help-centers.js.map