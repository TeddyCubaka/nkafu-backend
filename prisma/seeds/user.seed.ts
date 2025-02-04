import * as bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password, salt);

  return hash;
}

async function loader() {
  try {
    const password = process.env.AUTH_PASSWORD || 'password12345';
    const hashedPassword = await hashPassword(password);
    await prisma.user.upsert({
      where: { name: 'admin' },
      update: {
        password: hashedPassword,
      },
      create: {
        name: 'admin',
        password: hashedPassword,
        mail: process.env.AUTH_EMAIL || 'admin@local',
        mobile: process.env.AUTH_PHONE || '0000000000',
        isActive: true,
      },
    });
    console.log('user created succefully');
  } catch (error) {
    console.log('user creation failed');
    console.error(error);
  }
}

loader();
