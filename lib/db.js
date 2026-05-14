// Neutralisation temporaire pour forcer le premier affichage
const db = {
  prepare: () => ({ run: () => ({}), all: () => [], get: () => null }),
  exec: () => ({})
};
export default db;
