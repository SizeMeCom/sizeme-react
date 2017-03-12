/* global ga */
import "./ga.js";

class SizeMe {
    constructor (contextAddress = "https://www.sizeme.com", gaTrackingID, pluginVersion = "UNKNOWN") {
        console.log("Creating SizeMe..");
        this.contextAddress = contextAddress;
        this.pluginVersion = pluginVersion;
        this._authToken = null;

        let gaEnabled = false;
        ga(() => gaEnabled = gaTrackingID != null);

        this.trackEvent = (action, label) => {
            if (gaEnabled) {
                ga("create", gaTrackingID, "auto", { name: "sizemeTracker" });
                this.trackEvent = (a, l) => {
                    ga("sizemeTracker.send", {
                        hitType: "event",
                        eventCategory: window.location.hostname,
                        eventAction: a,
                        eventLabel: l,
                    });
                };
                this.trackEvent(action, label);
            }
        };
    }
    
    set authToken (authToken) { this._authToken = authToken; }

    isLoggedIn() {
        return this._authToken != null;
    }
}

export default SizeMe;