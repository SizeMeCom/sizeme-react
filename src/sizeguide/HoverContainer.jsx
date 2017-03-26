import React, { PropTypes } from "react";

class HoverContainer extends React.Component {
    constructor (props) {
        super(props);
    }

    componentDidMount () {
        if (this.el) {
            this.el.addEventListener("mouseenter", () => {
                this.props.onHover(this.props.measurement);
            });
            this.el.addEventListener("mouseleave", () => {
                this.props.onHover("");
            });
        }
    }

    render () {
        const children = React.Children.map(this.props.children,
            child => React.cloneElement(child, {
                ref: (el) => { this.el = el; }
            })
        );
        return children[0];
    }
}

HoverContainer.propTypes = {
    children: PropTypes.node,
    measurement: PropTypes.string.isRequired,
    onHover: PropTypes.func.isRequired
};

export default HoverContainer;