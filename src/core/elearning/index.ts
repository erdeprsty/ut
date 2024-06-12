// Interfaces
import {
	IELearning,
	ELearningCredential,
	CreateELearningOptions,
} from "@/interfaces/elearning";
import {
	ELearningAuthSession,
	IELearningAuth,
} from "@/interfaces/elearning/auth";
import { IELearningCourse } from "@/interfaces/elearning/course";

// Classes
import Auth from "@/core/elearning/auth";
import Course from "@/core/elearning/course";

export class ELearning implements IELearning {
	public session: ELearningAuthSession | null = null;
	public sessionKey: string | null = null;
	private auth: IELearningAuth;
	private course: IELearningCourse;
	private credential: ELearningCredential = {
		username: "",
		password: "",
	};
	constructor(options: CreateELearningOptions = {}) {
		this.auth = new Auth();
		this.course = new Course();
		if (options.session) {
			this.session = options.session;
		}
		if (options.credential) {
			this.credential.username = options.credential.username;
			this.credential.password = options.credential.password;
		}
	}
	public isEmptySession() {
		return this.session === null;
	}
	public async authenticate(
		credentials: ELearningCredential = {
			username: this.credential.username,
			password: this.credential.password,
		}
	): Promise<IELearning> {
		const { session, key } = await this.auth.login(
			credentials.username,
			credentials.password
		);
		this.session = session;
		this.sessionKey = key;
		return Promise.resolve(this);
	}
	public async getCourses() {
		return this.course.getCourses();
	}
}

export default ELearning;
