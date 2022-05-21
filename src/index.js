function createDeblog(config) {
  function Deblog(config) {
    this._config = config;

    this._flags = config.logs.reduce((flags, log) => {
      flags[log.name] = log.enabled;
      return flags;
    }, {});

    this.getConfig = () => this._config;
  }

  for (let log of config.logs) {
    let flag = log.enabled;
    let defFlag = log.enabled;
    let tempLog = function () {
      flag && console[log.level](`${log.tag}`, ...arguments);
    };
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

const configuration = {
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
