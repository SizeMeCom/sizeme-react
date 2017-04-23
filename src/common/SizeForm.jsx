import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setProfileMeasurements } from "../api/sizeme-api";
import i18n from "../api/i18n";
import ProductModel, { humanMeasurementMap } from "../api/ProductModel";
import MeasurementInput from "./MeasurementInput.jsx";
import FontAwesome from "react-fontawesome";
import ReactTooltip from "react-tooltip";
import Modal from "react-modal";
import VideoGuide from "./VideoGuide.jsx";
import Optional from "optional-js";
import OverlapBox from "../illustrations/OverlapBox";

const STORE_KEY = "sizemeProvisionalMeasurements";

class SizeForm extends React.Component {

    constructor (props) {
        super(props);
        this.fields = props.fields.map(field => ({
            field,
            humanProperty: humanMeasurementMap.get(field)
        }));
        const fromStore = localStorage.getItem(STORE_KEY);
        const measurements = Object.assign(...this.fields.map(f => ({ [f.humanProperty]: null })),
            fromStore ? JSON.parse(fromStore) : {}
        );
        this.state = { guideModalOpen: false, measurements };
        this.activeTooltip = null;
    }

    componentDidMount () {
        this.props.onChange(this.state.measurements);
    }

    valueChanged (humanProperty) {
        return value => {
            const measurements = Object.assign(this.state.measurements,
                { [humanProperty]: value }
            );
            this.setState({ measurements }, () => {
                localStorage.setItem(STORE_KEY, JSON.stringify(this.state.measurements));
                this.props.onChange(this.state.measurements);
            });
        };
    }

    setActiveTooltip = field => {
        this.activeTooltip = field;
    };

    openGuideModal = () => {
        this.setState({ guideModalOpen: true });
    };

    closeGuideModal = () => {
        this.setState({ guideModalOpen: false });
    };

    tooltipContent = () => {
        const linkTexts = i18n.MEASUREMENT_TOOLTIPS.link_to_guide;
        return (
            <div>
                <ul>
                    {(i18n.MEASUREMENT_TOOLTIPS[this.activeTooltip] || []).map((text, i) => (
                        <li key={i}>{text}</li>
                    ))}
                </ul>
                <div className="measurement-guide-link">
                    {linkTexts.start} <a onClick={this.openGuideModal}>
                    {linkTexts.link}</a> {linkTexts.end} <FontAwesome name="play-circle" inverse/>
                </div>
            </div>
        );
    };

    modalContent = () => {
        if (!this.activeTooltip) {
            return null;
        }
        const humanMeasurement = humanMeasurementMap.get(this.activeTooltip);
        const humanMeasurementName = i18n.HUMAN_MEASUREMENTS[humanMeasurement];
        return (
            <div>
                <div className="measurement-instruction-box">
                    <FontAwesome name="times" onClick={this.closeGuideModal}/>
                    <h2 className="instruction-title">
                        {i18n.MEASUREMENT_GUIDE.title} {humanMeasurementName.toLowerCase()}
                    </h2>
                    <div className={`instruction-content gender-${this.props.gender}`}
                         dangerouslySetInnerHTML={{ __html: i18n.MEASUREMENT_GUIDE[this.activeTooltip] }}/>
                </div>
                <VideoGuide measurement={humanMeasurement} gender={this.props.gender}/>
            </div>
        );
    };

    getLeftPosition = () => {
        if (!this.elem) {
            return "50%";
        } else {
            const left = Math.max(0, this.elem.getBoundingClientRect().left - 300);
            return `${left}px`;
        }
    };

    render () {
        const getFit = field => this.props.matchResult && this.props.matchResult.matchMap[field];
        const fitRange = field => Optional.ofNullable(getFit(field))
            .map(res => ProductModel.getFit(res).label)
            .orElse(null);
        return (
            <div className="measurement-input-table" ref={el => { this.elem = el; }}>
                {this.fields.map(({ field, humanProperty }) => (
                    <div className="measurement-cell" key={field}>
                        <div className="label">
                            <div>{i18n.HUMAN_MEASUREMENTS[humanProperty]}</div>
                            <FontAwesome data-for="input-tooltip" data-tip
                                         data-event="click" name="question-circle"
                                         data-place="right" data-class="measurement-tooltip"
                                         data-effect="solid"
                                         onMouseEnter={() => {this.setActiveTooltip(field);}}
                            />
                        </div>
                        <MeasurementInput onChange={this.valueChanged(humanProperty)} unit="cm"
                                          value={this.state.measurements[humanProperty]}
                                          fitRange={fitRange(field)}
                        />
                        {Optional.ofNullable(getFit(field)).map(f =>
                            <OverlapBox fit={f} humanProperty={humanProperty}/>
                        ).orElse(null)}
                    </div>
                ))}
                <ReactTooltip id="input-tooltip" globalEventOff="click"
                              getContent={this.tooltipContent}/>
                <Modal isOpen={this.state.guideModalOpen}
                       onRequestClose={this.closeGuideModal}
                       className="measurement-guide-modal"
                       overlayClassName="measurement-guide-overlay"
                       contentLabel="SizeMe Measurement Guide"
                       style={{
                           content: {
                               left: this.getLeftPosition()
                           }
                       }}
                >
                    {this.modalContent()}
                </Modal>
            </div>
        );
    }
}

SizeForm.propTypes = {
    fields: PropTypes.arrayOf(PropTypes.string).isRequired,
    onChange: PropTypes.func.isRequired,
    gender: PropTypes.string.isRequired,
    matchResult: PropTypes.object
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
    onChange: setProfileMeasurements
}, dispatch);

export default connect(
    state => ({
        gender: Optional.ofNullable(state.selectedProfile)
            .flatMap(p => Optional.ofNullable(p.gender))
            .map(g => g.toLowerCase())
            .orElse("female"),
        matchResult: state.selectedSize && state.match.matchResult ?
            state.match.matchResult[state.selectedSize] : null
    }),
    mapDispatchToProps
)(SizeForm);
