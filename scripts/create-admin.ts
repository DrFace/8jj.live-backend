import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../src/users/user.entity';
import { Role } from '../src/users/role.enum';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
  const email = process.argv[2];
  const name = process.argv[3];
  const password = process.argv[4];

  if (!email || !name || !password) {
    console.log(
      'Usage: npm run create:admin -- admin@email.com "Admin Name" "password123"',
    );
    process.exit(1);
  }

  const ds = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [User],
    synchronize: false,
  });

  await ds.initialize();
  const repo = ds.getRepository(User);

  const existing = await repo.findOne({
    where: { email: email.toLowerCase() },
  });
  if (existing) {
    existing.role = Role.ADMIN;
    existing.isActive = true;
    await repo.save(existing);
    console.log(`Updated existing user to ADMIN: ${existing.email}`);
    await ds.destroy();
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = repo.create({
    email: email.toLowerCase(),
    name,
    passwordHash,
    role: Role.ADMIN,
    isActive: true,
  });

  await repo.save(user);
  console.log(`Created ADMIN user: ${user.email}`);

  await ds.destroy();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
