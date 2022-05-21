export declare enum LogLevels {
    LOG = "log",
    DEBUG = "debug",
    INFO = "info",
    WARN = "warn",
    ERROR = "error"
}
export declare type TLogLevel = LogLevels | "log" | "debug" | "info" | "warn" | "error";
export interface ILogConfig {
    name: string;
    level: TLogLevel;
    tag?: string;
    enabled?: boolean;
}
export interface IDeblogConfig {
    logs?: ILogConfig[];
}
export interface IDeblog {
    getConfig(): IDeblogConfig;
    disableAllBut(...names: string[]): void;
    restoreAll(): void;
    [k: string]: any | TLog;
}
export interface IFlag {
    [name: string]: boolean;
}
export declare type TLog = ((...args: any[]) => void) & {
    enable(): void;
    disable(): void;
    restore(): void;
};
export interface IDynamicLogs {
    [log: string]: TLog;
}
//# sourceMappingURL=types.d.ts.map