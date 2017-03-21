import React from "react";
import Modal from "react-modal";
import FontAwesome from "react-fontawesome";

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
                    <div className="size-guide-titlebar">
                        <span className="size-guide-title">Detailed view for <span
                            className="item-name">T-SHIRT</span>
                        </span>
                        <a className="size-guide-close" role="button" onClick={this.closeGuide}>
                            <FontAwesome name="times" title="Close"/>
                        </a>
                    </div>
                    <div className="size-guide-content-container">
                        <div className="size-guide-content"/>
                    </div>
                    <div className="size-guide-footer"/>
                </Modal>
            </div>
        );
    }
}

export default SizeGuide;
