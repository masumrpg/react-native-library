export interface CompliantUser {
  id: string;
  name: string;
  roles: readonly string[];
}

export function formatUserData(user: CompliantUser): string {
  const formattedRoles = user.roles.join(", ");
  return `User ${user.name} (ID: ${user.id}) has roles: ${formattedRoles}`;
}

export async function fetchUserAsync(id: string): Promise<CompliantUser> {
  return Promise.resolve({
    id,
    name: "Ma'sum",
    roles: ["maintainer", "author"],
  });
}
