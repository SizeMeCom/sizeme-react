import PropTypes from "prop-types";
import React from "react";

class HoverContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (this.el) {
      this.el.addEventListener("mouseenter", () => {
        this.props.onHover(this.props.measurement);
      });
      this.el.addEventListener("mouseleave", () => {
        this.props.onHover("");
      });
    }
  }

  render() {
    return React.cloneElement(React.Children.only(this.props.children), {
      ref: (el) => {
        this.el = el;
      },
    });
  }
}

HoverContainer.propTypes = {
  children: PropTypes.node,
  measurement: PropTypes.string.isRequired,
  onHover: PropTypes.func.isRequired,
};

export default HoverContainer;
