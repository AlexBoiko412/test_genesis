import React, {FC} from 'react';
import {ICourse} from "../models/ICourse";
import cl from './CoursesList.module.css'
import CoursesListItem from "./CoursesListItem";


interface CoursesListProps {
    courses: ICourse[];
    lastCoursesIds: string[]
}

const CoursesList: FC<CoursesListProps>  = ({courses, lastCoursesIds}) => {



    return (
        <div id={"coursesList"} className={cl.coursesList}>
            {
                courses.map((course) =>
                    <CoursesListItem key={course.id} course={course} lastCoursesIds={lastCoursesIds} />
                )
            }
        </div>


    );
};

export default CoursesList;