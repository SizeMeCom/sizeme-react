import { sizemeStore } from "./api/sizeme-api";
import { setAbStatus } from "./api/actions";

export default () => {
  let sizemeDisabled = false;
  const storageABValue = localStorage.getItem("sizemeABDisabled");

  if (!storageABValue) {
    sizemeDisabled = Math.floor(Math.random() * 100) % 2 === 0;
    localStorage.setItem("sizemeABDisabled", JSON.stringify(sizemeDisabled));
  } else {
    sizemeDisabled = JSON.parse(storageABValue);
  }

  const abStatus = sizemeDisabled ? "B" : "A";
  console.log("SizeMe A/B testing, status: " + abStatus);
  sizemeStore.dispatch(setAbStatus(abStatus));

  return sizemeDisabled;
};
