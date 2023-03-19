import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {ICourse, ICourseDetailed} from "../models/ICourse";


interface ResponseData {
    totalCount: number,
    courses: ICourse[]
}

export const courseAPI = createApi({
    reducerPath: "courseAPI",
    baseQuery: fetchBaseQuery({baseUrl: "https://api.wisey.app/api/v1/core/preview-courses"}),
    endpoints: (build) => ({
        fetchCourses: build.query<ResponseData, string>({
            query: (token) => ({
                url: `?token=${token}`
            }),
            transformResponse(response: any, meta, arg): any {
                return {
                    totalCount: response.courses.length,
                    courses: response.courses
                }
            }
        }),
        fetchCourseById: build.query<ICourseDetailed, { token: string, id: string }>({
            query: ({token, id}) => ({
                url: `/${id}?token=${token}`
            })
        })
    })
})