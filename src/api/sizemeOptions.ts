import { SizemeOptions } from "./types"

const sizemeOptions: SizemeOptions = {
    serviceStatus: "off",
    contextAddress: "",
    shopType: "magento",
    debugState: false,
    uiOptions: {},
    ...(window as any).sizeme_options
}

export default sizemeOptions
