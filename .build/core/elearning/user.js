import request from "../../helpers/request";
export class ELearningUser {
    elearning;
    constructor(elearning) {
        this.elearning = elearning;
    }
    async getUser() {
        try {
            if (this.elearning.isEmptySession())
                throw new Error("No session found, please authenticate first");
            const res = await request({
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
export default ELearningUser;
