// IndexedDB wrapper for robust client-side storage
// Replaces localStorage for larger capacity, better performance, and reliability

const DB_NAME = "voiceCA_db";
const DB_VERSION = 1;
const STORES = {
  entries: "entries",
  onboarding: "onboarding",
  user: "user",
  settings: "settings",
};

let db = null;

// Initialize IndexedDB
async function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = event.target.result;

      // Create object stores if they don't exist
      if (!database.objectStoreNames.contains(STORES.entries)) {
        const entriesStore = database.createObjectStore(STORES.entries, {
          keyPath: "id",
          autoIncrement: false,
        });
        entriesStore.createIndex("createdAt", "createdAt", { unique: false });
        entriesStore.createIndex("type", "type", { unique: false });
      }

      if (!database.objectStoreNames.contains(STORES.onboarding)) {
        database.createObjectStore(STORES.onboarding, { keyPath: "id" });
      }

      if (!database.objectStoreNames.contains(STORES.user)) {
        database.createObjectStore(STORES.user, { keyPath: "id" });
      }

      if (!database.objectStoreNames.contains(STORES.settings)) {
        database.createObjectStore(STORES.settings, { keyPath: "key" });
      }
    };
  });
}

// Ensure DB is initialized
async function getDB() {
  if (!db) {
    await initDB();
  }
  return db;
}

// Save entry
export async function saveEntry(entry) {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORES.entries], "readwrite");
    const store = transaction.objectStore(STORES.entries);
    const request = store.add({
      ...entry,
      createdAt: entry.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

// Get all entries
export async function getAllEntries() {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORES.entries], "readonly");
    const store = transaction.objectStore(STORES.entries);
    const index = store.index("createdAt");
    const request = index.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      // Reverse to get newest first
      resolve(request.result.reverse());
    };
  });
}

// Update entry
export async function updateEntry(id, updates) {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORES.entries], "readwrite");
    const store = transaction.objectStore(STORES.entries);
    const request = store.get(id);

    request.onsuccess = () => {
      const entry = request.result;
      if (entry) {
        const updated = { ...entry, ...updates, updatedAt: new Date().toISOString() };
        const updateRequest = store.put(updated);
        updateRequest.onerror = () => reject(updateRequest.error);
        updateRequest.onsuccess = () => resolve(updated);
      } else {
        reject(new Error("Entry not found"));
      }
    };
    request.onerror = () => reject(request.error);
  });
}

// Delete entry
export async function deleteEntry(id) {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORES.entries], "readwrite");
    const store = transaction.objectStore(STORES.entries);
    const request = store.delete(id);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

// Save onboarding data
export async function saveOnboarding(data) {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORES.onboarding], "readwrite");
    const store = transaction.objectStore(STORES.onboarding);
    const request = store.put({
      id: "onboarding",
      ...data,
      savedAt: new Date().toISOString(),
    });

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

// Get onboarding data
export async function getOnboarding() {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORES.onboarding], "readonly");
    const store = transaction.objectStore(STORES.onboarding);
    const request = store.get("onboarding");

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result || null);
  });
}

// Save user data
export async function saveUser(user) {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORES.user], "readwrite");
    const store = transaction.objectStore(STORES.user);
    const request = store.put({
      id: "user",
      ...user,
      lastLogin: new Date().toISOString(),
    });

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

// Get user data
export async function getUser() {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORES.user], "readonly");
    const store = transaction.objectStore(STORES.user);
    const request = store.get("user");

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result || null);
  });
}

// Save setting
export async function saveSetting(key, value) {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORES.settings], "readwrite");
    const store = transaction.objectStore(STORES.settings);
    const request = store.put({ key, value, savedAt: new Date().toISOString() });

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

// Get setting
export async function getSetting(key) {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORES.settings], "readonly");
    const store = transaction.objectStore(STORES.settings);
    const request = store.get(key);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result?.value || null);
  });
}

// Clear all data (for logout/reset)
export async function clearAllData() {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(
      [STORES.entries, STORES.onboarding, STORES.user, STORES.settings],
      "readwrite"
    );

    const clearStores = async () => {
      for (const storeName of Object.values(STORES)) {
        const store = transaction.objectStore(storeName);
        store.clear();
      }
    };

    clearStores();

    transaction.onerror = () => reject(transaction.error);
    transaction.oncomplete = () => resolve();
  });
}

// Export data as JSON (for backup)
export async function exportData() {
  const entries = await getAllEntries();
  const onboarding = await getOnboarding();
  const user = await getUser();

  return {
    version: 1,
    exportDate: new Date().toISOString(),
    entries,
    onboarding,
    user,
  };
}

// Import data from JSON (for restore)
export async function importData(data) {
  await clearAllData();

  if (data.user) await saveUser(data.user);
  if (data.onboarding) await saveOnboarding(data.onboarding);
  if (data.entries && Array.isArray(data.entries)) {
    for (const entry of data.entries) {
      await saveEntry(entry);
    }
  }
}
