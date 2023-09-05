import {
	MeetupFormValues,
	getMeetupIssueBody,
	meetupFormValuesSchema,
} from "meetup-shared";
import { App } from "octokit";
import { safeParseAsync } from "valibot";
import { Env } from "./workerEnv";

export async function parseCreateIssueReqBody(
	req: Request,
): Promise<{ errorResponse: Response } | { parsedMeetup: MeetupFormValues }> {
	try {
		const json = await req.json();

		const meetupFormValues = await safeParseAsync(
			meetupFormValuesSchema,
			json,
		);

		if (!meetupFormValues.success) {
			const issues = meetupFormValues.error.issues;

			console.error("Invalid JSON - validation error - ", issues);

			return {
				errorResponse: new Response(
					JSON.stringify({
						error: {
							message: "Invalid JSON - validation error",
							details: issues,
						},
					}),
					{
						status: 400,
						headers: { "Content-Type": "application/json" },
					},
				),
			};
		}

		return { parsedMeetup: meetupFormValues.data };
	} catch (e) {
		console.error("Invalid JSON - catched an error - ", e);

		return {
			errorResponse: new Response(
				JSON.stringify({
					error: {
						message: "Invalid JSON - catched an error",
						details: e,
					},
				}),
				{
					status: 400,
					headers: { "Content-Type": "application/json" },
				},
			),
		};
	}
}

export async function createIssue(props: {
	meetupFormValues: MeetupFormValues;
	env: Env;
}): Promise<
	| { errorResponse: Response }
	| { data: { issueUrl: string; issueNumber: number } }
> {
	try {
		const app = new App({
			appId: props.env.GITHUB_APP_ID,
			privateKey: props.env.GITHUB_APP_PRIVATE_KEY,
		});

		const octokit = await app.getInstallationOctokit(
			props.env.GITHUB_APP_INSTALLATION_ID,
		);

		const createIssueRes = await octokit.rest.issues.create({
			owner: props.env.GITHUB_REPO_OWNER,
			repo: props.env.GITHUB_REPO_NAME,
			labels: ["meetup"],
			title: props.meetupFormValues.title,
			body: getMeetupIssueBody(props.meetupFormValues),
		});

		if (createIssueRes.status !== 201) {
			console.error(
				"Failed to create issue - github api did not respond with 201 - response: ",
				createIssueRes,
			);

			return {
				errorResponse: new Response(undefined, { status: 500 }),
			};
		}

		return {
			data: {
				issueUrl: createIssueRes.data.html_url,
				issueNumber: createIssueRes.data.number,
			},
		};
	} catch (e) {
		console.error("Failed to create issue - catched an error -", e);

		return {
			errorResponse: new Response(undefined, { status: 500 }),
		};
	}
}
