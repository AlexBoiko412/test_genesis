import React, {FC, useEffect, useMemo, useState} from 'react';
import CoursesList from "../components/CoursesList";
import {courseAPI} from "../services/CourseService";
import {Empty, message, Pagination, Spin} from "antd";
import {useTypedSelector} from "../hooks/redux";
import {ICourse} from "../models/ICourse";
import {usePagination} from "../hooks/usePagination";
import {useSortingByDate} from "../hooks/useSortingByDate";
import {useNavigate} from "react-router";
import {useSortingByLastViewed} from "../hooks/useSortingByLastViewed";
import {getValueCookieByKey} from "../utils/getValueCookieByKey";

const Courses: FC = () => {
    const navigate = useNavigate()

    const [totalCount, setTotalCount] = useState(0)
    const [page, setPage] = useState(1)
    const [lastCoursesIds, setLastCoursesIds] = useState<string[]>([])




    const {token, isLoading: isTokenLoading, error: tokenError } = useTypedSelector(state => state.authSlice)


    const {data, isLoading: isCoursesLoading, error: coursesError} = courseAPI.useFetchCoursesQuery(token, {
        skip: isTokenLoading
    })

    const courses = useMemo<ICourse[]>(() => {
        const lastCoursesCookie = getValueCookieByKey("last_courses")

        if(lastCoursesCookie) {
            const lastParsedCoursesCookie = JSON.parse(lastCoursesCookie)

            setLastCoursesIds(lastParsedCoursesCookie)
        }

        return data?.courses?.length ? data.courses : []
    }, [data])


    useEffect(() => {
        if(data?.totalCount) {
            setTotalCount(data.totalCount)
        }
    }, [data])


    const sortedByDateCourses = useSortingByDate(courses)
    const sortedByLastViewedCourses = useSortingByLastViewed(sortedByDateCourses, lastCoursesIds)
    const paginatedCourses = usePagination(sortedByLastViewedCourses, page, 10)

    const [messageApi, contextHolder] = message.useMessage();

    const displayErrorMessage = (content: string) => {
        messageApi.open({
            type: 'error',
            content: content,
        });
    };

    useEffect(() => {
        if (coursesError
            && "data" in coursesError
            && typeof coursesError.data === "object"
            && coursesError.data
            && "statusCode" in coursesError.data
            && "message" in coursesError.data
        ) {
            displayErrorMessage(`${coursesError.data.statusCode}: ${coursesError.data.message}`)
        } else if(tokenError) {
            displayErrorMessage(tokenError)
        }

    }, [coursesError, tokenError])

    const isLoading = isCoursesLoading || isTokenLoading

    return (
        <div className={"coursesPage"}>
            {contextHolder}

            {coursesError && <Empty/>}


            <CoursesList
                courses={paginatedCourses}
                lastCoursesIds={lastCoursesIds}
            />


            <Pagination

                defaultCurrent={page}
                total={totalCount}
                defaultPageSize={10}
                pageSize={10}
                onChange={(page, pageSize) => {
                    setPage(page)
                    navigate("#coursesList")
                }}
            />

            {
                isLoading
                && <Spin className={"spin"} size="large" />
            }
        </div>
    );
};

export default Courses;