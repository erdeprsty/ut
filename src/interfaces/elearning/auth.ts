export type ELearningAuthSession = string;

export interface ELearningLoginResult {
	session: ELearningAuthSession;
	key: string;
}

export interface ELearningGetSessionResult {
	token: string;
	session: ELearningAuthSession;
}

export interface ELearningLoginOptions {
	force: boolean;
}

export interface IELearningAuth {
	login(username: string, password: string): Promise<ELearningLoginResult>;
}
