import { getUiOptions } from "./options"
import { findVisibleElement } from "./utils"

type ConstructorOptions = { event?: keyof HTMLElementEventMap; useCapture?: boolean }
type Selector =
    | DefaultSelect
    | SwatchesSelect
    | KooKenkaSwatchesSelect
    | HarrysOfLondonSelect
    | CrasmanForKooKenkaSelect
    | undefined

let selector: Selector
let selectSize = (_: string): void => {}

abstract class AbstractSelect<E extends HTMLElement> {
    el: E
    selectors: { [key: string]: () => void } = {}
    sizeMapper: Array<[string, string | null]> = []
    abstract getSize: (event: Event) => string | undefined
    abstract clearSelection: () => void

    protected constructor(element: E, { event, useCapture = false }: ConstructorOptions = {}) {
        this.el = element

        if (event) {
            element.addEventListener(
                event,
                (e) => {
                    const size = this.getSize(e)
                    if (size && this.sizeMapper.find(([s]) => s === size)) {
                        selectSize(size)
                    } else {
                        selectSize("")
                    }
                },
                useCapture
            )
        }
    }

    setSelected(val: string) {
        if (this.selectors[val]) {
            this.selectors[val]()
        } else {
            this.clearSelection()
            selectSize("")
        }
    }

    clone(): HTMLElement | null {
        return null
    }
}

class DefaultSelect extends AbstractSelect<HTMLSelectElement> {
    constructor(element: HTMLSelectElement) {
        super(element, { event: "change" })

        const options = element.querySelectorAll("option")
        const getSelectFn = (value: string) => () => {
            if (value !== this.el.value) {
                this.el.value = value || ""
                this.el.dispatchEvent(new Event("change"))
                this.el.dispatchEvent(new Event("sizemeChange"))
            }
        }

        for (let i = 0; i < options.length; i++) {
            const option = options.item(i)
            const value = option.getAttribute("value")
            if (value) {
                this.sizeMapper.push([value, option.textContent])
                this.selectors[value] = getSelectFn(value)
            }
        }
    }

    getSize = (e: Event) => (e.target as HTMLSelectElement).value

    getSelectedSize = () => this.el.value

    clearSelection = () => {
        this.el.value = ""
    }

    clone = () => {
        if (this.el) {
            const clone = this.el.cloneNode(true) as HTMLSelectElement
            clone.value = this.el.value
            clone.addEventListener("change", (event) => {
                const value = (event.target as HTMLSelectElement).value
                this.setSelected(value)
                selectSize(value)
            })
            return clone
        } else {
            return document.createElement("div")
        }
    }
}

class SwatchesSelect extends AbstractSelect<HTMLElement> {
    private getId = (li: Element) => li.id.replace("option", "")

    constructor(element: HTMLElement) {
        super(element, { event: "click", useCapture: true })

        const options = element.querySelectorAll("li")
        const mkSelectFn = (textSpan: HTMLElement) => () => textSpan.click()
        for (let i = 0; i < options.length; i++) {
            const option = options.item(i)
            const sizeValue = this.getId(option)
            const textSpan = option.querySelector("span.swatch-label")
            if (textSpan) {
                this.selectors[sizeValue] = mkSelectFn(textSpan as HTMLElement)
                this.sizeMapper.push([sizeValue, textSpan?.textContent?.trim() || null])
            }
        }
    }

    getSize = (e: Event) => {
        const parent = (e.target as HTMLElement).parentElement?.parentElement
        if (parent) {
            return this.getId(parent)
        }
    }

    clearSelection = () => {
        const selected = this.el.querySelector("li.selected")
        if (selected && selected.classList) {
            selected.classList.remove("selected")
        }
    }

    getSelectedSize = () => {
        const selected = this.el.querySelector("li.selected")
        if (selected) {
            return this.getId(selected)
        } else {
            return ""
        }
    }

    clone = () => {
        if (this.el) {
            const clone = this.el.cloneNode(true) as HTMLElement
            const clearSelected = () => {
                clone.querySelector("li.selected")?.classList.remove("selected")
            }

            const links = clone.querySelectorAll("li")
            const mkEventListener = (link: HTMLElement) => (e: Event) => {
                clearSelected()
                link.classList.add("selected")
                this.setSelected((e.currentTarget as HTMLElement).id.replace("option", ""))
            }
            for (let i = 0; i < links.length; i++) {
                const link = links.item(i)
                link.addEventListener("click", mkEventListener(link), true)
            }
            return clone
        } else {
            return document.createElement("div")
        }
    }
}

class KooKenkaSwatchesSelect extends AbstractSelect<HTMLElement> {
    private getId = (li: Element) => li.id.replace(/li-(\d+)-.*/, "$1")
    constructor(element: HTMLElement) {
        super(element, { event: "click", useCapture: true })

        const options = element.querySelectorAll("li")
        const mkSelectFn = (option: HTMLElement) => () => option.click()
        for (let i = 0; i < options.length; i++) {
            const option = options.item(i)
            const sizeValue = this.getId(option)
            this.selectors[sizeValue] = mkSelectFn(option)
            this.sizeMapper.push([sizeValue, option?.textContent?.trim() || null])
        }
    }

    getSize = (e: Event) => this.getId(e.target as HTMLElement)

    clearSelection = () => {
        const selected = this.el.querySelector("li.li_selected")
        if (selected && selected.classList) {
            selected.classList.remove("li_selected")
        }
    }

    getSelectedSize = () => {
        const selected = this.el.querySelector("li.li_selected")
        if (selected) {
            return this.getId(selected)
        } else {
            return ""
        }
    }
}

