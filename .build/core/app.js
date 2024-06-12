import ELearning from "../core/elearning";
export class App {
    constructor() { }
    createElearning(options = {}) {
        return new ELearning(options);
    }
}
export const UT = App;
export default App;
