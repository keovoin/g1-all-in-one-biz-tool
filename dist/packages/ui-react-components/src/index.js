"use strict";
/*
 * Public API Surface of @gauzy/ui-react-components
 *
 * Reusable React UI components and design tokens for Gauzy dashboards.
 * No Angular or plugin-system dependencies — pure React + TypeScript.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.computePopoverPosition = exports.Popover = exports.Spinner = exports.Avatar = exports.Badge = exports.ProgressBar = exports.counterPointBackground = exports.computeCounterPoints = exports.CounterPoint = exports.ColorDots = exports.Progress = exports.WidgetCard = exports.CardFooter = exports.CardContent = exports.CardAction = exports.CardDescription = exports.CardTitle = exports.CardHeader = exports.Card = exports.useInjectedStyles = exports.ensureStyleTag = exports.progressStatus = exports.todayRange = exports.currentWeekRange = exports.formatDuration = exports.statusColor = exports.themeTokens = exports.theme = void 0;
// Design tokens
var theme_1 = require("./lib/theme");
Object.defineProperty(exports, "theme", { enumerable: true, get: function () { return theme_1.theme; } });
var themeTokens_1 = require("./lib/themeTokens");
Object.defineProperty(exports, "themeTokens", { enumerable: true, get: function () { return themeTokens_1.themeTokens; } });
Object.defineProperty(exports, "statusColor", { enumerable: true, get: function () { return themeTokens_1.statusColor; } });
// Utility functions
var index_1 = require("./lib/helpers/index");
Object.defineProperty(exports, "formatDuration", { enumerable: true, get: function () { return index_1.formatDuration; } });
Object.defineProperty(exports, "currentWeekRange", { enumerable: true, get: function () { return index_1.currentWeekRange; } });
Object.defineProperty(exports, "todayRange", { enumerable: true, get: function () { return index_1.todayRange; } });
Object.defineProperty(exports, "progressStatus", { enumerable: true, get: function () { return index_1.progressStatus; } });
Object.defineProperty(exports, "ensureStyleTag", { enumerable: true, get: function () { return index_1.ensureStyleTag; } });
Object.defineProperty(exports, "useInjectedStyles", { enumerable: true, get: function () { return index_1.useInjectedStyles; } });
// Components — Card (layout, compound component)
var ui_1 = require("./lib/components/ui");
Object.defineProperty(exports, "Card", { enumerable: true, get: function () { return ui_1.Card; } });
Object.defineProperty(exports, "CardHeader", { enumerable: true, get: function () { return ui_1.CardHeader; } });
Object.defineProperty(exports, "CardTitle", { enumerable: true, get: function () { return ui_1.CardTitle; } });
Object.defineProperty(exports, "CardDescription", { enumerable: true, get: function () { return ui_1.CardDescription; } });
Object.defineProperty(exports, "CardAction", { enumerable: true, get: function () { return ui_1.CardAction; } });
Object.defineProperty(exports, "CardContent", { enumerable: true, get: function () { return ui_1.CardContent; } });
Object.defineProperty(exports, "CardFooter", { enumerable: true, get: function () { return ui_1.CardFooter; } });
// Components — WidgetCard (stat/metric card built on Card + CardContent)
var WidgetCard_1 = require("./lib/components/WidgetCard");
Object.defineProperty(exports, "WidgetCard", { enumerable: true, get: function () { return WidgetCard_1.WidgetCard; } });
var Progress_1 = require("./lib/components/Progress");
Object.defineProperty(exports, "Progress", { enumerable: true, get: function () { return Progress_1.Progress; } });
var ColorDots_1 = require("./lib/components/ColorDots");
Object.defineProperty(exports, "ColorDots", { enumerable: true, get: function () { return ColorDots_1.ColorDots; } });
// Components — theme-adaptive Nebular ports (paint with the active Gauzy theme's CSS variables)
var CounterPoint_1 = require("./lib/components/CounterPoint");
Object.defineProperty(exports, "CounterPoint", { enumerable: true, get: function () { return CounterPoint_1.CounterPoint; } });
Object.defineProperty(exports, "computeCounterPoints", { enumerable: true, get: function () { return CounterPoint_1.computeCounterPoints; } });
Object.defineProperty(exports, "counterPointBackground", { enumerable: true, get: function () { return CounterPoint_1.counterPointBackground; } });
var ProgressBar_1 = require("./lib/components/ProgressBar");
Object.defineProperty(exports, "ProgressBar", { enumerable: true, get: function () { return ProgressBar_1.ProgressBar; } });
var Badge_1 = require("./lib/components/Badge");
Object.defineProperty(exports, "Badge", { enumerable: true, get: function () { return Badge_1.Badge; } });
var Avatar_1 = require("./lib/components/Avatar");
Object.defineProperty(exports, "Avatar", { enumerable: true, get: function () { return Avatar_1.Avatar; } });
var Spinner_1 = require("./lib/components/Spinner");
Object.defineProperty(exports, "Spinner", { enumerable: true, get: function () { return Spinner_1.Spinner; } });
var Popover_1 = require("./lib/components/Popover");
Object.defineProperty(exports, "Popover", { enumerable: true, get: function () { return Popover_1.Popover; } });
Object.defineProperty(exports, "computePopoverPosition", { enumerable: true, get: function () { return Popover_1.computePopoverPosition; } });
//# sourceMappingURL=index.js.map