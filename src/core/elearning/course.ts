// Interfaces
import { IELearning } from "@/interfaces/elearning";
import { IELearningCourse } from "@/interfaces/elearning/course";
import { AxiosInstance } from "axios";

// Libraries
import * as cheerio from "cheerio";
import request from "@/helpers/request";

export class Course implements IELearningCourse {
	private request: AxiosInstance;
	constructor(private elearning: IELearning) {
		this.request = request.create();
	}
	public getCourses() {
		console.log("Courses");
	}
}

export default Course;
