import { execSync } from 'node:child_process';

export default async function globalSetup() {
  if (process.env.NODE_ENV === 'development') {
    console.log("🐳 Starting isolated test environment...");
    try {
      // Start test containers
      execSync('docker compose -f ../compose.test.yaml up -d', { stdio: 'inherit' });
      
      // Wait a bit for the DB to be ready
      console.log("⏳ Waiting for database to be ready...");
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Seed the test database
      console.log("🌱 Seeding test database...");
      execSync('docker exec backend-test npm run db-reset', { stdio: 'inherit' });
      
      console.log("✅ Isolated test environment is ready at http://localhost:3035");
    } catch (error) {
      console.error("❌ Failed to setup test environment:", error);
      throw error;
    }
  } else {
    console.log("✅ Regular global setup (CI).");
  }
}