class HarrysOfLondonSelect extends AbstractSelect<HTMLElement> {
    constructor(element: HTMLElement) {
        super(element, { event: "click" })

        const sizeMaps: {
            [key: string]: Array<[string, string]>
        } = {}
        type SelectorEntry = {
            [key: string]: () => void
        }
        const selectorMap: {
            [key: string]: SelectorEntry
        } = {}
        const sizeTabs = document.querySelector("ul.size-tabs") as HTMLElement
        const sizeTabList = sizeTabs.querySelectorAll("li")

        const mkSelectFn = (sizeItem: HTMLElement) => () => {
            if (!sizeItem.classList.contains("selected")) {
                sizeItem.click()
            }
        }

        for (let i = 0; i < sizeTabList.length; i++) {
            const mapName = sizeTabList.item(i).dataset.name
            if (mapName) {
                const sizes: Array<[string, string]> = []
                const selectors: SelectorEntry = {}
                const sizeElems = element.querySelectorAll("ul.hidden-select-size." + mapName + " li")
                for (let j = 0; j < sizeElems.length; j++) {
                    const sizeItem = sizeElems.item(j) as HTMLElement
                    const size = sizeItem.dataset.size
                    const text = sizeItem?.textContent?.trim()
                    if (size && text) {
                        sizes.push([size, text])
                        selectors[size] = mkSelectFn(sizeItem)
                    }
                }
                sizeMaps[mapName] = sizes
                selectorMap[mapName] = selectors
            }
        }

        const setActiveSizeTab = () => {
            const activeSizeMapName = (sizeTabs?.querySelector("li.active") as HTMLElement)?.dataset.name
            if (activeSizeMapName) {
                this.sizeMapper = sizeMaps[activeSizeMapName]
                this.selectors = selectorMap[activeSizeMapName]
            }
        }
        setActiveSizeTab()
        sizeTabs.addEventListener(
            "click",
            () =>
                setTimeout(() => {
                    setActiveSizeTab()
                    selectSize(this.getSize() || "")
                }, 0),
            true
        )
    }

    getSize = () => {
        const selected = this.el.querySelector("ul.hidden-select-size.active li.selected")
        if (selected) {
            return (selected as HTMLElement).dataset.size
        } else {
            return ""
        }
    }

    getSelectedSize = this.getSize

    clearSelection = () => {}
}

class CrasmanForKooKenkaSelect extends AbstractSelect<HTMLElement> {
    constructor(element: HTMLElement) {
        super(element)

        const options = element.querySelectorAll("input[type=radio]") as NodeListOf<HTMLInputElement>
        const mkSelectFn = (option: HTMLElement) => () => option.click()

        const optionListener = (e: Event) => {
            const size = (e.target as HTMLElement).getAttribute("value")
            if (size && this.sizeMapper.find(([s]) => s === size)) {
                selectSize(size)
            } else {
                selectSize("")
            }
        }

        for (let i = 0; i < options.length; i++) {
            const option = options.item(i)
            const value = option.getAttribute("value")
            const text = option.labels ? option.labels[0]?.innerText : null
            if (value) {
                this.sizeMapper.push([value, text])
                this.selectors[value] = mkSelectFn(option)
                option.addEventListener("change", optionListener, false)
            }
        }
    }

    getSize = () => {
        const selected = this.el.querySelector("input[type=radio]:checked")
        if (selected) {
            return (selected as HTMLElement).dataset.size
        } else {
            return ""
        }
    }

    getSelectedSize = this.getSize

    clearSelection = () => {
        if (this.el) {
            const options = this.el.querySelectorAll("input[type=radio]") as NodeListOf<HTMLInputElement>
            for (let i = 0; i < options.length; i++) {
                options.item(i).checked = false
            }
        }
    }

    clone = () => {
        if (this.el) {
            const clone = this.el.cloneNode(true) as HTMLElement
            const options = clone.querySelectorAll("input[type=radio]") as NodeListOf<HTMLInputElement>
            const optionListener = (event: Event) => {
                const value = (event.target as HTMLInputElement).value
                this.setSelected(value)
                selectSize(value)
            }
            for (let i = 0; i < options.length; i++) {
                const option = options.item(i)
                option.addEventListener("change", optionListener, false)
            }
            return clone
        } else {
            return document.createElement("div")
        }
    }

    setSelected(val: string) {
        if (this.selectors[val]) {
            this.selectors[val]()
        } else {
            this.clearSelection()
            selectSize("")
        }
    }
}

const initSizeSelector = (selectSizeFn: (size: string) => void) => {
    selectSize = (size: string) => {
        selectSizeFn(size)
    }

    const uiOptions = getUiOptions()
    const element = findVisibleElement(uiOptions.invokeElement)
    if (element) {
        switch (uiOptions.sizeSelectorType) {
            case "swatches":
                selector = new SwatchesSelect(element)
                break

            case "swatches-koo":
                selector = new KooKenkaSwatchesSelect(element)
                break

            case "harrys":
                selector = new HarrysOfLondonSelect(element)
                break

            case "crasman-koo":
                selector = new CrasmanForKooKenkaSelect(element)
                break

            default:
                selector = new DefaultSelect(element as HTMLSelectElement)
        }
    }
}

const setSelectedSize = (size: string) => {
    selector && selector.setSelected(size)
}
const getClone = () => {
    return selector ? selector.clone() : null
}
const getSizeMapper = () => selector?.sizeMapper
const getSelectedSize = (): string => selector?.getSelectedSize() || ""

export default { initSizeSelector, setSelectedSize, getClone, getSizeMapper, getSelectedSize }
