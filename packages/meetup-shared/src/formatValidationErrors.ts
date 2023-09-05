import { Issues } from "valibot";

export function formatValidationErrors(issues: Issues) {
	return issues.map((issue) => ({
		message: issue.message,
		expectedType: issue.validation,
		path: issue.path
			?.flatMap((p) => (typeof p.key === "string" ? p.key : ""))
			.join("."),
	}));
}

export type ValidationErrors = ReturnType<typeof formatValidationErrors>;
