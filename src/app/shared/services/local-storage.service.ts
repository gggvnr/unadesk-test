import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  #ls = window.localStorage;

  setItem(key: string, value: unknown): void {
    if (value === undefined || value === null) {
      return;
    }

    const strValue = JSON.stringify(value);

    this.#ls.setItem(key, strValue);
  }

  getItem<T = unknown>(key: string): T | null {
    const value = this.#ls.getItem(key) as string;

    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }

  removeItem(key: string): void {
    this.#ls.removeItem(key);
  }

  clear(): void {
    this.#ls.clear();
  }
}
