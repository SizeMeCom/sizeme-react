import React from "react";
import { connect } from "react-redux";
import Section from "./section/Section.jsx";
import SizeGuide from "./sizeguide/SizeGuide.jsx";
import SizeSlider from "./common/SizeSlider.jsx";
import SizeForm from "./common/SizeForm.jsx";
import { resolveAuthToken, getProfiles, getProduct, setSelectedProfile } from "./api/sizeme-api";

class SizeMeApp extends React.Component {

    componentDidMount () {
        const { dispatch } = this.props;
        Promise.all([
            dispatch(resolveAuthToken()).then(() => dispatch(getProfiles())),
            dispatch(getProduct())
        ]).then(() => dispatch(setSelectedProfile()));
    }

    render () {
        if (this.props.resolved) {
            return (
                <div className="sizeme-content">
                    <SizeSlider match={this.props.currentMatch} />
                    <SizeForm fields={this.props.measurementInputs} max={3} />
                    <SizeGuide/>
                    <Section/>
                </div>
            );
        } else {
            return null;
        }
    }
}

SizeMeApp.propTypes = {
    resolved: React.PropTypes.bool.isRequired,
    dispatch: React.PropTypes.func.isRequired,
    currentMatch: React.PropTypes.object,
    measurementInputs: React.PropTypes.arrayOf(React.PropTypes.string)
};

const mapStateToProps = (state) => ({
    resolved: state.authToken.resolved && state.productInfo.resolved,
    currentMatch: (state.selectedSize && state.match.matchResult) ? state.match.matchResult[state.selectedSize] : null,
    measurementInputs: state.productInfo.product ? state.productInfo.product.model.measurementOrder : null
});

export default connect(mapStateToProps)(SizeMeApp);
