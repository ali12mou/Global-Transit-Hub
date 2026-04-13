/**
 * À exécuter avec mongosh (MongoDB Shell) :
 *   mongosh "mongodb://127.0.0.1:27017/global" mongosh-seed-user.js
 *
 * Crée la collection `users` dans la base `global` avec l’admin par défaut
 * (identique au seed Node : globaltransit / global12@ → email globaltransit@gtts.local).
 */
const passwordHash =
  "$2b$12$XcBSpnL2gfy3/.P0qlhHK.K7i1CkHQJiMpvEP9ddRY2kKHG28Fu4q";

const email = "globaltransit@gtts.local";
const now = new Date();

const r = db.users.updateOne(
  { email },
  {
    $set: {
      email,
      passwordHash,
      role: "admin",
      updatedAt: now,
    },
    $setOnInsert: {
      createdAt: now,
    },
  },
  { upsert: true },
);

print(`users: matched=${r.matchedCount} modified=${r.modifiedCount} upsertedId=${r.upsertedId}`);
print(`Connexion API / front : utilisateur « globaltransit » ou e-mail ${email} — mot de passe : global12@`);
