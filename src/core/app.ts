// Interfaces
import { IELearning, CreateELearningOptions } from "@/interfaces/elearning";
import ELearning from "@/core/elearning";

export interface IApp {
	createElearning(options: CreateELearningOptions): IELearning;
}

export class App implements IApp {
	constructor() {}
	public createElearning(options: CreateELearningOptions = {}) {
		return new ELearning(options);
	}
}

export const UT = App;
export default App;
