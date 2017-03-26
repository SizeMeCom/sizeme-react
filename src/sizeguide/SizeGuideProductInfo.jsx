import React, { PropTypes } from "react";
import DetailSection from "./DetailSection.jsx";
import { sizeSelector } from "../api/sizeme-api";
import i18n from "../api/i18n";
import HoverContainer from "./HoverContainer.jsx";

class SizeGuideProductInfo extends React.Component {

    hasNeckOpening = () => this.props.measurementOrder.includes("neck_opening_width");

    isInside = () => {
        const zero = this.props.getItemTypeComponent(0);
        return zero === 3 || zero === 4;
    };

    render () {
        const measurementName = measurement => i18n.MEASUREMENT[measurement];

        const measurementCell = (size, measurement) => (
            <HoverContainer measurement={measurement} key={measurement} onHover={this.props.onHover}>
                <td>{(this.props.measurements[size][measurement] / 10.0).toFixed(1)} cm</td>
            </HoverContainer>
        );

        return (
            <div className="size-guide-details">
                <DetailSection title={i18n.SIZE_GUIDE.table_title}>
                    <table className="product-info-table">
                        <thead>
                            <tr>
                                <th className="size-col">size</th>
                                {this.props.measurementOrder.map((measurement, i) => (
                                    <HoverContainer measurement={measurement} key={measurement}
                                                    onHover={this.props.onHover}>
                                        <th>
                                            <span className="num">{i + 1}</span>{measurementName(measurement)}
                                        </th>
                                    </HoverContainer>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                                {sizeSelector.sizeMapper.map(([size, sizeName]) => (
                                    <tr key={sizeName}>
                                        <td className="size-col">{sizeName}</td>
                                        {this.props.measurementOrder
                                            .map(measurement => measurementCell(size, measurement))}
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                    {this.isInside() ?
                        <div className="sizeme-explanation">
                            <div dangerouslySetInnerHTML={{ __html: i18n.SIZE_GUIDE.measurement_disclaimer_inside }}/>
                        </div> :
                        <div className="sizeme-explanation">
                            <div dangerouslySetInnerHTML={{ __html: i18n.SIZE_GUIDE.measurement_disclaimer }}/>
                            {this.hasNeckOpening() &&
                            <div dangerouslySetInnerHTML={{ __html: i18n.SIZE_GUIDE.measurement_disclaimer_collar }}/>
                            }
                        </div>
                    }

                </DetailSection>
            </div>
        );
    }
}

SizeGuideProductInfo.propTypes = {
    measurements: PropTypes.objectOf(PropTypes.object),
    measurementOrder: PropTypes.arrayOf(PropTypes.string).isRequired,
    onHover: PropTypes.func.isRequired,
    getItemTypeComponent: PropTypes.func.isRequired
};

export default SizeGuideProductInfo;