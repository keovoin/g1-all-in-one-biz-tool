"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityWatchCollectEvent = exports.ActivityWatchEventType = exports.ActivityWatchAfkEventStatus = void 0;
var ActivityWatchAfkEventStatus;
(function (ActivityWatchAfkEventStatus) {
    ActivityWatchAfkEventStatus["NO_AFK"] = "not-afk";
    ActivityWatchAfkEventStatus["AFK"] = "afk";
})(ActivityWatchAfkEventStatus || (exports.ActivityWatchAfkEventStatus = ActivityWatchAfkEventStatus = {}));
var ActivityWatchEventType;
(function (ActivityWatchEventType) {
    ActivityWatchEventType["APP"] = "APP";
    ActivityWatchEventType["URL"] = "URL";
    ActivityWatchEventType["AFK"] = "AFK";
})(ActivityWatchEventType || (exports.ActivityWatchEventType = ActivityWatchEventType = {}));
var ActivityWatchCollectEvent;
(function (ActivityWatchCollectEvent) {
    ActivityWatchCollectEvent["WINDOW"] = "collect_data";
    ActivityWatchCollectEvent["AFK"] = "collect_afk";
    ActivityWatchCollectEvent["CHROME"] = "collect_chrome_activities";
    ActivityWatchCollectEvent["FIREFOX"] = "collect_firefox_activities";
    ActivityWatchCollectEvent["EDGE"] = "collect_edge_activities";
})(ActivityWatchCollectEvent || (exports.ActivityWatchCollectEvent = ActivityWatchCollectEvent = {}));
//# sourceMappingURL=activity-watch.model.js.map