export function validateEnvVariables(): void {
  const requiredEnvVariables: string[] = [
    'JWT_REFRESH',
    'JWT_ACCESS',
    'SALT_ROUNDS',
    'DATABASE_URL',
    'PORT',
  ];

  const missingVariables: string[] = [];

  for (const varName of requiredEnvVariables) {
    if (!process.env[varName] || process.env[varName] === '') {
      missingVariables.push(varName);
    }
  }

  if (missingVariables.length > 0) {
    throw new Error(
      `FATAL ERROR: Missing required environment variables: ${missingVariables.join(', ')}`
    );
  }
}
