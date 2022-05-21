'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

exports.LogLevels = void 0;
(function (LogLevels) {
    LogLevels["LOG"] = "log";
    LogLevels["DEBUG"] = "debug";
    LogLevels["INFO"] = "info";
    LogLevels["WARN"] = "warn";
    LogLevels["ERROR"] = "error";
})(exports.LogLevels || (exports.LogLevels = {}));

function isTLogLevel(level) {
    return ["log", "debug", "info", "warn", "error"].indexOf(level) !== -1;
}
/**
 * A factory method that returns a Deblog instance on the basis of the
 * configuration object provided.
 *
 * @export
 * @param {IDeblogConfig} config - The configuration object for the deblog instance.
 * @return {*}  {IDeblog}
 */
function createDeblog(config) {
    var _a, _b, _c;
    if (!config) {
        throw new Error("A configuration object is required in order to create a Deblog instance.");
    }
    const _config = config;
    (_a = config.logs) === null || _a === void 0 ? void 0 : _a.reduce((flags, log) => {
        var _a;
        flags[log.name] = (_a = log.enabled) !== null && _a !== void 0 ? _a : true;
        return flags;
    }, {});
    function Deblog() {
        this.getConfig = () => _config;
    }
    for (let log of (_b = config.logs) !== null && _b !== void 0 ? _b : []) {
        if (!isTLogLevel(log.level)) {
            throw new Error(`Invalid log level: ${log.level}`);
        }
        let flag = (_c = log.enabled) !== null && _c !== void 0 ? _c : true;
        let defFlag = flag;
        let tempLog = (function () {
            flag && console[log.level](`${log.tag}`, ...arguments);
        });
        tempLog.enable = () => (flag = true);
        tempLog.disable = () => (flag = false);
        tempLog.restore = () => (flag = defFlag);
        Deblog.prototype[log.name] = tempLog;
        Deblog.prototype.disableAllBut = function (...names) {
            let prototype = Object.getPrototypeOf(this);
            for (let log in prototype) {
                if (names.indexOf(log) === -1 && prototype[log].disable) {
                    prototype[log].disable();
                }
            }
        };
        Deblog.prototype.restoreAll = function () {
            let prototype = Object.getPrototypeOf(this);
            for (let log in prototype) {
                prototype[log].restore && prototype[log].restore();
            }
        };
    }
    return new Deblog(config);
}

exports.createDeblog = createDeblog;
