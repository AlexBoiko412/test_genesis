import React, {FC, memo, useCallback, useEffect, useRef, useState} from 'react';
import VideoPlayer from "./UI/VideoPlayer/VideoPlayer";
import cl from "./CoursesListItem.module.css";
import {Card, message, Rate} from "antd";
import {ICourse} from "../models/ICourse";
import {useNavigate} from "react-router";


interface CoursesListItemProps {
    course: ICourse;
    lastCoursesIds: string[]
}

const CoursesListItem: FC<CoursesListItemProps> = memo(({course, lastCoursesIds}) => {
    const navigate = useNavigate()
    const [messageApi, contextHolder] = message.useMessage();
    const [isViewed, setIsViewed] = useState(false)


    const displayErrorMessage = (content: string) => {
        messageApi.open({
            type: 'error',
            content: content,
        });
    };

    const play = useCallback((e: React.MouseEvent<HTMLVideoElement>) => {
        e.currentTarget.play()
    }, [])

    const pause = useCallback((e: React.MouseEvent<HTMLVideoElement>) => {

        e.currentTarget.pause()
    }, [])


    const onHlsError = (error: string) => {
        displayErrorMessage(error)
    }


    useEffect(() => {
        if(lastCoursesIds.includes(course.id)) {
            setIsViewed(true)
        }
    }, [course])

    return (
        <Card
            onClick={() => {
                navigate(course.id)
            }}
            className={cl.card}
            key={course.id}
            hoverable
            style={{ width: 300}}
            cover={
                <VideoPlayer
                    size={"small"}
                    onError={onHlsError}
                    onMouseEnter={play}
                    onMouseLeave={pause}
                    onTouchStart={play}
                    onTouchEnd={pause}
                    videoName={course.id}
                    poster={`${course.previewImageLink}/cover.webp`}
                    muted={true}
                    src={course?.meta?.courseVideoPreview?.link || ""}
                />
            }
        >
            <div className={cl.courseMeta}>
                {contextHolder}
                <h3 className={cl.courseTitle}>{course.title}</h3>

                <p><strong>Lessons: </strong>{course.lessonsCount}</p>

                {
                    course.meta?.skills?.length
                        ?   <>
                                <p><strong>Skills</strong></p>

                                <ul className={cl.skills}>
                                    {
                                        course.meta.skills.map(skill =>
                                            <li className={cl.skillsItem}>{skill}</li>
                                        )
                                    }
                                </ul>
                            </>
                        : ""
                }


                <p><strong>Rating: </strong></p>
                <Rate allowHalf defaultValue={course.rating} />
                <span>{course.rating}</span>

                {
                    isViewed
                    &&  <div className={cl.downMark}>
                            <span>Continue learning</span>
                        </div>
                }


            </div>

        </Card>
    );
});

export default CoursesListItem;