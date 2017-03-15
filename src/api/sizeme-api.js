/* global ga, sizeme_options */
import "./ga.js";

let contextAddress = sizeme_options.contextAddress || "https://www.sizeme.com";
let gaTrackingId = sizeme_options.gaTrackingId;
let pluginVersion = sizeme_options.pluginVersion;

let authToken = (() => {
    let tokenObj = sessionStorage.getItem("sizeme.authtoken");
    if (tokenObj) {
        let storedToken;
        try {
            storedToken = JSON.parse(tokenObj);
            if (storedToken.token && storedToken.expires && Date.parse(storedToken.expires) > new Date().getTime()) {
                return storedToken.token;
            }
        } catch (e) {
            // no action
        }
    }
    return null;
})();

let gaEnabled = false;
ga(function () {
    gaEnabled = gaTrackingId != null;
});

let trackEvent = (action, label) => {
    if (gaEnabled) {
        ga("create", gaTrackingId, "auto", { name: "sizemeTracker" });
        trackEvent = (a, l) => {
            ga("sizemeTracker.send", {
                hitType: "event",
                eventCategory: window.location.hostname,
                eventAction: a,
                eventLabel: l
            });
        };
        trackEvent(action, label);
    }
};


function isLoggedIn () {
    return authToken != null;
}

export { trackEvent, isLoggedIn };
