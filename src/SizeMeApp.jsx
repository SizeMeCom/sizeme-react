//noinspection Eslint
import React from "react";
import VisibleSection from "./section/VisibleSection";
import SizeGuide from "./sizeguide/SizeGuide.jsx";

const SizeMeApp = () => (
    <div className="sizeme-content">
        <SizeGuide/>
        <VisibleSection/>
    </div>
);

export default SizeMeApp;