import { FC, useEffect, useRef, useState } from "react";
import SizeGuideModel from "../api/ProductModel";
import { writeItemCanvas } from "./itemGraphics";

interface Props {
  highlight?: string;
  matchMap: Map<string, unknown>;
  measurements: Map<string, unknown>;
  selectedSize?: string;
  selectedProfile: {
    id: string;
    selectDone: boolean;
  };
  model: SizeGuideModel;
  isGuide: boolean;
}

const SizeGuideItem: FC<Props> = (props) => {
  const [profile, setProfile] = useState<string>();
  const [size, setSize] = useState<string>();
  const [highlight, setHighlight] = useState<string>();

  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (
      props.highlight !== highlight ||
      (props.selectedProfile.selectDone &&
        (props.selectedProfile.id !== profile || props.selectedSize !== size))
    ) {
      setProfile(props.selectedProfile.id);
      setSize(props.selectedSize);
      setHighlight(props.highlight);
      writeItemCanvas(canvas.current, props);
    }
  }, [highlight, profile, props, size]);

  return (
    <div className="size-guide-item">
      <canvas id="sizeme-item-view" width={350} height={480} ref={canvas} />
    </div>
  );
};

export default SizeGuideItem;
