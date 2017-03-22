import React, { PropTypes } from "react";
import Modal from "react-modal";
import FontAwesome from "react-fontawesome";
import SizeGuideItem from "./SizeGuideItem.jsx";
import SizeGuideDetails from "./SizeGuideDetails.jsx";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setSelectedProfile } from "../api/sizeme-api";

class SizeGuide extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            guideIsOpen: false
        };
    }

    openGuide = () => {
        this.setState({ guideIsOpen: true });
    };

    closeGuide = () => {
        this.setState({ guideIsOpen: false });
    };

    render () {
        return (
            <div>
                <a className="a_button sm_detailed_view size_guide" id="popup_opener"
                   onClick={this.openGuide}>Size guide</a>
                <Modal
                    isOpen={this.state.guideIsOpen}
                    onRequestClose={this.closeGuide}
                    contentLabel="Size Guide"
                    className="size-guide-modal"
                    overlayClassName="size-guide-overlay"
                >
                    <div className="modal-wrapper">
                        <div className="modal-header">
                            <span className="size-guide-title">Detailed view for <span
                                className="item-name">{this.props.product.name}</span>
                            </span>
                            <a className="size-guide-close" role="button" onClick={this.closeGuide}>
                                <FontAwesome name="times" title="Close"/>
                            </a>
                        </div>

                        <div className="modal-body">
                            <div className="size-guide-content">
                                <SizeGuideItem/>
                                <SizeGuideDetails onSelectProfile={this.props.onSelectProfile}
                                                  selectedProfile={this.props.selectedProfile ?
                                                      this.props.selectedProfile.id : ""}
                                                  profiles={this.props.profiles}
                                />

                            </div>
                        </div>

                        <div className="modal-footer"/>
                    </div>
                </Modal>
            </div>
        );
    }
}

SizeGuide.propTypes = {
    product: PropTypes.object.isRequired,
    profiles: PropTypes.arrayOf(PropTypes.object),
    selectedProfile: PropTypes.object,
    selectedSize: PropTypes.string
};

const mapStateToProps = (state) => ({
    product: state.productInfo.product,
    profiles: state.profileList.profiles,
    selectedProfile: state.selectedProfile,
    selectedSize: state.selectedSize
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
    onSelectProfile: setSelectedProfile
}, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SizeGuide);
