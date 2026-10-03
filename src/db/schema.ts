import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { v7 as uuidV7 } from 'uuid';

const id = {
  id: uuid('id')
    .primaryKey()
    .$defaultFn(() => uuidV7()),
};

const timestamps = {
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
};

export const usersTable = pgTable('users', {
  ...id,
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 200 }).notNull(),
  ...timestamps,
});
