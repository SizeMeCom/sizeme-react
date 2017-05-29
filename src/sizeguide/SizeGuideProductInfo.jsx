import React from "react";
import PropTypes from "prop-types";
import DetailSection from "./DetailSection.jsx";
import SizeSelector from "../api/SizeSelector";
import { translate } from "react-i18next";
import HoverContainer from "./HoverContainer.jsx";
import CookieHideWrapper, { hideSizeMe } from "../common/CookieHideWrapper.jsx";
import { openLoginFrame } from "../common/LoginFrame";

class SizeGuideProductInfo extends React.Component {

    hasNeckOpening = () => this.props.measurementOrder.includes("neck_opening_width");

    isInside = () => {
        const zero = this.props.getItemTypeComponent(0);
        return zero === 3 || zero === 4;
    };

    loginFrameOpener = (mode) => () => openLoginFrame("login-frame", mode);

    render () {
        const { t, measurements, measurementOrder, onHover } = this.props;
        const measurementName = measurement => t(`measurement.${measurement}`);

        const measurementCell = (size, measurement) => (
            <HoverContainer measurement={measurement} key={measurement} onHover={onHover}>
                <td>{(measurements[size][measurement] / 10.0).toFixed(1)} cm</td>
            </HoverContainer>
        );

        return (
            <div className="size-guide-data size-guide-product-info">
                <DetailSection title={t("sizeGuide.tableTitle")}>
                    <table className="product-info-table">
                        <thead>
                            <tr>
                                <th className="size-col">size</th>
                                {measurementOrder.map((measurement, i) => (
                                    <HoverContainer measurement={measurement} key={measurement}
                                                    onHover={onHover}>
                                        <th className="measurement-head">
                                            <span className="num">{i + 1}</span>{measurementName(measurement)}
                                        </th>
                                    </HoverContainer>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                                {SizeSelector.sizeMapper.map(([size, sizeName]) => (
                                    <tr key={sizeName}>
                                        <td className="size-col">{sizeName}</td>
                                        {measurementOrder.map(measurement => measurementCell(size, measurement))}
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                    {this.isInside() ?
                        <div className="sizeme-explanation">
                            <div dangerouslySetInnerHTML={{ __html: t("sizeGuide.measurementDisclaimerInside") }}/>
                        </div> :
                        <div className="sizeme-explanation">
                            <div dangerouslySetInnerHTML={{ __html: t("sizeGuide.measurementDisclaimer") }}/>
                            {this.hasNeckOpening() &&
                            <div dangerouslySetInnerHTML={{ __html: t("sizeGuide.measurementDisclaimerCollar") }}/>
                            }
                        </div>
                    }

                </DetailSection>

                <CookieHideWrapper>
                    <div className="size-guide-splash">
                        <p dangerouslySetInnerHTML={{ __html: t("splash.detailedText") }}/>
                        <div className="splash-choices">
                            <a onClick={this.loginFrameOpener("signup")} className="sign-up link-btn"
                               title={t("splash.btnSignUpTitle")}>{t("splash.btnSignUpLabel")}</a>

                            <a onClick={this.loginFrameOpener("login")} className="log-in link-btn"
                               title={t("splash.btnLogInTitle")}>{t("splash.btnLogInLabel")}</a>

                            <a href="#" className="no-thanks link-btn" onClick={hideSizeMe}
                               title={t("splash.btnNoThanksTitle")}>{t("splash.btnNoThanksLabel")}</a>

                        </div>
                    </div>
                </CookieHideWrapper>
            </div>
        );
    }
}

SizeGuideProductInfo.propTypes = {
    measurements: PropTypes.objectOf(PropTypes.object),
    measurementOrder: PropTypes.arrayOf(PropTypes.string).isRequired,
    onHover: PropTypes.func.isRequired,
    getItemTypeComponent: PropTypes.func.isRequired,
    t: PropTypes.func
};

export default translate()(SizeGuideProductInfo);