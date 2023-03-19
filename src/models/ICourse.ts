export interface ICourse {
    id: string;
    title: string;
    tags: string[]
    launchDate: string;
    status: string;
    description: string;
    duration: number;
    lessonsCount: number;
    containsLockedLessons: boolean;
    previewImageLink: string;
    rating: number;
    meta: {
        slug: string;
        skills: string[];
        courseVideoPreview: {
            link: string;
            duration: number;
            previewImageLink: string
        }
    }
}

export interface ILesson {
    id: string;
    title: string;
    duration: number;
    order: number;
    type: string;
    status: "unlocked" | "locked";
    link: string;
    previewImageLink: string;
    meta: {}
}


export interface ICourseDetailed extends Omit<ICourse, "lessonsCount"> {
    lessons: ILesson[]
}

