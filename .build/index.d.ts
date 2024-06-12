type ELearningAuthSession = string;

interface IELearning {
    session: ELearningAuthSession | null;
    isEmptySession(): boolean;
}
interface ELearningCredential {
    username: string;
    password: string;
}
interface ELearningOptions {
    credential: ELearningCredential;
    session: ELearningAuthSession;
}
interface CreateELearningOptions extends Partial<ELearningOptions> {
}

declare class ELearning implements IELearning {
    session: ELearningAuthSession | null;
    private auth;
    private course;
    private user;
    private credential;
    constructor(options?: CreateELearningOptions);
    isEmptySession(): boolean;
    authenticate(credentials?: ELearningCredential): Promise<IELearning>;
    getCourses(): Promise<any>;
    getUser(): Promise<any>;
}

interface IApp {
    createElearning(options: CreateELearningOptions): IELearning;
}
declare class App implements IApp {
    constructor();
    createElearning(options?: CreateELearningOptions): ELearning;
}

export { App as default };
