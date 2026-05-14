// Neutralisation de SQLite pour forcer le déploiement Vercel
const db = {
  prepare: (sql) => {
    console.log("Mock DB call:", sql);
    return {
      run: () => ({ lastInsertRowid: Date.now(), changes: 1 }),
      all: () => [],
      get: () => null,
    };
  },
  exec: (sql) => {
    console.log("Mock DB exec:", sql);
    return {};
  },
};

export default db;
