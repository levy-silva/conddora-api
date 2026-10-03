import 'dotenv/config';
import { seed } from 'drizzle-seed';
import * as schema from './schema';
import { db } from '.';

const populate = async () => {
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
  }));
};

populate();
