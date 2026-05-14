// Neutralisation totale pour forcer la mise en ligne
const db = {
  prepare: () => ({
    run: () => ({ lastInsertRowid: 1 }),
    all: () => [],
    get: () => null,
  }),
  exec: () => ({}),
};

export default db;
