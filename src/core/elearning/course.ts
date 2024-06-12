// Interfaces
import { IELearningCourse } from "@/interfaces/elearning/course";

// Libraries
import * as cheerio from "cheerio";

export class Course implements IELearningCourse {
	public getCourses() {
		console.log("Courses");
	}
}

export default Course;
