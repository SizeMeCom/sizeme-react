import React, { PropTypes } from "react";

class DetailedFit extends React.Component {

    render () {
        return (
            <div className="detailed-fit">
                <div className="measurement-head">
                    <span className="num">{this.props.num}</span>{this.props.measurementName}
                </div>
                <div className="overlap">20.0 cm</div>
                <div className="fit-label">Slim</div>
            </div>
        );
    }
}

DetailedFit.propTypes = {
    num: PropTypes.number.isRequired,
    measurementName: PropTypes.string.isRequired,
    match: PropTypes.object,
    item: PropTypes.object.isRequired
};

export default DetailedFit;