import { IDeblog, IDeblogConfig, IFlag, ILogConfig, TLog, TLogLevel } from "./types";

function isTLogLevel(level: string): level is TLogLevel {
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
export function createDeblog(config: IDeblogConfig): IDeblog {
  if (!config) {
    throw new Error("A configuration object is required in order to create a Deblog instance.");
  }

  const _config: IDeblogConfig = config;
  const _flags = config.logs?.reduce<IFlag>((flags, log) => {
    flags[log.name] = log.enabled ?? true;
    return flags;
  }, {});

  function Deblog(this: IDeblog & { new(): IDeblog}) {

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

    Deblog.prototype.disableAllBut = function (...names: string[]) {
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

  return new (Deblog as any)(config);
}