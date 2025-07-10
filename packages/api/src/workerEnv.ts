import { valibotToHumanUnderstandable } from 'meetup-shared';
import {
  object,
  safeParseAsync,
  string,
  transform,
  url,
  type InferInput,
  type InferOutput,
  pipe,
} from 'valibot';

export const envSchema = object({
  GITHUB_REPO_NAME: string(),
  GITHUB_REPO_OWNER: string(),
  GITHUB_APP_ID: string(),
  GITHUB_APP_PRIVATE_KEY: string(),
  GITHUB_APP_INSTALLATION_ID: pipe(string(), transform(Number)),
  ALLOWED_ORIGIN: pipe(string(), url()),
});

export type Env = InferOutput<typeof envSchema>;
export type EnvInput = InferInput<typeof envSchema>;

export async function parseEnv(
  unsafeEnv: unknown,
): Promise<{ errorResponse: Response } | { env: Env }> {
  const envSchemaResult = await safeParseAsync(envSchema, unsafeEnv);

  if (!envSchemaResult.success) {
    console.error(
      'Invalid environment variables',
      JSON.stringify(
        valibotToHumanUnderstandable(envSchemaResult.issues),
        null,
        2,
      ),
    );

    return { errorResponse: new Response(undefined, { status: 500 }) };
  }

  return { env: envSchemaResult.output };
}
