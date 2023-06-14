import uiOptions from "./uiOptions";

import { findVisibleElement } from "../common/utils";

let selector;
let selectSize = () => {};

class AbstractSelect {
  constructor(element, { event, useCapture = false }) {
    this.el = element;
    this.selectors = {};
    this.sizeMapper = [];

    element.addEventListener(
      event,
      (e) => {
        const size = this.getSize(e);
        if (this.sizeMapper.find(([s]) => s === size)) {
          selectSize(size);
        } else {
          selectSize("");
        }
      },
      useCapture
    );
  }

  setSelected = (val) => {
    if (this.selectors[val]) {
      this.selectors[val]();
    } else {
      this.clearSelection();
      selectSize("");
    }
  };
}

class DefaultSelect extends AbstractSelect {
  constructor(element) {
    super(element, { event: "change" });

    this.getSize = (e) => e.target.value;

    const options = element.querySelectorAll("option");
    const getSelectFn = (value) => () => {
      if (value !== this.el.value) {
        this.el.value = value || "";
        this.el.dispatchEvent(new Event("change"));
        this.el.dispatchEvent(new Event("sizemeChange"));
      }
    };

    for (let i = 0; i < options.length; i++) {
      const option = options.item(i);
      const value = option.getAttribute("value");
      if (value) {
        this.sizeMapper.push([value, option.textContent]);
        this.selectors[value] = getSelectFn(value);
      }
    }
  }

  getSelectedSize = () => this.el.value;

  clearSelection = () => {
    this.el.value = "";
  };

  clone = () => {
    if (this.el) {
      const clone = this.el.cloneNode(true);
      clone.value = this.el.value;
      clone.addEventListener("change", (event) => {
        this.setSelected(event.target.value);
        selectSize(event.target.value);
      });
      return clone;
    } else {
      return document.createElement("div");
    }
  };
}

class SwatchesSelect extends AbstractSelect {
  constructor(element) {
    super(element, { event: "click", useCapture: true });

    const getId = (li) => li.id.replace("option", "");

    this.getSize = (e) => getId(e.target.parentNode.parentNode);

    this.clearSelection = () => {
      const selected = element.querySelector("li.selected");
      if (selected && selected.classList) {
        selected.classList.remove("selected");
      }
    };

    const options = element.querySelectorAll("li");
    const mkSelectFn = (textSpan) => () => textSpan.click();
    for (let i = 0; i < options.length; i++) {
      const option = options.item(i);
      const sizeValue = getId(option);
      const textSpan = option.querySelector("span.swatch-label");
      if (textSpan) {
        this.selectors[sizeValue] = mkSelectFn(textSpan);
        this.sizeMapper.push([sizeValue, textSpan.textContent.trim()]);
      }
    }

    this.getSelectedSize = () => {
      const selected = element.querySelector("li.selected");
      if (selected) {
        return getId(selected);
      } else {
        return "";
      }
    };
  }

  clone = () => {
    if (this.el) {
      const clone = this.el.cloneNode(true);
      const clearSelected = () => {
        clone.querySelector("li.selected").classList.remove("selected");
      };

      const links = clone.querySelectorAll("li");
      const mkEventListener = (link) => (e) => {
        clearSelected();
        link.classList.add("selected");
        this.setSelected(e.currentTarget.id.replace("option", ""));
      };
      for (let i = 0; i < links.length; i++) {
        const link = links.item(i);
        link.addEventListener("click", mkEventListener(link), true);
      }
      return clone;
    } else {
      return document.createElement("div");
    }
  };
}

class SwatchesWoostifySelect extends AbstractSelect {
  constructor(element) {
    super(element, { event: "click", useCapture: true });

    this.getSize = (e) => e.target.dataset.value;

    this.getSelectedSize = () => {
      const selected = element.querySelector("span.selected");
      if (selected) {
        return selected.dataset.value;
      } else {
        return "";
      }
    };

    this.clearSelection = () => {
      const selected = element.querySelector("span.selected");
      if (selected && selected.classList) {
        selected.classList.remove("selected");
      }
    };

    const options = element.querySelectorAll("span.swatch-label");
    const mkSelectFn = (option) => () => option.click();
    for (let i = 0; i < options.length; i++) {
      const option = options.item(i);
      const sizeValue = option.dataset.value;
      this.selectors[sizeValue] = mkSelectFn(option);
      this.sizeMapper.push([sizeValue, option.innerText.trim()]);
    }
  }

  clone = () => {
    if (this.el) {
      const clone = this.el.cloneNode(true);
      const clearSelected = () => {
        clone.querySelector("span.selected").classList.remove("selected");
      };

      const links = clone.querySelectorAll("span");
      const mkEventListener = (link) => (e) => {
        clearSelected();
        link.classList.add("selected");
        this.setSelected(e.currentTarget.dataset.value);
      };
      for (let i = 0; i < links.length; i++) {
        const link = links.item(i);
        link.addEventListener("click", mkEventListener(link), true);
      }
      return clone;
    } else {
      return document.createElement("div");
    }
  };
}

