// Libraries
import * as cheerio from "cheerio";
// Helpers
import request from "../../helpers/request";
import { config } from "../../constants";
export class Auth {
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
                const response = await request(`${config.BASE_URL}/login/index.php`);
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
            const response = await request("https://elearning.ut.ac.id/login/index.php", {
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
export default Auth;
