import { db } from '$lib/server/database';
import { userTable, type NewUser } from '$lib/server/database/schema/auth';
import { eq } from 'drizzle-orm';

export async function getUserByUsername(username: string) {
  const data = await db.query.userTable.findFirst({
    where: (users, { eq }) => eq(users.username, username)
  });
  return data;
}

export async function createUser(data: NewUser) {
  await db.insert(userTable).values(data);
}

export async function updateUserById(data: Partial<NewUser>, id: string) {
  await db.update(userTable).set(data).where(eq(userTable.id, id));
}

export async function deleteUserById(id: string) {
  await db.delete(userTable).where(eq(userTable.id, id));
}
