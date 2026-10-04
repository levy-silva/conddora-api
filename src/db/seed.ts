import 'dotenv/config';

import { seed } from 'drizzle-seed';
import * as schema from './schema';

import { db } from '.';
import { hash } from 'bcrypt';

const ufs = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
];

const cidades = [
  'Salvador',
  'Feira de Santana',
  'Lauro de Freitas',
  'Camaçari',
  'Vitória da Conquista',
  'Ilhéus',
  'Itabuna',
];

const bairros = [
  'Stella Maris',
  'Pituba',
  'Itaigara',
  'Imbuí',
  'Brotas',
  'Barra',
  'Ondina',
  'Rio Vermelho',
  'Caminho das Árvores',
  'Costa Azul',
];

const ceps = [
  '40000000',
  '40100000',
  '40200000',
  '40300000',
  '40400000',
  '40500000',
  '40600000',
  '40700000',
  '40800000',
  '40900000',
];

const populate = async () => {
  await db.insert(schema.usersTable).values({
    name: 'Admin',
    email: 'admin@email.com',
    passwordHash: await hash('admin123', 10),
  });

  console.log('Admin user created successfully');

  await seed(db, schema).refine((f) => ({
    usersTable: {
      count: 30,
      columns: {
        id: f.uuid(),
        name: f.fullName(),
        email: f.email(),
        password: f.string(),
      },
    },

    condominiosTable: {
      count: 30,
      columns: {
        id: f.uuid(),

        razaoSocial: f.companyName(),

        nomeFantasia: f.companyName(),

        cnpj: f.string({
          isUnique: true,
        }),

        logradouro: f.streetAddress(),

        bairro: f.valuesFromArray({
          values: bairros,
        }),

        numero: f.number({
          minValue: 1,
          maxValue: 9999,
        }),

        complemento: f.valuesFromArray({
          values: [
            'Bloco A',
            'Bloco B',
            'Torre 1',
            'Torre 2',
            'Casa 01',
            'Casa 02',
          ],
        }),

        cidade: f.valuesFromArray({
          values: cidades,
        }),

        cep: f.valuesFromArray({
          values: ceps,
        }),

        uf: f.valuesFromArray({
          values: ufs,
        }),
      },
    },
  }));

  console.log('Database populated successfully');
};

populate();
