export type getter = <T>(key: string) => Promise<T | null>;

export type setter = <T>(key: string, value: T) => Promise<void>;

export type deleter = (key: string) => Promise<void>;
