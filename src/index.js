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
    Deblog.prototype[log.name] = function () {
      this._flags[log.name] && console[log.level](`${log.tag}`, ...arguments);
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
      tag: "WWM VSM -",
      enabled: true,
    },
  ],
};

let log = createDeblog(configuration);

log.wwm("Errore nella connessione: ", { error: "errore pazzesco" });
log.vsm("Errore nella video-sync: ", {
  error: "Questa video-sync è una merda",
});
