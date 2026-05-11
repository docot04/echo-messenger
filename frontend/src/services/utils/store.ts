const DB_NAME = import.meta.env.VITE_APP_NAME;
const STORE_NAME = import.meta.env.VITE_STORE_NAME;
const DB_VERSION = Number(import.meta.env.VITE_DB_VERSION);
const TOKEN_KEY = "token";
const USER_ID_KEY = "userId";
const SETTINGS_KEY = "settings";
export type Settings = {
  theme: "light" | "dark";
  language: string;
};
const defaultSettings: Settings = {
  theme: "dark",
  language: "en",
};
type DBAction = "get" | "set" | "delete";

// IndexedDB
const openDB = (): Promise<IDBDatabase> =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

const privateKeyStore = async ({
  action,
  userId,
  value,
}: {
  action: DBAction;
  userId: string;
  value?: CryptoKey;
}): Promise<CryptoKey | null | void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(
      STORE_NAME,
      action === "get" ? "readonly" : "readwrite",
    );

    const store = tx.objectStore(STORE_NAME);
    const key = `privateKey:${userId}`;
    let request: IDBRequest;

    switch (action) {
      case "get":
        request = store.get(key);
        request.onsuccess = () => resolve(request.result || null);
        break;

      case "set":
        request = store.put(value, key);
        tx.oncomplete = () => resolve();
        break;

      case "delete":
        request = store.delete(key);
        tx.oncomplete = () => resolve();
        break;
    }

    request.onerror = () => reject(request.error);
  });
};

// localStorage
const storage = {
  get<T>(key: string, fallback?: T): T | null {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback ?? null;

    try {
      return JSON.parse(raw);
    } catch {
      return raw as T;
    }
  },

  set(key: string, value: unknown) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  remove(key: string) {
    localStorage.removeItem(key);
  },
};

// auth store (token, id)
export const authStore = {
  token: {
    get: () => storage.get<string>(TOKEN_KEY),

    set: (token: string) => storage.set(TOKEN_KEY, token),

    clear: () => storage.remove(TOKEN_KEY),
  },

  userId: {
    get: () => storage.get<string>(USER_ID_KEY),

    set: (userId: string) => storage.set(USER_ID_KEY, userId),

    clear: () => storage.remove(USER_ID_KEY),
  },

  clearAll() {
    this.token.clear();
    this.userId.clear();
  },
};

// settings store (misc)
export const settingsStore = {
  get: () => storage.get<Settings>(SETTINGS_KEY, defaultSettings)!,

  update: (partial: Partial<Settings>): Settings => {
    const updated = {
      ...settingsStore.get(),
      ...partial,
    };

    storage.set(SETTINGS_KEY, updated);

    return updated;
  },

  clear: () => storage.remove(SETTINGS_KEY),
};

// private keys
export const keyStore = {
  get: (userId: string) =>
    privateKeyStore({
      action: "get",
      userId,
    }) as Promise<CryptoKey | null>,

  set: (userId: string, privateKey: CryptoKey) =>
    privateKeyStore({
      action: "set",
      userId,
      value: privateKey,
    }),

  clear: (userId: string) =>
    privateKeyStore({
      action: "delete",
      userId,
    }),
};
