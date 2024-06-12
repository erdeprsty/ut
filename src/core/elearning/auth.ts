import fs from "fs/promises";

// Interfaces
import {
	IELearningAuth,
	ELearningLoginResult,
	ELearningGetSessionResult,
} from "@/interfaces/elearning/auth";

// Libraries
import * as cheerio from "cheerio";
import { CheerioAPI } from "cheerio";

// Helpers
import request from "@/helpers/request";
import { config } from "@/constants";

export class Auth implements IELearningAuth {
	protected getElementCsrf(parsedHtml: CheerioAPI) {
		return parsedHtml("input[name=logintoken]").first();
	}
	protected getElementSessionKey(parsedHtml: CheerioAPI) {
		return parsedHtml("input[name=sesskey]").first();
	}
	protected getSessionFromCookies(cookies: string[] | undefined) {
		if (!cookies)
			throw new Error(`Error parsing session from cookie, given empty cookies`);
		const filteredCookies = cookies.filter(
			(cookie) => cookie.toLowerCase().indexOf("moodlesession") > -1
		);
		if (filteredCookies.length === 0)
			throw new Error(`No session found in cookies`);
		const sessionCookie = filteredCookies[0];
		const session = sessionCookie.match(/MoodleSession=([^;]*)/);
		if (!session)
			throw new Error(
				`Error parsing session from cookie, invalid session cookie`
			);
		return session[1];
	}
	protected getSession(): Promise<ELearningGetSessionResult> {
		return new Promise(async (resolve, reject) => {
			try {
				const response = await request(`${config.BASE_URL}/login/index.php`);
				const htmlText = await response.data;
				const cookies = response.headers["set-cookie"];
				const session = this.getSessionFromCookies(cookies);
				const parsedHtml = cheerio.load(htmlText);
				const csrfToken = this.getElementCsrf(parsedHtml).val();
				if (typeof csrfToken !== "string")
					throw new Error("CSRF token not found");
				return resolve({
					token: csrfToken,
					session,
				});
			} catch (err) {
				return reject(err);
			}
		});
	}
	public async getToken(session: string = ""): Promise<string> {
		try {
			const response = await request("/my/", {
				headers: {
					cookie: `MoodleSession=${session}`,
				},
			});
			const htmlText = await response.data;
			const parsedHtml = cheerio.load(htmlText);
			const sessionKey = this.getElementSessionKey(parsedHtml).val();
			if (typeof sessionKey !== "string")
				throw new Error("Session key not found");
			return Promise.resolve(sessionKey);
		} catch (err) {
			return Promise.reject(err);
		}
	}
	public async login(
		username: string,
		password: string
	): Promise<ELearningLoginResult> {
		try {
			const { token, session } = await this.getSession();
			const response = await request("/login/index.php", {
				headers: {
					"content-type": "application/x-www-form-urlencoded",
					cookie: `MoodleSession=${session}`,
				},
				data: `anchor=&logintoken=${token}&username=${username}&password=${password}`,
				method: "POST",
				maxRedirects: 0,
			});
			const isInvalidLogin = response.headers["location"]
				? response.headers["location"]!.indexOf("testsession") === -1
				: true;
			if (isInvalidLogin)
				throw new Error(
					"Login failed, please check your username and password"
				);
			const cookies = response.headers["set-cookie"];
			const authSession = this.getSessionFromCookies(cookies);
			const authKey = await this.getToken(authSession);
			return Promise.resolve({
				session: authSession,
				key: authKey,
			});
		} catch (err) {
			return Promise.reject(err);
		}
	}
}

export default Auth;
