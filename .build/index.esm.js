import * as cheerio from 'cheerio';
import axios from 'axios';

const config = {
    BASE_URL: "https://elearning.ut.ac.id",
};

axios.defaults.baseURL = config.BASE_URL;
axios.defaults.validateStatus = (status) => {
    return status >= 200 && status < 400;
};

// Libraries
class Auth {
    getCsrfLoginElement(parsedHtml) {
        return parsedHtml("input[name=logintoken]").first();
    }
    getSessionVerifyLinkElement(parsedHtml) {
        return parsedHtml("a")
            .filter((_, el) => {
            return el.attribs.href.indexOf("testsession") > -1;
        })
            .first();
    }
    getSessionFromCookies(cookieStrings) {
        if (!cookieStrings)
            throw new Error(`Error parsing session from cookie, given empty cookies`);
        const filteredCookies = cookieStrings.filter((cookieString) => cookieString.toLowerCase().indexOf("moodlesession") > -1);
        if (filteredCookies.length === 0)
            throw new Error(`No session found in cookies`);
        const sessionCookie = filteredCookies[0];
        const session = sessionCookie.match(/MoodleSession=([^;]*)/);
        if (!session)
            throw new Error(`Error parsing session from cookie, invalid session cookie`);
        return session[1];
    }
    getSession() {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await axios(`${config.BASE_URL}/login/index.php`);
                const htmlText = await response.data;
                const cookieStrings = response.headers["set-cookie"];
                const session = this.getSessionFromCookies(cookieStrings);
                const parsedHtml = cheerio.load(htmlText);
                const csrfToken = this.getCsrfLoginElement(parsedHtml).val();
                if (typeof csrfToken !== "string")
                    throw new Error("CSRF token not found");
                return resolve({
                    token: csrfToken,
                    session,
                });
            }
            catch (err) {
                return reject(err);
            }
        });
    }
    async login(username, password) {
        try {
            const { token, session } = await this.getSession();
            const response = await axios("https://elearning.ut.ac.id/login/index.php", {
                headers: {
                    "content-type": "application/x-www-form-urlencoded",
                    cookie: `MoodleSession=${session}`,
                },
                data: `anchor=&logintoken=${token}&username=${username}&password=${password}`,
                method: "POST",
                maxRedirects: 0,
            });
            const isInvalidLogin = response.headers["location"]
                ? response.headers["location"].indexOf("testsession") === -1
                : true;
            if (isInvalidLogin)
                throw new Error("Login failed, please check your username and password");
            const cookieStrings = response.headers["set-cookie"];
            const authSession = this.getSessionFromCookies(cookieStrings);
            return Promise.resolve(authSession);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
}

class Course {
    getCourses() { }
}

class ELearningUser {
    elearning;
    constructor(elearning) {
        this.elearning = elearning;
    }
    async getUser() {
        try {
            if (this.elearning.isEmptySession())
                throw new Error("No session found, please authenticate first");
            const res = await axios({
                method: "get",
                url: "/my/",
                headers: {
                    Cookie: `MoodleSession=${this.elearning.session}`,
                },
                maxRedirects: 0,
            });
            return res.data;
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
}

// Classes
class ELearning {
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
        this.user = new ELearningUser(this);
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

class App {
    constructor() { }
    createElearning(options = {}) {
        return new ELearning(options);
    }
}

const isNode = () => {
    return (typeof process !== "undefined" &&
        process.versions != null &&
        process.versions.node);
};

if (!isNode())
    throw new Error("This code should only be run in Node.js environment.");

export { App as default };
//# sourceMappingURL=index.esm.js.map
