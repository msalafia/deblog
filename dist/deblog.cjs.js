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
function generateId(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}
/**
 * The repository of all deblogs defined in this module.
 */
const repository = new Map();
/**
 * A factory method that returns a Deblog instance on the basis of the
 * configuration object provided.
 * @function createDeblog
 * @template T A convenient type exposing the logging methods speicifed in ten configuration.
 * @param {IDeblogConfig} config - The configuration object for the deblog instance.
 * @return {IDeblog} - The deblog instance.
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
        var _a;
        this.id = (_a = _config.id) !== null && _a !== void 0 ? _a : generateId(12);
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
    }
    /**
     * A convenience method to disable all the logs but the ones whose names
     * are provided as arguments.
     *
     * @param {...string} logs - The names of the logs that will NOT be disabled.
     * @returns {void}
     */
    Deblog.prototype.disableAllBut = function (...names) {
        let prototype = Object.getPrototypeOf(this);
        for (let log in prototype) {
            if (names.indexOf(log) === -1 && prototype[log].disable) {
                prototype[log].disable();
            }
        }
    };
    /**
     * A convenience method to restore all the logs to the original configured value.
     */
    Deblog.prototype.restoreAll = function () {
        let prototype = Object.getPrototypeOf(this);
        for (let log in prototype) {
            prototype[log].restore && prototype[log].restore();
        }
    };
    const deblog = new Deblog(config);
    _config.persist && repository.set(deblog.id, deblog);
    return deblog;
}
/**
 * Returns the deblog instance with the given id.
 * @function getDeblog
 * @param {string} id - The id of the deblog instance.
 * @returns - A deblog instance corresponding to the id provided or undefined.
 */
function getDeblog(id) {
    return repository.get(id);
}
/**
 * Get all the deblog instances defined so far.
 * @function getAllDeblogs
 * @returns - An array of all the deblog instances.
 */
function getDeblogs() {
    return Array.from(repository.values());
}
/**
 * Remove all the deblg instances saved in the internal repository.
 * @function removeAllDeblogs
 */
function clearDeblogs() {
    repository.clear();
}

exports.clearDeblogs = clearDeblogs;
exports.createDeblog = createDeblog;
exports.getDeblog = getDeblog;
exports.getDeblogs = getDeblogs;
