import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setProfileMeasurements } from "../api/sizeme-api";
import i18n from "../api/i18n";
import { humanMeasurementMap } from "../api/ProductModel";
import MeasurementInput from "./MeasurementInput.jsx";
import FontAwesome from "react-fontawesome";
import ReactTooltip from "react-tooltip";
import Modal from "react-modal";
import VideoGuide from "./VideoGuide.jsx";

const STORE_KEY = "sizemeProvisionalMeasurements";

class SizeForm extends React.Component {

    constructor (props) {
        super(props);
        this.fields = props.fields.slice(0, props.max).map(field => ({
            field,
            humanProperty: humanMeasurementMap.get(field)
        }));
        const fromStore = localStorage.getItem(STORE_KEY);
        const storedMeasurements = fromStore ? JSON.parse(fromStore) : {};
        this.state = Object.assign({ guideModalOpen: false },
            ...this.fields.map(f => ({ [f.humanProperty]: null })),
            storedMeasurements
        );
        this.activeTooltip = null;
    }

    valueChanged (humanProperty) {
        return value => {
            this.setState({ [humanProperty]: value }, () => {
                localStorage.setItem(STORE_KEY, JSON.stringify(this.state));
                this.props.onChange(this.state);
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

    render () {
        return (
            <div className="measurement-input-table">
                {this.fields.map(({ field, humanProperty }) => (
                    <div className="measurement-cell" key={field}>
                        <div className="label">
                            {i18n.HUMAN_MEASUREMENTS[humanProperty]}
                            <FontAwesome data-for="input-tooltip" data-tip
                                         data-event="click" name="question-circle"
                                         data-place="right" data-class="measurement-tooltip"
                                         data-effect="solid"
                                         onMouseEnter={() => {this.setActiveTooltip(field);}}
                            />
                        </div>
                        <MeasurementInput onChange={this.valueChanged(humanProperty)} unit="cm"
                                              value={this.state[humanProperty]}/>
                    </div>
                ))}
                <ReactTooltip id="input-tooltip" globalEventOff="click"
                              getContent={this.tooltipContent}/>
                <Modal isOpen={this.state.guideModalOpen}
                       onRequestClose={this.closeGuideModal}
                       className="measurement-guide-modal"
                       overlayClassName="measurement-guide-overlay"
                       contentLabel="SizeMe Measurement Guide"
                >
                    {this.activeTooltip &&
                    <VideoGuide measurement={humanMeasurementMap.get(this.activeTooltip)}/>}
                </Modal>
            </div>
        );
    }
}

SizeForm.propTypes = {
    fields: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    max: React.PropTypes.number.isRequired,
    onChange: React.PropTypes.func.isRequired
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
    onChange: setProfileMeasurements
}, dispatch);

export default connect(
    () => ({}),
    mapDispatchToProps
)(SizeForm);
