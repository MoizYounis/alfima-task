import type { Auth } from './auth';

export type FlashProps = {
    success?: string;
    error?: string;
};

export type PageProps = {
    name?: string;
    auth?: Auth;
    flash?: FlashProps;
    errors?: Record<string, string>;
    [key: string]: unknown;
};

