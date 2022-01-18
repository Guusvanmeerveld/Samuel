export type getter = <T>(key: string) => Promise<T | null>;

/**
 * @param expires Time in ms
 */
export type setter = <T>(key: string, value: T, expires?: number) => Promise<void>;

export type unsetter = (key: string) => Promise<void>;
