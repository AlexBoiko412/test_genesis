import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
import cl from './VideoPlayer.module.css'

import Hls from "hls.js";
import {getValueCookieByKey} from "../../../utils/getValueCookieByKey";
import {message} from "antd";



const VideoPlayer: FC<any> = ({src, poster, size, onError, videoName, isSaveTime, isPiPAble, ...props}) => {

    const videoRef = useRef<HTMLVideoElement>(null)
    const [isPiPActive, setIsPiPActive] = useState(false);
    const [videoSpeed, setVideoSpeed] = useState(1)
    const [isShiftPressed, setIsShiftPressed] = useState(false)
    const [isUpArrowPressed, setIsUpArrowPressed] = useState(false)
    const [isDownArrowPressed, setIsDownArrowPressed] = useState(false)
    const [messageApi, contextHolder] = message.useMessage();

    const displayErrorMessage = (content: string) => {
        messageApi.open({
            type: 'error',
            content: content,
        });
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.code === "ShiftLeft") {
            setIsShiftPressed(true)
        } else if(e.code === "ArrowUp") {
            setIsUpArrowPressed(true)
        } else if(e.code === "ArrowDown") {
            setIsDownArrowPressed(true)
        }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
        if (e.code === "ShiftLeft") {
            setIsShiftPressed(false)
        } else if(e.code === "ArrowUp") {
            setIsUpArrowPressed(false)
        } else if(e.code === "ArrowDown") {
            setIsDownArrowPressed(false)
        }
    };


    const togglePiP = useCallback(async () => {
        if(videoRef.current && isPiPAble) {
            if (document.pictureInPictureElement === videoRef.current) {
                await document.exitPictureInPicture();
                setIsPiPActive(false);
            } else {
                try {
                    await videoRef.current.requestPictureInPicture();
                    setIsPiPActive(true);
                } catch (error) {
                    displayErrorMessage(`request PiP error`)
                }
            }
        }

    }, [isPiPAble])

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown)
        document.addEventListener("keyup", handleKeyUp)

        return () => {
            document.removeEventListener("keydown", handleKeyDown)
            document.removeEventListener("keyup", handleKeyUp)
        }
    }, [])

    useEffect(() => {
        if(isShiftPressed && isUpArrowPressed) {
            setVideoSpeed(videoSpeed + 0.25)
        } else if(isShiftPressed && isDownArrowPressed && videoSpeed > 0.25) {
            setVideoSpeed(videoSpeed - 0.25)
        }
    }, [isShiftPressed, isUpArrowPressed, isDownArrowPressed])

    useEffect(() => {
        if(videoRef.current) {
            videoRef.current.playbackRate = videoSpeed
        }

    }, [videoSpeed])


    useEffect(() => {

        if(src && poster) {
            const savedTime = getValueCookieByKey(`${videoName}_progress`)

            const video = videoRef.current
            if(video)


            if(Hls.isSupported())
            {

                var hls = new Hls();

                if(isSaveTime) {
                    if (savedTime) {
                        video.currentTime = parseFloat(savedTime);
                    }
                }

                hls.loadSource(src);
                hls.attachMedia(video);


                return () => {
                    if(isSaveTime) {
                        document.cookie = `${videoName}_progress=${video.currentTime.toString()}; path=/;`
                    }

                    hls.destroy();
                };
            }
            else if (video.canPlayType('application/vnd.apple.mpegurl'))
            {
                video.src = src;
                video.addEventListener("loadedmetadata", () => {

                    if (isSaveTime && savedTime) {
                        video.currentTime = parseFloat(savedTime);
                    }

                    video.play();
                });

                return () => {
                    if(isSaveTime) {
                        document.cookie = `${videoName}_progress=${video.currentTime.toString()}; path=/;`
                    }
                }
            }
        }
    }, [videoRef, src, poster])


    return (
        <>
            {contextHolder}
            <video
                className={size === "small" ? cl.videoPlayerSmall : cl.videoPlayerBig}
                {...props}
                onClick={togglePiP}
                onTouchEnd={(e) => {
                    if(size === "small") {
                        props.onTouchEnd(e)
                    } else {
                        togglePiP()
                    }
                }}

                poster={poster}
                ref={videoRef}
            >

            </video>
        </>

    );
};

export default VideoPlayer;