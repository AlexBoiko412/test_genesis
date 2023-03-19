import {useMemo} from "react";

export const usePagination = (elements: any[], page: number, limit: number) => {
    const elementsPaginated = useMemo(() => {
        if(!elements.length) return elements
        if (elements.length <= limit) return elements;


        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;


        const arr = elements.slice(startIndex, endIndex);

        return arr
    }, [elements, page, limit])

    return elementsPaginated
}