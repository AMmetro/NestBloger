import { config } from 'dotenv';
// или
// import * as dotenv from 'dotenv';
// dotenv.config();

config();

export type EnvironmentVariable = { [key: string]: string | undefined };
export type EnvironmentsTypes =
  | 'DEVELOPMENT'
  | 'STAGING'
  | 'PRODUCTION'
  | 'TESTING';
export const Environments = ['DEVELOPMENT', 'STAGING', 'PRODUCTION', 'TESTING'];

export class EnvironmentSettings {
  constructor(private env: EnvironmentsTypes) {}

  getEnv() {
    return this.env;
  }

  isProduction() {
    return this.env === 'PRODUCTION';
  }

  isStaging() {
    return this.env === 'STAGING';
  }

  isDevelopment() {
    return this.env === 'DEVELOPMENT';
  }

  isTesting() {
    return this.env === 'TESTING';
  }
}

class AppSettings {
  constructor(
    public env: EnvironmentSettings,
    public api: APISettings,
  ) {}
}

class APISettings { 
  // Application
  public readonly APP_PORT: number; 
  // Database
  public readonly MONGO_CONNECTION_URI: string;
  public readonly MONGO_CONNECTION_URI_TESTING: string;
  // JWT
  public readonly JWT_ACSS_SECRET: string;
  public readonly JWT_REFRESH_SECRET: string;
  // AUTH
  public readonly LOGIN: string;
  public readonly PASS: string;

  constructor(private readonly envVariables: EnvironmentVariable) {
    // Application
    this.APP_PORT = this.getNumberOrDefault(envVariables.APP_PORT, 7840);
    // Database
    this.MONGO_CONNECTION_URI =
      envVariables.MONGO_CONNECTION_URI ?? 'mongodb://localhost/nest';
    this.MONGO_CONNECTION_URI_TESTING = envVariables.MONGO_CONNECTION_TESTING;
    // JwtAccess
    this.JWT_ACSS_SECRET = envVariables.JWT_ACSS_SECRET ?? '123';
    this.JWT_REFRESH_SECRET = envVariables.JWT_REFRESH_SECRET ?? '456';
    // AUTH
    this.LOGIN = envVariables.LOGIN ?? 'admin';
    this.PASS = envVariables.PASS ?? 'qwerty';
  }

  private getNumberOrDefault(value: string, defaultValue: number): number {
    const parsedValue = Number(value);

    if (isNaN(parsedValue)) {
      return defaultValue;
    }

    return parsedValue;
  }
}

const env = new EnvironmentSettings(
  (Environments.includes(process.env.ENV?.trim())
    ? process.env.ENV.trim()
    : 'DEVELOPMENT') as EnvironmentsTypes,
);

const api = new APISettings(process.env);
export const appSettings = new AppSettings(env, api);
