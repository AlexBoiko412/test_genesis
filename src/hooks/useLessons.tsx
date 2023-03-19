import {useMemo} from "react";
import {ILesson} from "../models/ICourse";
import Lesson from "../components/Lesson";

export const useLessons = (lessons: ILesson[]) => {
    const parsedLessons = useMemo(() => {
        let arr: {
            label: string;
            key: string;
            children: React.ReactNode;
            disabled: boolean
        }[] = []

        if(lessons.length) {
            lessons.map((lesson, index) => {
                arr[lesson.order - 1] = {
                    label: `Lesson ${lesson.order}`,
                    key: lesson.order + "",
                    disabled: lesson.status === "unlocked" ? false : true,
                    children: <Lesson lesson={lesson} />
                }
            })
            return arr
        }

        return []
    }, [lessons])

    return parsedLessons
}