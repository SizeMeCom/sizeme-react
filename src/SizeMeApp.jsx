import React from "react";
import Section from "./section/Section.jsx";
import SizeGuide from "./sizeguide/SizeGuide.jsx";
import SizeSlider from "./common/SizeSlider.jsx";

const SizeMeApp = () => (
    <div className="sizeme-content">
        <SizeSlider fitValue="" />
        <SizeGuide/>
        <Section/>
    </div>
);

export default SizeMeApp;
