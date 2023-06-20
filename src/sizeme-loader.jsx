import { selectSize, setSizemeHidden, sizemeStore } from "./api/sizeme-api";
import uiOptions from "./api/uiOptions";
import { createRoot } from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import { Provider } from "react-redux";
import SizeSelector from "./api/SizeSelector";
import "./scss/index.scss";
import SizeMeAppWrapper from "./SizeMeAppWrapper";
import { findVisibleElement } from "./common/utils";

if (uiOptions.toggler) {
  const sizemeHidden = !JSON.parse(localStorage.getItem("sizemeToggledVisible"));
  setSizemeHidden(sizemeHidden)(sizemeStore.dispatch);
}

const el = findVisibleElement(uiOptions.appendContentTo);

if (el) {
  const section = el.appendChild(document.createElement("div"));
  const root = createRoot(section);
  root.render(
    <I18nextProvider i18n={i18n}>
      <Provider store={sizemeStore}>
        <SizeMeAppWrapper />
      </Provider>
    </I18nextProvider>
  );

  SizeSelector.initSizeSelector((size) => sizemeStore.dispatch(selectSize(size, false)));
}
