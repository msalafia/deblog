let { createDeblog } = require("../dist/deblog.cjs");

const configuration = {
  logs: [
    {
      name: "wwm",
      level: "debug",
      tag: "WWM Client -",
    },
    {
      name: "vsm",
      level: "log",
      tag: `[${new Date(Date.now()).toLocaleTimeString()}] WWM VSM -`,
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
