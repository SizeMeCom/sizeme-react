import React from "react";
import Modal from "react-modal";

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
                    className="size-guide-content"
                    overlayClassName="size-guide-overlay"
                >
                    <h2>Hello</h2>
                </Modal>
            </div>
        );
    }
}

export default SizeGuide;
