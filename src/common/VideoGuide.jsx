import React from "react";
import PropTypes from "prop-types";
import { DefaultPlayer as Video } from "react-html5video";
import MobileDetect from "mobile-detect";
import { cdnLocation } from "../api/sizeme-api";

const videoUrl = cdnLocation + "/videos";

const videoTypes = {
    mp4: "video/mp4; codecs=avc1.42E01E,mp4a.40.2",
    ogv: "video/ogg; codecs=theora,vorbis",
    webm: "video/webm; codecs=vp8,vorbis"
};

const availableVideos = [
    "chest", "footLength", "hips", "outSeam", "pantWaist", "shirtWaist", "sleeve"
];

const availablePosters = [
    "ankleCircumference", "calfCircumference", "frontHeight", "headCircumference",
    "kneeCircumference", "neckCircumference", "thighCircumference", "underbust"
];

const defaultPoster = (gender) => {
    if (gender === "male") {
        return `${videoUrl}/male.png`;
    } else {
        return `${videoUrl}/female.png`;
    }
};

const mobileDetect = new MobileDetect(window.navigator.userAgent);
const autoplay = !mobileDetect.is("phone");

const VideoGuide = (props) => {
    const gender = props.gender || "female";
    if (availableVideos.includes(props.measurement)) {
        const video = `${videoUrl}/${gender}_${props.measurement}`;
        return (
            <Video autoPlay={autoplay} poster={defaultPoster(gender)} width="250"
                   controls={[]}>
                {Object.keys(videoTypes).map(ext =>
                    <source key={ext} src={`${video}.${ext}`}
                            type={videoTypes[ext]}/>
                )}
            </Video>
        );
    } else {
        let poster;
        if (availablePosters.includes(props.measurement)) {
            poster = `${videoUrl}/${gender}_${props.measurement}.png`;
        } else {
            poster = defaultPoster(gender);
        }
        return <img src={poster} width="250"/>;
    }
};

VideoGuide.propTypes = {
    gender: PropTypes.oneOf(["male", "female"]),
    measurement: PropTypes.string.isRequired
};

export default VideoGuide;