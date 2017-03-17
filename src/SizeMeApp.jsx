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
        dispatch(resolveAuthToken())
            .then(() => dispatch(getProfiles()))
            .then(() => dispatch(setSelectedProfile()));

        dispatch(getProduct());
    }

    render () {
        if (this.props.resolved) {
            return (
                <div className="sizeme-content">
                    <SizeSlider/>
                    <SizeForm fields={['chest', 'front_height', 'sleeve']} />
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
    dispatch: React.PropTypes.func.isRequired
};


export default connect(state => ({ resolved: state.authToken.resolved && state.productInfo.resolved }))(SizeMeApp);
