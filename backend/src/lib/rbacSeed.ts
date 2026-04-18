import { Permission } from "../models/Permission";
import { Role } from "../models/Role";

export async function seedRbacDefaults(): Promise<void> {
  const permissions = [
    { key: "admin:all", label: "Accès total (admin)" },
    { key: "contact:read", label: "Voir les demandes de contact" },
    { key: "contact:review", label: "Marquer traité" },
    { key: "cms:write", label: "Modifier le contenu du site" },
    { key: "users:manage", label: "Gérer les utilisateurs" },
  ] as const;

  for (const p of permissions) {
    await Permission.findOneAndUpdate(
      { key: p.key },
      { key: p.key, label: p.label, active: true },
      { upsert: true },
    );
  }

  await Role.findOneAndUpdate(
    { key: "admin" },
    { key: "admin", label: "Administrateur", permissions: ["*"], active: true },
    { upsert: true },
  );
  await Role.findOneAndUpdate(
    { key: "user" },
    { key: "user", label: "Utilisateur", permissions: [], active: true },
    { upsert: true },
  );
}

