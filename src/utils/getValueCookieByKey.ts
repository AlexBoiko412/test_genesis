export const getValueCookieByKey = (key: string) => {
    const cookies = document.cookie.split(";")
    const value = cookies.find((cookie) => cookie.includes(key))?.split("=")[1]
    if(value) {
        return value
    } else {
        return ""
    }

}