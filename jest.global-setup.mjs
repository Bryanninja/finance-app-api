import { execSync } from 'child_process';

export default async function () {
  execSync('docker-compose up -d --wait postgres-test');
  execSync('npx dotenv-cli -e .env.test -- npx prisma db push');
}
