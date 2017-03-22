import React, { PropTypes } from "react";
import ProfileSelect from "../common/ProfileSelect.jsx";
import { sizeSelector } from "../api/sizeme-api";
import SizeSlider from "../common/SizeSlider.jsx";

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

class DetailsSizeSelector extends React.Component {

    componentDidMount () {
        const select = sizeSelector.clone();
        select.value = sizeSelector.getSelected();
        select.addEventListener("change", (event) => {
            sizeSelector.setSelected(event.target.value);
        });
        this.container.appendChild(select);
    }

    render () {
        return <div ref={(container) => { this.container = container; }} />;
    }
}

class SizeGuideDetails extends React.Component {

    render () {
        return (
            <div className="size-guide-details">
                <DetailSection title="Shopping for">
                    <ProfileSelect onSelectProfile={this.props.onSelectProfile}
                                   selectedProfile={this.props.selectedProfile}
                                   profiles={this.props.profiles}
                    />
                </DetailSection>
                <DetailSection title="Selected size">
                    <DetailsSizeSelector/>
                </DetailSection>
                <DetailSection title="Overall fit">
                    <SizeSlider/>
                </DetailSection>
                <DetailSection title="Detailed fit - overlaps"/>
            </div>
        );
    }
}

SizeGuideDetails.propTypes = {
    onSelectProfile: React.PropTypes.func.isRequired,
    selectedProfile: PropTypes.string.isRequired,
    profiles: PropTypes.arrayOf(PropTypes.object)
};

export default SizeGuideDetails;