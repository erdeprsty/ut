// Classes
import Auth from "../../core/elearning/auth";
import Course from "../../core/elearning/course";
import User from "../../core/elearning/user";
export class ELearning {
    session = null;
    auth;
    course;
    user;
    credential = {
        username: "",
        password: "",
    };
    constructor(options = {}) {
        this.auth = new Auth();
        this.course = new Course();
        this.user = new User(this);
        if (options.session) {
            this.session = options.session;
        }
        if (options.credential) {
            this.credential.username = options.credential.username;
            this.credential.password = options.credential.password;
        }
    }
    isEmptySession() {
        return this.session === null;
    }
    async authenticate(credentials = {
        username: this.credential.username,
        password: this.credential.password,
    }) {
        this.session = await this.auth.login(credentials.username, credentials.password);
        return Promise.resolve(this);
    }
    async getCourses() {
        return this.course.getCourses();
    }
    async getUser() {
        return this.user.getUser();
    }
}
export default ELearning;
