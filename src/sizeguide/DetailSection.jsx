import React, { PropTypes } from "react";

const DetailSection = ({ title, children }) => (
    <div className="size-guide-details-section">
        <h2>{title}</h2>
        {children}
    </div>
);

DetailSection.propTypes = {
    title: PropTypes.string,
    children: PropTypes.node
};

export default DetailSection;