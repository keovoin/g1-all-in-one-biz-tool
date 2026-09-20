"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoCodecEnum = exports.VideoResolutionEnum = void 0;
/**
 * Enum for standard video resolutions.
 */
var VideoResolutionEnum;
(function (VideoResolutionEnum) {
    VideoResolutionEnum["SD"] = "640:480";
    VideoResolutionEnum["HD"] = "1280:720";
    VideoResolutionEnum["FullHD"] = "1920:1080";
    VideoResolutionEnum["QHD"] = "2560:1440";
    VideoResolutionEnum["UHD4K"] = "3840:2160";
    VideoResolutionEnum["UHD5K"] = "5120:2880";
    VideoResolutionEnum["UHD6K"] = "6144:3160";
    VideoResolutionEnum["UHD8K"] = "7680:4320";
    VideoResolutionEnum["DCI4K"] = "4096:2160";
    VideoResolutionEnum["Cinema2K"] = "2048:1080";
    VideoResolutionEnum["WXGA"] = "1366:768";
    VideoResolutionEnum["SXGA"] = "1280:1024";
    VideoResolutionEnum["UXGA"] = "1600:1200";
    VideoResolutionEnum["VGA"] = "640:360";
    VideoResolutionEnum["PAL"] = "720:576";
    VideoResolutionEnum["NTSC"] = "720:480"; // NTSC Standard Resolution
})(VideoResolutionEnum || (exports.VideoResolutionEnum = VideoResolutionEnum = {}));
/**
 * Enum for standard video codecs used for encoding.
 */
var VideoCodecEnum;
(function (VideoCodecEnum) {
    VideoCodecEnum["libx264"] = "libx264";
    VideoCodecEnum["libx265"] = "libx265";
    VideoCodecEnum["libvpx"] = "libvpx";
    VideoCodecEnum["libaom"] = "libaom";
    VideoCodecEnum["mpeg4"] = "mpeg4";
    VideoCodecEnum["h263"] = "h263";
    VideoCodecEnum["h264"] = "h264";
    VideoCodecEnum["h265"] = "h265";
    VideoCodecEnum["theora"] = "theora";
    VideoCodecEnum["vp8"] = "vp8";
    VideoCodecEnum["vp9"] = "vp9"; // VP9 codec
})(VideoCodecEnum || (exports.VideoCodecEnum = VideoCodecEnum = {}));
//# sourceMappingURL=video.model.js.map