export enum LogLevels {
  LOG = "log",
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
}

export type TLogLevel = LogLevels |  "log" | "debug" | "info" | "warn" | "error";

export interface ILogConfig {
  name: string,
  level: TLogLevel,
  tag?: string,
  enabled?: boolean,

}

export interface IDeblogConfig {
  logs?: ILogConfig[]
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