class KooKenkaSwatchesSelect extends AbstractSelect {
  constructor(element) {
    super(element, { event: "click", useCapture: true });

    const getId = (li) => li.id.replace(/li-(\d+)-.*/, "$1");
    this.getSize = (e) => getId(e.target);

    this.clearSelection = () => {
      const selected = element.querySelector("li.li_selected");
      if (selected && selected.classList) {
        selected.classList.remove("li_selected");
      }
    };

    this.getSelectedSize = () => {
      const selected = element.querySelector("li.li_selected");
      if (selected) {
        return getId(selected);
      } else {
        return "";
      }
    };

    const options = element.querySelectorAll("li");
    const mkSelectFn = (option) => () => option.click();
    for (let i = 0; i < options.length; i++) {
      const option = options.item(i);
      const sizeValue = getId(option);
      this.selectors[sizeValue] = mkSelectFn(option);
      this.sizeMapper.push([sizeValue, option.textContent.trim()]);
    }
  }
}

class HarrysOfLondonSelect extends AbstractSelect {
  constructor(element) {
    super(element, { event: "click" });

    this.getSize = () => {
      const selected = element.querySelector("ul.hidden-select-size.active li.selected");
      if (selected) {
        return selected.dataset.size;
      } else {
        return "";
      }
    };

    this.getSelectedSize = this.getSize;

    const sizeMaps = {};
    const selectorMap = {};
    const sizeTabs = document.querySelector("ul.size-tabs");
    const sizeTabList = sizeTabs.querySelectorAll("li");

    const mkSelectFn = (sizeItem) => () => {
      if (!sizeItem.classList.contains("selected")) {
        sizeItem.click();
      }
    };

    for (let i = 0; i < sizeTabList.length; i++) {
      const mapName = sizeTabList.item(i).dataset.name;
      const sizes = (sizeMaps[mapName] = []);
      const selectors = (selectorMap[mapName] = {});
      const sizeElems = element.querySelectorAll("ul.hidden-select-size." + mapName + " li");
      for (let j = 0; j < sizeElems.length; j++) {
        const sizeItem = sizeElems.item(j);
        sizes.push([sizeItem.dataset.size, sizeItem.textContent.trim()]);
        selectors[sizeItem.dataset.size] = mkSelectFn(sizeItem);
      }
    }

    const setActiveSizeTab = () => {
      const activeSizeMapName = sizeTabs.querySelector("li.active").dataset.name;
      this.sizeMapper = sizeMaps[activeSizeMapName];
      this.selectors = selectorMap[activeSizeMapName];
    };
    setActiveSizeTab();
    sizeTabs.addEventListener(
      "click",
      () =>
        setTimeout(() => {
          setActiveSizeTab();
          selectSize(this.getSize());
        }, 0),
      true
    );
  }
}

class CrasmanForKooKenkaSelect extends AbstractSelect {
  constructor(element) {
    super(element, { event: "" });

    const options = element.querySelectorAll("input[type=radio]");
    const mkSelectFn = (option) => () => option.click();

    for (let i = 0; i < options.length; i++) {
      const option = options.item(i);
      const value = option.getAttribute("value");
      if (value) {
        this.sizeMapper.push([value, option.labels[0].innerText]);
        this.selectors[value] = mkSelectFn(option);
        option.addEventListener(
          "change",
          (e) => {
            const size = e.target.getAttribute("value");
            if (this.sizeMapper.find(([s]) => s === size)) {
              selectSize(size);
            } else {
              selectSize("");
            }
          },
          false
        );
      }
    }

    this.getSize = () => {
      const selected = element.querySelector("input[type=radio]:checked");
      if (selected) {
        return selected.dataset.size;
      } else {
        return "";
      }
    };

    this.getSelectedSize = this.getSize;
  }

  clearSelection = () => {
    if (this.el) {
      const options = this.el.querySelectorAll("input[type=radio]");
      for (let i = 0; i < options.length; i++) {
        options.item(i).checked = false;
      }
    }
  };

  clone = () => {
    if (this.el) {
      const clone = this.el.cloneNode(true);
      for (let i = 0; i < clone.length; i++) {
        const option = clone.item(i);
        option.addEventListener(
          "change",
          (event) => {
            this.setSelected(event.target.value);
            selectSize(event.target.value);
          },
          false
        );
      }
      return clone;
    } else {
      return document.createElement("div");
    }
  };

  setSelected = (val) => {
    if (this.selectors[val]) {
      this.selectors[val]();
    } else {
      this.clearSelection();
      selectSize("");
    }
  };
}

const initSizeSelector = (selectSizeFn) => {
  selectSize = (size) => {
    selectSizeFn(size);
  };
  const getInstance = (constructor) => {
    const element = findVisibleElement(uiOptions.invokeElement);
    if (element) {
      return new constructor(element);
    }
  };
  switch (uiOptions.sizeSelectorType) {
    case "swatches":
      selector = getInstance(SwatchesSelect);
      break;

    case "swatches-koo":
      selector = getInstance(KooKenkaSwatchesSelect);
      break;

    case "harrys":
      selector = getInstance(HarrysOfLondonSelect);
      break;

    case "crasman-koo":
      selector = getInstance(CrasmanForKooKenkaSelect);
      break;

    case "swatches-woostify":
      selector = getInstance(SwatchesWoostifySelect);
      break;

    default:
      selector = getInstance(DefaultSelect);
  }
};

const setSelectedSize = (size) => {
  selector && selector.setSelected(size);
};
const getClone = () => {
  return selector ? selector.clone() : null;
};
const getSizeMapper = () => selector.sizeMapper;
const getSelectedSize = () => selector.getSelectedSize();

export default { initSizeSelector, setSelectedSize, getClone, getSizeMapper, getSelectedSize };
