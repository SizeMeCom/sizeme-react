import { getSizemeOptions } from "./api/options"

//console.log("Initializing SizeMe, version " + VERSION + ", built on " + BUILD_DATE)

let sizemeDisabled = false

if (getSizemeOptions().serviceStatus === "off") {
    sizemeDisabled = true
}

if (!sizemeDisabled) {
    // postpone execution of this block to wait for the shop UI to finish rendering. At least
    // with KooKenka accordion component this was needed
    setTimeout(() => {
        import("./sizeme-loader")
    })
}

export {}