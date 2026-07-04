import type { User, Course, Submission, Student } from "../types/index";
import type { StringOrNumber } from "../types/index";

function getUser(id: StringOrNumber): Student {
    return {
        id: id,
        name: "Juan dela Cruz",
        email: "juan@example.com",
        role: "student",
        isActive: true,
        score: 95.5, 
    }
}

function calculateGrade(score: number, maxScore: number): string {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90) return "A";
    if (percentage >= 80) return "B";
    if (percentage >= 70) return "C";
    return "F";
}

function formatCourse(name: string, units: number, semester: string): string {
    return `${name} (${units} units) - ${semester}`;
}

const user = getUser(1);
console.log(user);
console.log(calculateGrade(85, 100));
console.log(formatCourse("IT Elective 4", 3, "1st Semester"));

