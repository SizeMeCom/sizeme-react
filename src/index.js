/* global VERSION, BUILD_DATE */
//import "@babel/polyfill";

(async sizemeOptions => {
    if (!sizemeOptions) {
        return;
    }

    console.log("Initializing SizeMe, version " + VERSION + ", built on " + BUILD_DATE);

    let sizemeDisabled = false;

    if (sizemeOptions.serviceStatus === "ab") {
        const abTesting = await import("./ab-testing");
        sizemeDisabled = abTesting();
    }

    if (!sizemeDisabled) {
        // postpone execution of this block to wait for the shop UI to finish rendering. At least
        // with KooKenka accordion component this was needed
        setTimeout(() => {
            import("./sizeme-loader");
        });
    }
})(window.sizeme_options);
