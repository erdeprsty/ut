import { ELearningAuthSession } from "./auth";

export interface IELearning {
	session: ELearningAuthSession | null;
	isEmptySession(): boolean;
}

export interface ELearningCredential {
	username: string;
	password: string;
}

export interface ELearningOptions {
	credential: ELearningCredential;
	session: ELearningAuthSession;
}

export interface CreateELearningOptions extends Partial<ELearningOptions> {}
