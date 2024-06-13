import {
	ELEarningAccountCredentials,
	ELearningSessionCredentials,
} from "./auth";

export interface IELearning {
	credentials: Partial<ELearningSessionCredentials>;
	authenticate: (
		account: ELEarningAccountCredentials
	) => Promise<ELearningSessionCredentials>;
	isEmptySession(): boolean;
}

export interface ELearningOptions {
	credentials: ELearningSessionCredentials;
	account: ELEarningAccountCredentials;
}

export interface CreateELearningOptions extends Partial<ELearningOptions> {}
