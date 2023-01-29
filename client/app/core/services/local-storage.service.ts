import * as crypto from 'crypto-js';
import { Injectable } from '@angular/core';
import {
  AbstractStorage,
  StorageSecretKeys,
  APP_STORAGE_PREFIX,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService implements AbstractStorage {
  private readonly storage: Storage;
  readonly secret: string;

  constructor() {
    this.storage = window.localStorage;
    this.secret = StorageSecretKeys.LOCAL;
  }

  get length(): number {
    return this.storage.length;
  }

  getItem(key: string) {
    let res = null;

    const encryptedData = this.storage.getItem(
      `${APP_STORAGE_PREFIX}${key.toUpperCase()}`
    );

    if (encryptedData) {
      const bytes = crypto.AES.decrypt(encryptedData, this.secret);
      res = bytes.toString(crypto.enc.Utf8);
    }

    return res;
  }

  removeItem(key: string): void {
    this.storage.removeItem(`${APP_STORAGE_PREFIX}${key.toUpperCase()}`);
  }

  setItem(key: string, value: string): void {
    const encryptedData = crypto.AES.encrypt(value, this.secret).toString();
    this.storage.setItem(
      `${APP_STORAGE_PREFIX}${key.toUpperCase()}`,
      encryptedData
    );
  }

  clear(): void {
    this.storage.clear();
  }

  key(index: number): string | null {
    return this.storage.key(index);
  }

  loadInitialState() {
    return Object.keys(this.storage).reduce((state: any, storageKey) => {
      if (storageKey.includes(APP_STORAGE_PREFIX)) {
        const stateKeys = storageKey
          .replace(APP_STORAGE_PREFIX, '')
          .toLowerCase()
          .split('.')
          .map((key) =>
            key
              .split('-')
              .map((token, index) =>
                index === 0
                  ? token
                  : token.charAt(0).toUpperCase() + token.slice(1)
              )
              .join('')
          );
        let currentStateRef = state;
        stateKeys.forEach((key, index) => {
          if (index === stateKeys.length - 1) {
            const value = this.getItem(
              storageKey.replace(APP_STORAGE_PREFIX, '')
            ) as string;

            try {
              currentStateRef[key] = JSON.parse(value);
            } catch (error) {
              currentStateRef[key] = value;
            }
          }

          currentStateRef[key] = currentStateRef[key] || {};
          currentStateRef = currentStateRef[key];
        });
      }
      return state;
    }, {});
  }

}
