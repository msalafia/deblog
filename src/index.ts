export enum LogLevels {
  LOG = "log",
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
}

type TLogLevel = LogLevels |  "log" | "debug" | "info" | "warn" | "error";

export interface ILogConfig {
  name: string,
  level: TLogLevel,
  tag: string,
  enabled: boolean,
}

export interface IDeblogConfig {
  logs: ILogConfig[]
}

export type IDeblog = {
  getConfig(): IDeblogConfig;
  enable(name: string): void;
  disable(name: string): void;
  restore(name: string): void;
  disableAllBut(...names: string[]): void;
  restoreAll(): void;
  [k: string]: any
}

export interface IFlag {
  [name: string]: boolean;
}

export type TLog = {
  enable(): void;
  disable(): void;
  restore(): void;
}

function isTLogLevel(level: string): level is TLogLevel {
  return ["log", "debug", "info", "warn", "error"].indexOf(level) !== -1;
}

export function createDeblog(config: IDeblogConfig): IDeblog {
  const _config: IDeblogConfig = config;
  const _flags = config.logs.reduce<IFlag>((flags, log) => {
    flags[log.name] = log.enabled;
    return flags;
  }, {});

  function Deblog(this: IDeblog & { new(): IDeblog}, config: ILogConfig) {

    this.getConfig = () => _config;
  };

  for (let log of config.logs) {

    if(!isTLogLevel(log.level)) {
      throw new Error(`Invalid log level: ${log.level}`);
    }

    let flag = log.enabled;
    let defFlag = log.enabled;
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

const configuration: IDeblogConfig = {
  logs: [
    {
      name: "wwm",
      level: "debug",
      tag: "WWM Client -",
      enabled: true,
    },
    {
      name: "vsm",
      level: "log",
      tag: `[${new Date(Date.now()).toLocaleTimeString()}] WWM VSM -`,
      enabled: true,
    },
  ],
};

let log = createDeblog(configuration);

log.disableAllBut();
log.wwm("1 Errore nella connessione: ", { error: "errore pazzesco" });
log.vsm("Errore nella video-sync: ", {
  error: "Questa video-sync è una merda",
});
log.wwm("2 Errore nella connessione: ", { error: "errore pazzesco" });

log.wwm("3 Errore nella connessione: ", { error: "errore pazzesco" });
log.restoreAll();
log.vsm("Errore nella video-sync: ", {
  error: "Questa video-sync è una merda",
});
log.wwm("4 Errore nella connessione: ", { error: "errore pazzesco" });