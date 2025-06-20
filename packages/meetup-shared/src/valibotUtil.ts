import {
  type BaseSchema,
  type BaseIssue,
  type IssueDotPath,
  flatten,
  type SafeParseResult,
} from 'valibot';
type ValibotErrors<
  TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>,
> = Partial<Record<IssueDotPath<TSchema>, string>>;

export function valibotToHumanUnderstandable<
  TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>,
>(issues: NonNullable<SafeParseResult<TSchema>['issues']>) {
  const flat = flatten<TSchema>(issues);

  const errors: ValibotErrors<TSchema> = {};
  for (const key in flat.nested) {
    errors[key as keyof typeof errors] =
      flat.nested?.[key as keyof typeof flat.nested]?.[0];
  }
  return errors;
}
