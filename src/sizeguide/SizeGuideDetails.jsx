import React, { PropTypes } from "react";
import ProfileSelect from "../common/ProfileSelect.jsx";
import { sizeSelector } from "../api/sizeme-api";
import SizeSlider from "../common/SizeSlider.jsx";
import DetailSection from "./DetailSection.jsx";
import DetailedFit from "./DetailedFit.jsx";
import i18n from "../api/i18n";
import HoverContainer from "./HoverContainer.jsx";

class DetailsSizeSelector extends React.Component {

    componentDidMount () {
        this.select = sizeSelector.clone();
        this.select.value = sizeSelector.getSelected();
        this.select.addEventListener("change", (event) => {
            sizeSelector.setSelected(event.target.value);
        });
        this.container.appendChild(this.select);
    }

    componentDidUpdate () {
        this.select.value = this.props.selectedSize;
    }

    render () {
        return <div ref={(container) => { this.container = container; }} />;
    }
}

DetailsSizeSelector.propTypes = {
    selectedSize: PropTypes.string.isRequired
};

class SizeGuideDetails extends React.Component {

    render () {
        const measurementName = measurement => i18n.MEASUREMENT[measurement];

        return (
            <div className="size-guide-data size-guide-details">
                <DetailSection title={i18n.COMMON.shopping_for}>
                    <ProfileSelect onSelectProfile={this.props.onSelectProfile}
                                   selectedProfile={this.props.selectedProfile}
                                   profiles={this.props.profiles}
                    />
                </DetailSection>
                <DetailSection title={i18n.COMMON.selected_size}>
                    <DetailsSizeSelector selectedSize={this.props.selectedSize}/>
                </DetailSection>
                <DetailSection title={i18n.FIT_INFO.overall_fit}>
                    <SizeSlider/>
                </DetailSection>
                <DetailSection title={i18n.DETAILED.table_title}>
                    <div className="fit-table">
                        {this.props.measurementOrder.map((measurement, i) => (
                            <HoverContainer measurement={measurement} onHover={this.props.onHover} key={i}>
                                <div className="fit-wrapper">
                                    <DetailedFit measurementName={measurementName(measurement)} num={i + 1}/>
                                </div>
                            </HoverContainer>
                        ))}
                    </div>
                </DetailSection>
            </div>
        );
    }
}

SizeGuideDetails.propTypes = {
    onSelectProfile: React.PropTypes.func.isRequired,
    selectedProfile: PropTypes.string.isRequired,
    profiles: PropTypes.arrayOf(PropTypes.object),
    selectedSize: PropTypes.string.isRequired,
    measurementOrder: PropTypes.arrayOf(PropTypes.string).isRequired,
    onHover: PropTypes.func.isRequired,
    matchResult: PropTypes.object,
    product: PropTypes.object.isRequired
};      

export default SizeGuideDetails;