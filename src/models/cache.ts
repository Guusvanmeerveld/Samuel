export type getter = (key: string) => Promise<string | number | null>;

export type setter = (key: string, value: string | number) => Promise<void>;
