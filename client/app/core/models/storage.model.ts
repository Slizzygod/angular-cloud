export const APP_STORAGE_PREFIX = 'ANGULAR_CLOUD-';

export const StorageSecretKeys = Object.freeze({
  LOCAL: 'TxGhzV6IBhFscu7O' as const,
  SESSION: 'yKgMixc1h745mNs9' as const
});

export abstract class AbstractStorage implements Storage {
  readonly secret: string = '';
  readonly length: number = 0;

  abstract getItem(key: string): any;
  abstract removeItem(key: string): void;
  abstract setItem(key: string, value: string): void;
  abstract clear(): void;
  abstract key(index: number): string | null;
}
