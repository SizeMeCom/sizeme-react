import uiOptions from "./uiOptions";
import { trackEvent } from "./ga";

const sizeMapper = [];
let selector;
let selectSize = size => {};

class AbstractSelect {
    constructor (element, { event, useCapture = false }) {
        this.el = element;
        this.selectors = {};
        this.currSel = "";

        element.addEventListener(event, e => {
            const size = this.getSize(e);
            console.log(this.currSel);
            console.log(size !== this.currSel);
            if (size !== this.currSel && sizeMapper.find(([s]) => s === size)) {
                selectSize(size);
            }
        }, useCapture);
    }

    setSelected = val => {
        if (this.selectors[val]) {
            this.selectors[val]();
            this.currSel = val;
            trackEvent("sizeRecommended", "Store: Recommended a size based on user input");
        } else {
            this.clearSelection();
            this.currSel = "";
            selectSize("");
            trackEvent("sizeCantRecommend", "Store: We couldnt find a size based on user input");
        }
    };
}

class DefaultSelect extends AbstractSelect {
    constructor (element) {
        super(element, { event: "change" });

        this.getSize = e => e.target.value;

        const options = element.querySelectorAll("option");
        const getSelectFn = (value) => () => {
            this.el.value = value || "";
            selectSize(value);
            element.dispatchEvent(new Event("change"));
        };

        for (let i = 0; i < options.length; i++) {
            const option = options.item(i);
            const value = option.getAttribute("value");
            if (value) {
                sizeMapper.push([value, option.textContent]);
                this.selectors[value] = getSelectFn(value);
            }
        }
    }

    clearSelection = () => {
        this.el.value = "";
    };

    clone = () => {
        if (this.el) {
            const clone = this.el.cloneNode(true);
            clone.value = this.el.value;
            clone.addEventListener("change", (event) => {
                this.setSelected(event.target.value);
            });
            return clone;
        } else {
            return document.createElement("div");
        }
    }
}

class SwatchesSelect extends AbstractSelect {
    constructor (element) {
        super(element, { event: "click", useCapture: true });

        const getId = li => li.id.replace("option", "");

        this.getSize = e => getId(e.target.parentNode.parentNode);

        this.clearSelection = () => {
            const selected = element.querySelector("li.selected");
            if (selected && selected.classList) {
                selected.classList.remove("selected");
            }
        };

        const options = element.querySelectorAll("li");
        for (let i = 0; i < options.length; i++) {
            const option = options.item(i);
            const sizeValue = getId(option);
            const textSpan = option.querySelector("span.swatch-label");
            if (textSpan) {
                this.selectors[sizeValue] = () => textSpan.click();
                sizeMapper.push([sizeValue, textSpan.textContent.trim()]);
            }
        }
    }

    clone = () => {
        if (this.el) {
            const clone = this.el.cloneNode(true);
            const clearSelected = () => {
                clone.querySelector("li.selected").classList.remove("selected");
            };

            const links = clone.querySelectorAll("li");
            for (let i = 0; i < links.length; i++) {
                const link = links.item(i);
                link.addEventListener("click", e => {
                    clearSelected();
                    link.classList.add("selected");
                    this.setSelected(e.currentTarget.id.replace("option", ""));
                }, true);
            }
            return clone;
        } else {
            return document.createElement("div");
        }
    };
}

class KooKenkaSwatchesSelect extends AbstractSelect {
    constructor (element) {
        super(element, { event: "click", useCapture: true });

        const getId = li => li.id.replace(/li-(\d+)-.*/, "$1");
        this.getSize = e => getId(e.target);

        this.clearSelection = () => {
            const selected = element.querySelector("li.li_selected");
            if (selected && selected.classList) {
                selected.classList.remove("li_selected");
            }
        };

        const options = element.querySelectorAll("li");
        for (let i = 0; i < options.length; i++) {
            const option = options.item(i);
            const sizeValue = getId(option);
            this.selectors[sizeValue] = () => option.click();
            sizeMapper.push([sizeValue, option.textContent.trim()]);
        }
    }
}

const initSizeSelector = selectSizeFn => {
    selectSize = size => {
        selectSizeFn(size);
        trackEvent("sizeChanged", "Store: Product size changed");
    };
    const getInstance = (constructor) => {
        const element = document.querySelector(uiOptions.invokeElement);
        if (element) {
            return new constructor(element);
        } else {
            console.warn("Couldn't find selection element " + uiOptions.invokeElement);
        }
    };
    switch (uiOptions.sizeSelectorType) {
        case "swatches":
            selector = getInstance(SwatchesSelect);
            break;

        case "swatches-koo":
            selector = getInstance(KooKenkaSwatchesSelect);
            break;

        default:
            selector = getInstance(DefaultSelect);
    }
};

const setSelectedSize = size => {
    selector.setSelected(size);
};
const getClone = () => {
    return selector.clone();
};


export default { initSizeSelector, setSelectedSize, getClone, sizeMapper };