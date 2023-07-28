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
      errorResponse: Response;
    }
  | {
      env: z.infer<typeof envSchema>;
      errorResponse?: never;
    }
> {
  const envSchemaResult = await envSchema.safeParseAsync(env);

  if (!envSchemaResult.success) {
    console.log(
      'Invalid environment variables',
      envSchemaResult.error.flatten().fieldErrors,
    );

    return {
      errorResponse: new Response(undefined, { status: 500 }),
    };
  }

  return { env: envSchemaResult.data };
}
