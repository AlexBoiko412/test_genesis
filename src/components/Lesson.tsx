import React, {FC} from 'react';
import {ILesson} from "../models/ICourse";
import cl from './Lesson.module.css'



interface LessonProps {
    lesson: ILesson
}

const Lesson: FC<LessonProps> = ({lesson: {title, duration}}) => {
    const durationInMinutes = duration ? (duration / 60).toFixed(1) : "";

    return (
        <div className={cl.lesson}>
            <h3>{title}</h3><br/>
            <p>Duration: {durationInMinutes} min</p>
        </div>
    );
};

export default Lesson;