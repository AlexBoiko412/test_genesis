import {ICourse} from "../models/ICourse";
import {useMemo} from "react";

export const useSortingByLastViewed = (courses: ICourse[], lastCoursesIds: string[]) => {

    const sortedCourses = useMemo(() => {
        if (!courses.length || !lastCoursesIds.length) {
            return courses;
        }


        let lastCourses: ICourse[] = []
        let otherCourses: ICourse[] = []

        lastCoursesIds.forEach((lastCourseId, index) => {
            courses.forEach((course) => {
                if (lastCourseId === course.id) {
                    lastCourses.push(course)
                }
            })
        })

        courses.forEach((course, index) => {
            if(!lastCoursesIds.includes(course.id)) {
                otherCourses.push(course)
            }
        })

        return [...lastCourses, ...otherCourses]
    }, [courses, lastCoursesIds])

    return sortedCourses
}