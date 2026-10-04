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

export const condominiosTable = pgTable('condominios', {
  ...id,
  razaoSocial: varchar('razao_social', { length: 255 }).notNull(),
  nomeFantasia: varchar('nome_fantasia', { length: 255 }).notNull(),
  cnpj: varchar('cnpj', { length: 14 }).notNull().unique(),
  logradouro: varchar('logradouro', { length: 255 }).notNull(),
  bairro: varchar('bairro', { length: 255 }).notNull(),
  numero: varchar('numero', { length: 10 }),
  complemento: varchar('complemento', { length: 255 }),
  cidade: varchar('cidade', { length: 255 }).notNull(),
  cep: varchar('cep', { length: 8 }).notNull(),
  uf: varchar('uf', { length: 2 }).notNull(),
  ...timestamps,
});
