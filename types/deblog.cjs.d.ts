declare enum LogLevels {
    LOG = "log",
    DEBUG = "debug",
    INFO = "info",
    WARN = "warn",
    ERROR = "error"
}
type TLogLevel = LogLevels | "log" | "debug" | "info" | "warn" | "error";
interface ILogConfig {
    name: string;
    level: TLogLevel;
    tag?: string;
    enabled?: boolean;
}
interface IDeblogConfig {
    id?: string;
    logs?: ILogConfig[];
    persist?: boolean;
}
interface IDeblog {
    id: string;
    getConfig(): IDeblogConfig;
    disableAllBut(...names: string[]): void;
    restoreAll(): void;
    [k: string]: any | TLog;
}
interface IFlag {
    [name: string]: boolean;
}
type TLog = ((...args: any[]) => void) & {
    enable(): void;
    disable(): void;
    restore(): void;
};
interface IDynamicLogs {
    [log: string]: TLog;
}
/**
 * A factory method that returns a Deblog instance on the basis of the
 * configuration object provided.
 * @function createDeblog
 * @template T A convenient type exposing the logging methods speicifed in ten configuration.
 * @param {IDeblogConfig} config - The configuration object for the deblog instance.
 * @return {IDeblog} - The deblog instance.
 */
declare function createDeblog<T extends IDynamicLogs>(config: IDeblogConfig): IDeblog & T;
/**
 * Returns the deblog instance with the given id.
 * @function getDeblog
 * @param {string} id - The id of the deblog instance.
 * @returns - A deblog instance corresponding to the id provided or undefined.
 */
declare function getDeblog(id: string): IDeblog | undefined;
/**
 * Get all the deblog instances defined so far.
 * @function getAllDeblogs
 * @returns - An array of all the deblog instances.
 */
declare function getDeblogs(): IDeblog[];
/**
 * Remove all the deblg instances saved in the internal repository.
 * @function removeAllDeblogs
 */
declare function clearDeblogs(): void;
export { LogLevels, TLogLevel, ILogConfig, IDeblogConfig, IDeblog, IFlag, TLog, IDynamicLogs, createDeblog, getDeblog, getDeblogs, clearDeblogs };
//# sourceMappingURL=deblog.cjs.d.ts.map