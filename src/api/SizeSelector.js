import uiOptions from "./uiOptions";

const sizeMapper = [];
let selector;
let selectSize = size => {};

class DefaultSelect {
    constructor (element) {
        element.addEventListener("change", (event) => {
            selectSize(event.target.value);
        });

        const options = element.querySelectorAll("option");
        for (let i = 0; i < options.length; i++) {
            const option = options.item(i);
            const value = option.getAttribute("value");
            if (value) {
                sizeMapper.push([value, option.textContent]);
            }
        }

        this.el = element;
    }

    setSelected = (val) => {
        if (this.el) {
            this.el.value = val || "";
            selectSize(val);
        }
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

class SwatchesSelect {
    constructor (element) {
        const options = element.querySelectorAll("li");
        this.selectors = {};
        for (let i = 0; i < options.length; i++) {
            const option = options.item(i);
            const sizeValue = option.id.replace("option", "");
            const textSpan = option.querySelector("span.swatch-label");
            if (textSpan) {
                this.selectors[sizeValue] = textSpan;
                sizeMapper.push([sizeValue, textSpan.textContent.trim()]);
            }
        }

        element.addEventListener("click",
            e => {
                const selected = e.target.parentNode.parentNode;
                selectSize(selected.id.replace("option", ""));
            },
            true
        );

        this.el = element;
    }

    setSelected = val => {
        if (this.selectors[val]) {
            this.selectors[val].click();
        }
    };

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

const initSizeSelector = selectSizeFn => {
    selectSize = selectSizeFn;
    const element = document.querySelector(uiOptions.invokeElement);
    if (element) {
        selector = uiOptions.sizeSelectorType === "swatches" ? new SwatchesSelect(element) :
            new DefaultSelect(element);
    } else {
        console.warn("Couldn't find selection element " + uiOptions.invokeElement);
    }
};

const setSelectedSize = size => {
    selector.setSelected(size);
};
const getClone = () => {
    return selector.clone();
};


export default { initSizeSelector, setSelectedSize, getClone, sizeMapper };