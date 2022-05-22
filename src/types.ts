export enum LogLevels {
  LOG = "log",
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
}

export type TLogLevel = LogLevels |  "log" | "debug" | "info" | "warn" | "error";

export interface ILogConfig {
  name: string;
  level: TLogLevel;
  tag?: string;
  enabled?: boolean;
}

export interface IDeblogConfig {
  id?: string;
  logs?: ILogConfig[];
  persist?: boolean;
}

export interface IDeblog {
  id: string;
  getConfig(): IDeblogConfig;
  disableAllBut(...names: string[]): void;
  restoreAll(): void;
  [k: string]: any | TLog;
}

export interface IFlag {
  [name: string]: boolean;
}

export type TLog = ((...args: any[]) => void) & {
  enable(): void;
  disable(): void;
  restore(): void;
}

export interface IDynamicLogs {
  [log: string]: TLog;
}