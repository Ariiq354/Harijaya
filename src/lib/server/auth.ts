import { Lucia, TimeSpan } from 'lucia';
import { dev } from '$app/environment';
import { adapter } from '$lib/server';

export const lucia = new Lucia(adapter, {
  sessionExpiresIn: new TimeSpan(15, 'm'),
  sessionCookie: {
    attributes: {
      secure: !dev
    }
  },
  getUserAttributes: (attributes) => {
    return {
      // attributes has the type of DatabaseUserAttributes
      username: attributes.username
    };
  }
});

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  username: string;
}
