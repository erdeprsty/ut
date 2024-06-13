// Interfaces
import { IELearning, CreateELearningOptions } from "@/interfaces/elearning";
import {
	ELEarningAccountCredentials,
	ELearningSessionCredentials,
	IELearningAuth,
} from "@/interfaces/elearning/auth";

// Classes
import Auth from "@/core/elearning/auth";

export class ELearning implements IELearning {
	public credentials: Partial<ELearningSessionCredentials> = {
		session: undefined,
		sessionKey: undefined,
	};
	private auth: IELearningAuth;
	private account: ELEarningAccountCredentials = {
		username: "",
		password: "",
	};
	constructor(options: CreateELearningOptions = {}) {
		this.auth = new Auth();
		if (options.credentials) {
			this.credentials = options.credentials;
		}
		if (options.account) {
			this.account.username = options.account.username;
			this.account.password = options.account.password;
		}
	}
	public isEmptySession() {
		return !(this.credentials.session || this.credentials.sessionKey);
	}
	public async authenticate(
		account: ELEarningAccountCredentials = {
			username: this.account.username,
			password: this.account.password,
		}
	): Promise<ELearningSessionCredentials> {
		const credentials = await this.auth.login(
			account.username,
			account.password
		);
		this.credentials = credentials;
		return Promise.resolve(credentials);
	}
}

export default ELearning;
