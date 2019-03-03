
const conf = {
  appenders: {
    console: {
      type: "console"
    },
    access: {
      type: "dateFile",
      filename: "logs/access",
      pattern: "-yyyy-MM-dd.log",
      alwaysIncludePattern: true,
      layout: { type: "pattern", pattern: "[%d{yyyy-MM-dd hh:mm:ss} %5.5p] %m" }
    },
    app: {
      type: "file",
      filename: "logs/app.log",
      maxLogSize: 10485760,
      numBackups: 3
    },
    errorFile: { type: "file", filename: "logs/errors.log" },
    errors: { type: "logLevelFilter", level: "error", appender: "errorFile" },
    db: {
      type: "DateFile",
      filename: "logs/db",
      pattern: "-yyyy-MM-dd.log",
      alwaysIncludePattern: true,
      layout: { type: "pattern", pattern: "[%d{yyyy-MM-dd hh:mm:ss} %5.5p] %m" }
    },
    api: {
      type: "DateFile",
      filename: "logs/api",
      pattern: "-yyyy-MM-dd.log",
      alwaysIncludePattern: true,
      layout: { type: "pattern", pattern: "[%d{yyyy-MM-dd hh:mm:ss} %5.5p] %m" }
    }
  },
  categories: {
    default: {
      appenders: ["console"],
      level: "all"
    },
    access: {
      appenders: ["console", "access", 'errors'],
      level: "info"
    },
    db: {
      appenders: ["console", "app", "db"],
      level: "info"
    },
    api: {
      appenders: ["console", "app", "api"],
      level: "trace"
    }
  }
};

module.exports = conf;

module.exports = conf;
