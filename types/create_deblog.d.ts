import { IDeblog, IDeblogConfig, IDynamicLogs } from "./types";
/**
 * A factory method that returns a Deblog instance on the basis of the
 * configuration object provided.
 *
 * @export
 * @param {IDeblogConfig} config - The configuration object for the deblog instance.
 * @return {IDeblog} - The deblog instance.
 */
export declare function createDeblog<T extends IDynamicLogs>(config: IDeblogConfig): IDeblog & T;
//# sourceMappingURL=create_deblog.d.ts.map