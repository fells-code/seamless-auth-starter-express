import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from "@aws-sdk/client-secrets-manager";

import getLogger from "./logger";

const isProduction = process.env.NODE_ENV === "production";
const logger = getLogger("secrets_manager");

type CachedSecret = { value: string; timestamp: number };
const secretsCache: Record<string, CachedSecret> = {};

const CACHE_TTL_MS = 10 * 60 * 1000;

export async function getClientSecret(key: string): Promise<string> {
  const secretName = key;

  // If there isn't a secret we can go ahead and bomb out.
  if (!secretName) {
    logger.error("No secret to look for!");
    throw new Error("Failed to find an secret for grabbing values");
  }

  if (!isProduction) {
    const value = process.env[secretName];
    if (!value) {
      logger.error("Secrect not found");
      throw new Error(`Missing local secret: ${secretName}`);
    }
    return value;
  }

  if (
    secretsCache[secretName] &&
    Date.now() - secretsCache[secretName].timestamp < CACHE_TTL_MS
  ) {
    return secretsCache[secretName].value;
  }

  const secretMgr = new SecretsManagerClient({
    region: process.env.REGION,
  });

  const command = new GetSecretValueCommand({ SecretId: secretName });

  const response = await secretMgr.send(command);
  if (!response.SecretString) {
    logger.error(`Failed to pull secret ${key}`);
    throw new Error(`Secret ${secretName} is empty`);
  }

  const value = response.SecretString!;
  secretsCache[secretName] = { value, timestamp: Date.now() };
  return response.SecretString;
}
