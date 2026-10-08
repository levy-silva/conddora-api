import 'dotenv/config';

import { Faker, en, pt_BR } from '@faker-js/faker';
import { hashSync } from 'bcrypt';

import { db } from '.';
import { condominiosTable, rolesTable, usersTable } from './schema';
import { eq } from 'drizzle-orm';

const f = new Faker({
  locale: [pt_BR, en],
});

const createUsers = () => {
  const users: {
    name: string;
    email: string;
    passwordHash: string;
  }[] = Array.from({ length: 30 }).map((_, i) => ({
    name: f.person.fullName(),
    email: f.internet.email().toLowerCase(),
    passwordHash: hashSync(`0${i}`, 10),
  }));

  return users;
};

const createCondominios = () => {
  const condominios: {
    razaoSocial: string;
    nomeFantasia: string;
    cnpj: string;
    logradouro: string;
    bairro: string;
    numero: string;
    complemento: string | null;
    cidade: string;
    cep: string;
    uf: string;
  }[] = Array.from({ length: 30 }).map(() => ({
    razaoSocial: f.company.name(),
    nomeFantasia: f.company.name(),
    cnpj: f.string.numeric(14),
    logradouro: f.location.streetAddress(),
    bairro: f.location.street(),
    numero: f.string.numeric({ length: { min: 1, max: 4 } }),
    complemento: f.helpers.arrayElement([
      null,
      'Bloco A',
      'Bloco B',
      'Torre 1',
      'Torre 2',
      'Casa 01',
    ]),
    cidade: f.location.city(),
    cep: f.string.numeric(8),
    uf: f.location.state({ abbreviated: true }),
  }));

  return condominios;
};

const populate = async () => {
  // Generate everything first.
  const users = createUsers();
  const condominios = createCondominios();

  if ((await db.query.usersTable.findMany()).length < 1) {
    // Hash the fixed admin password before starting the transaction.
    const adminPasswordHash = hashSync('admin123', 10);

    // Database operations only.
    await db.transaction(async (tx) => {
      await tx
        .insert(rolesTable)
        .values([
          { name: 'ADMIN' },
          { name: 'CONDOMINO' },
          { name: 'SINDICO' },
          { name: 'FUNCIONARIO' },
        ]);

      const adminRole = await tx.query.rolesTable.findFirst({
        where: eq(rolesTable.name, 'ADMIN'),
        columns: { id: true },
      });

      if (!adminRole) {
        throw new Error('ADMIN role was not created.');
      }

      await tx.insert(usersTable).values({
        name: 'Admin',
        email: 'admin@email.com',
        passwordHash: adminPasswordHash,
        roleId: adminRole?.id,
      });

      await tx.insert(usersTable).values(users);

      await tx.insert(condominiosTable).values(condominios);
    });

    console.log('Database populated successfully');
  } else {
    return console.log('Database is already populated');
  }
};

populate().catch((error) => {
  console.error('Error populating database:', error);
  process.exitCode = 1;
});
