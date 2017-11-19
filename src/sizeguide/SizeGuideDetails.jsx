import React from "react";
import PropTypes from "prop-types";
import ProfileSelect from "../common/ProfileSelect.jsx";
import SizingBar from "../common/SizingBar.jsx";
import SizeSelector from "../api/SizeSelector";
import DetailSection from "./DetailSection.jsx";
import DetailedFit from "./DetailedFit.jsx";
import HoverContainer from "./HoverContainer.jsx";
import Optional from "optional-js";
import ReactTooltip from "react-tooltip";
import { translate } from "react-i18next";

class DetailsSizeSelector extends React.Component {

    componentDidMount () {
        this.select = SizeSelector.getClone();
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

    componentDidMount () {
        ReactTooltip.rebuild();
    }

    render () {
        const { product, onHover, selectedSize, matchResult,
            onSelectProfile, selectedProfile, profiles, t } = this.props;

        const item = Object.assign({}, product.item, {
            measurements: product.item.measurements[selectedSize]
        });
        const match = Optional.ofNullable(selectedSize)
            .flatMap(size => Optional.ofNullable(matchResult)
                .map(r => r[size]))
            .orElse(null);

        return (
            <div className="size-guide-data size-guide-details">
                <DetailSection title={t("common.shoppingFor")}>
                    <ProfileSelect onSelectProfile={onSelectProfile}
                                   selectedProfile={selectedProfile}
                                   profiles={profiles}
                    />
                </DetailSection>
                <DetailSection title={t("common.selectedSize")}>
                    <DetailsSizeSelector selectedSize={selectedSize}/>
                </DetailSection>
                <DetailSection title={t("fitInfo.overallFit")}>
                    <SizingBar/>
                </DetailSection>
                <DetailSection title={t("detailed.tableTitle")}>
                    <div className="fit-table">
                        {product.model.measurementOrder.map((measurement, i) => (
                            <HoverContainer measurement={measurement} onHover={onHover} key={i}>
                                <div className="fit-wrapper" data-tip data-for="fit-tooltip">
                                    <DetailedFit measurement={measurement} num={i + 1}
                                                 item={item} measurementName={product.model.measurementName}
                                                 match={match}
                                    />
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
    onSelectProfile: PropTypes.func.isRequired,
    selectedProfile: PropTypes.string.isRequired,
    profiles: PropTypes.arrayOf(PropTypes.object),
    selectedSize: PropTypes.string.isRequired,
    onHover: PropTypes.func.isRequired,
    matchResult: PropTypes.object,
    product: PropTypes.object.isRequired,
    t: PropTypes.func
};      

export default translate()(SizeGuideDetails);