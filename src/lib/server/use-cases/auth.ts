import { createUser, getUserByUsername } from '$lib/server/data-access/auth/user';
import { error } from '@sveltejs/kit';
import { generateIdFromEntropySize } from 'lucia';
import { Argon2id } from 'oslo/password';
import type { NewUser } from '$lib/server/database/schema/auth';

export async function loginUseCase(username: string, password: string) {
  const data = await getUserByUsername(username);

  if (!data) {
    error(401, 'Username atau');
  }

  const validPassword = await new Argon2id().verify(data.password, password);

  if (!validPassword) {
    error(401, 'Username atau');
  }

  return data;
}

export async function registerUseCase(username: string, password: string) {
  const data = await getUserByUsername(username);

  if (data) {
    error(409, 'Username sudah ada');
  }

  const userId = generateIdFromEntropySize(10);
  const passwordHash = await new Argon2id().hash(password);

  const inputData: NewUser = {
    id: userId,
    username: username,
    password: passwordHash
  };

  await createUser(inputData);
}
