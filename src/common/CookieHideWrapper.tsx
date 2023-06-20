import { FC, PropsWithChildren, useEffect, useState } from "react";
import Cookies from "universal-cookie";

const maxAge = 90 * 24 * 60 * 60; // 90 days
const cookieName = "sizeme_no_product_splash";
const listeners: ((hidden: boolean) => void)[] = [];

const cookies = new Cookies();

export const hideSizeMe = () => {
  cookies.set(cookieName, "true", { path: "/", maxAge: maxAge });
  listeners.forEach((fn) => fn(true));
};

export const isSizeMeHidden = () => !!cookies.get(cookieName);

export const CookieHideWrapper: FC<PropsWithChildren> = ({ children }) => {
  const [hidden, setHidden] = useState(isSizeMeHidden());

  useEffect(() => {
    listeners.push(setHidden);
    return () => {
      const idx = listeners.indexOf(setHidden);
      if (idx >= 0) {
        listeners.splice(idx, 1);
      }
    };
  }, []);

  if (hidden) {
    return null;
  }

  return <>{children}</>;
};
