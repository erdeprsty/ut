// Interfaces
import { IELearning, CreateELearningOptions } from "@/interfaces/elearning";
import ELearning from "@/core/elearning";

export interface IApp {}

export class App implements IApp {
	public createElearning(options: CreateELearningOptions = {}): IELearning {
		return new ELearning(options);
	}
}

export const UT = App;
export default App;
