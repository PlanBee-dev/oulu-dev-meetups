import { z } from 'zod';

export const envSchema = z.object({
  GITHUB_APP_ID: z.string(),
  GITHUB_APP_PRIVATE_KEY: z.string(),
  GITHUB_APP_INSTALLATION_ID: z.string().transform(Number),
  ALLOWED_ORIGIN: z.string(),
});

export type Env = z.infer<typeof envSchema>;

export async function parseEnv(env: unknown): Promise<
  | {
      env?: never;
      errorResponse: globalThis.Response;
    }
  | {
      env: Env;
      errorResponse?: never;
    }
> {
  const envSchemaResult = await envSchema.safeParseAsync(env);

  if (!envSchemaResult.success) {
    console.log(
      'Invalid environment variables',
      JSON.stringify(envSchemaResult.error.flatten().fieldErrors, null, 2),
    );

    return {
      errorResponse: new global.Response(undefined, { status: 500 }),
    };
  }

  return { env: envSchemaResult.data };
}
