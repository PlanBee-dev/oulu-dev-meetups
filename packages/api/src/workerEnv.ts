import {
  type Input,
  type Output,
  object,
  string,
  transform,
  url,
  safeParseAsync,
  ValiError,
} from 'valibot';

export const envSchema = object({
  GITHUB_REPO_NAME: string(),
  GITHUB_REPO_OWNER: string(),
  GITHUB_APP_ID: string(),
  GITHUB_APP_PRIVATE_KEY: string(),
  GITHUB_APP_INSTALLATION_ID: transform(string(), (input) => {
    const number = Number(input);

    if (Number.isNaN(number)) {
      throw new ValiError([
        {
          input,
          message: 'Must be a number',
          origin: 'value',
          reason: 'type',
          validation: 'number',
        },
      ]);
    }

    return number;
  }),
  ALLOWED_ORIGIN: string([url()]),
});

export type Env = Output<typeof envSchema>;
export type EnvInput = Input<typeof envSchema>;

export async function parseEnv(unsafeEnv: unknown): Promise<
  | {
      env?: never;
      errorResponse: globalThis.Response;
    }
  | {
      env: Env;
      errorResponse?: never;
    }
> {
  const envSchemaResult = await safeParseAsync(envSchema, unsafeEnv);

  if (!envSchemaResult.success) {
    console.error(
      'Invalid environment variables',
      JSON.stringify(
        envSchemaResult.error.issues.map((i) => ({
          variable: i.path?.flatMap((p) => p.key as string).join('.'),
          error: i.message,
          expectedType: i.validation,
        })),
        null,
        2,
      ),
    );

    return { errorResponse: new Response(undefined, { status: 500 }) };
  }

  return { env: envSchemaResult.data };
}
