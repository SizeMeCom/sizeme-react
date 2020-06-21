import {sizemeStore} from "./api/sizeme-api";
import {setAbStatus} from "./api/actions";
import {trackEvent} from "./api/ga";

export default () => {
    let sizemeDisabled = false;
    const storageABValue = localStorage.getItem("sizemeABDisabled");

    if (!storageABValue) {
        sizemeDisabled = Math.floor(Math.random() * 100) % 2 === 0;
        localStorage.setItem("sizemeABDisabled", JSON.stringify(sizemeDisabled));
    } else {
        sizemeDisabled = JSON.parse(storageABValue);
    }

    const abStatus = sizemeDisabled ? "B" : "A";
    console.log("SizeMe A/B testing, status: " + abStatus);
    sizemeStore.dispatch(setAbStatus(abStatus));

    if (sizemeDisabled) {
        trackEvent("productPageLoggedOutABDenied", "Store: Product page load, logged out, AB SM denied");
    } else {
        trackEvent("productPageLoggedOutABEnabled", "Store: Product page load, logged out, AB SM enabled");
    }

    return sizemeDisabled;
};
