export type ELearningAuthSession = string;
export type ELearningAuthSessionKey = string;

export interface IELearningAuth {
	login(username: string, password: string): Promise<ELearningLoginResult>;
}

export interface ELearningSessionCredentials {
	session: ELearningAuthSession;
	sessionKey: ELearningAuthSessionKey;
}

export interface ELEarningAccountCredentials {
	username: string;
	password: string;
}

export interface ELearningLoginResult extends ELearningSessionCredentials {}

export interface ELearningGetSessionResult {
	token: string;
	session: ELearningAuthSession;
}

export interface ELearningLoginOptions {
	force: boolean;
}
