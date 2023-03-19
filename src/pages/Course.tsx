import React, {FC, useEffect, useState} from 'react';
import {useParams} from "react-router";
import {courseAPI} from "../services/CourseService";
import {Empty, message, Rate, Spin, Tabs} from "antd";
import {useTypedSelector} from "../hooks/redux";
import VideoPlayer from "../components/UI/VideoPlayer/VideoPlayer";
import {useLessons} from "../hooks/useLessons";
import cl from "../components/CoursesListItem.module.css";
import {getValueCookieByKey} from "../utils/getValueCookieByKey";

const Course: FC = () => {
    const {id} = useParams()

    const [messageApi, contextHolder] = message.useMessage();
    const [lessonPoster, setLessonPoster] = useState("")
    const [lessonVideo, setLessonVideo] = useState("")
    const [selectedTab, setSelectedTab] = useState(1)


    const displayErrorMessage = (content: string) => {
        messageApi.open({
            type: 'error',
            content: content,
        });
    };

    const {token, isLoading: isTokenLoading} = useTypedSelector(state => state.authSlice)

    const {data: course, error, isLoading} = courseAPI.useFetchCourseByIdQuery({
        id: id ? id : "",
        token: token
    }, {skip: isTokenLoading})

    const tabItems = useLessons(course?.lessons ? course.lessons : [])


    useEffect(() => {
        if (
            error
            && "data" in error
            && typeof error.data === "object"
            && error.data
            && "statusCode" in error.data
            && "message" in error.data
        ) {
            displayErrorMessage(`${error.data.statusCode}: ${error.data.message}`)
        }
    }, [error])

    useEffect(() => {
        if(course) {
            const courseMeta = getValueCookieByKey(`${course.id}`)
            if(courseMeta) {
                const courseMetaParsed = JSON.parse(courseMeta)
                const lesson = course.lessons.find((les) => les.id === courseMetaParsed.lessonId)

                if (lesson) {
                    setSelectedTab(lesson.order)
                }
            } else {

            }
            const lastCoursesIds = getValueCookieByKey("last_courses")

            if(lastCoursesIds) {
                const parsedLastCoursesIds: string[] = JSON.parse(lastCoursesIds)

                if(parsedLastCoursesIds.includes(course.id)) {
                    const index = parsedLastCoursesIds.indexOf(course.id)

                    parsedLastCoursesIds.splice(index)
                    parsedLastCoursesIds.unshift(course.id)
                } else {
                    parsedLastCoursesIds.unshift(course.id)
                }

                document.cookie = `last_courses=${JSON.stringify(parsedLastCoursesIds)}; path=/;`
            } else {
                document.cookie = `last_courses=${JSON.stringify([course.id])}; path=/;`
            }
        }
    }, [course])

    useEffect(() => {
        if(selectedTab && course) {
            let index = selectedTab - 1


            const lesson = course.lessons.find((les) => les.order === selectedTab)

            if(lesson) {
                if(!course?.lessons[index].link) {
                    displayErrorMessage("Video has not loaded!")
                }

                const posterLink =
                    lesson.previewImageLink
                    + '/lesson-'
                    + lesson.order
                    + '.webp'

                const videoLink = lesson?.link ?? ''

                setLessonPoster(posterLink)

                setLessonVideo(videoLink)


                const courseMeta = JSON.stringify({id: course.id, lessonId: lesson.id})
                document.cookie = `${course.id}_progress=${courseMeta}; path=/;`
            }

        }

    }, [course, selectedTab])




    return (
        <div className={"coursePage"}>


            <h3>{course?.title}</h3>
            <div className="coursePageMeta">


                <div>
                    {
                        course?.meta?.skills?.length
                            ?   <>
                                <p><strong>Skills</strong></p><br/>
                                <ul className={cl.skills}>
                                    {
                                        course.meta.skills.map(skill =>
                                            <li key={skill}>{skill}</li>
                                        )
                                    }
                                </ul>
                            </>
                            : ""
                    }
                </div>


                <div>
                    <p><strong>Rating: </strong></p><br/>
                    {
                        course?.rating
                            ?<div>
                                <Rate allowHalf defaultValue={course.rating} />
                                <span>{course?.rating}</span>
                            </div>
                            : ""
                    }

                </div>
                <div>
                    <p><strong>Duration: </strong></p><br/>
                    <span>
                        {
                            course?.duration
                                ? (course.duration / 60).toFixed(1)
                                : ""
                        }
                        min
                    </span>
                </div>
            </div>

            <div>
                <VideoPlayer
                    height={"400"}
                    controls={true}
                    poster={lessonPoster}
                    muted={false}
                    videoName={lessonPoster}
                    src={lessonVideo}
                    isSaveTime={true}
                    isPiPAble={true}
                />
                <p><em>To change the speed: Shift + ArrowUp / Shift - ArrowUp</em></p>
                <p><em>To open PiP click on video</em></p>
            </div>




            <Tabs
                tabPosition={'top'}
                items={tabItems}
                onChange={(activeKey) => {
                    setSelectedTab(Number(activeKey))}}
                activeKey={selectedTab + ""}
                style={{width: "100%"}}
            />

            {contextHolder}
            {error && <Empty/>}
            {isLoading && <Spin className={"spin"} size="large"/>}
        </div>
    );
};

export default Course;