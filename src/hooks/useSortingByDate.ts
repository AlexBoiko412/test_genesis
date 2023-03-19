import {useMemo} from "react";
import {ICourse} from "../models/ICourse";

export const useSortingByDate = (courses: ICourse[]) => {

    const compareDates = (courseA: ICourse, courseB: ICourse) => {
        const date1 = new Date(courseA.launchDate)
        const date2 = new Date(courseB.launchDate)
        return date2.getTime() - date1.getTime();
    }

    const sortedCourses = useMemo(() => {
        if(!courses.length) return courses
        const arr = [...courses].sort(compareDates)

        return arr
    }, [courses])

    return sortedCourses
}