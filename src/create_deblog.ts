import { IDeblog, IDeblogConfig, IDynamicLogs, IFlag, ILogConfig, TLog, TLogLevel } from "./types";

function isTLogLevel(level: string): level is TLogLevel {
  return ["log", "debug", "info", "warn", "error"].indexOf(level) !== -1;
}

function generateId(length: number) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for ( var i = 0; i < length; i++ ) {
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
export function createDeblog<T extends IDynamicLogs>(config: IDeblogConfig): IDeblog & T {
  if (!config) {
    throw new Error("A configuration object is required in order to create a Deblog instance.");
  }

  const _config: IDeblogConfig = config;
  const _flags = config.logs?.reduce<IFlag>((flags, log) => {
    flags[log.name] = log.enabled ?? true;
    return flags;
  }, {});

  function Deblog(this: IDeblog & { new(): IDeblog}) {
    this.id = _config.id ?? generateId(12);
    this.getConfig = () => _config;
  };

  for (let log of config.logs ?? []) {

    if(!isTLogLevel(log.level)) {
      throw new Error(`Invalid log level: ${log.level}`);
    }

    let flag = log.enabled ?? true;
    let defFlag = flag;
    let tempLog = <TLog><unknown>(function () {
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
  Deblog.prototype.disableAllBut = function (...names: string[]) {
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

  const deblog = new (Deblog as any)(config);
  _config.persist && repository.set(deblog.id, deblog);
  return deblog;
}

/**
 * Returns the deblog instance with the given id.
 * @function getDeblog
 * @param {string} id - The id of the deblog instance. 
 * @returns - A deblog instance corresponding to the id provided or undefined.
 */
export function getDeblog(id: string): IDeblog | undefined {
  return repository.get(id);
}

/**
 * Get all the deblog instances defined so far.
 * @function getAllDeblogs
 * @returns - An array of all the deblog instances.
 */
export function getDeblogs(): IDeblog[] {
  return Array.from(repository.values());
}

/**
 * Remove all the deblg instances saved in the internal repository.
 * @function removeAllDeblogs
 */
export function clearDeblogs() {
  repository.clear();
}