import React from "react";
import PropTypes from "prop-types";

class ProfileSelect extends React.Component {

    constructor (props) {
        super(props);
    }

    handleChange = (event) => {
        if (this.props.onSelectProfile) this.props.onSelectProfile(event.target.value);
    };

    render () {
        return (
            <div>
                <select value={this.props.selectedProfile || ""} onChange={this.handleChange}
                        className="profile-select">
                    {(this.props.profiles || []).map((profile) => (
                        <option key={profile.id} value={profile.id}>{profile.profileName}</option>
                    ))}
                </select>
            </div>
        );
    }
}

ProfileSelect.propTypes = {
    selectedProfile: PropTypes.string,
    profiles: PropTypes.arrayOf(PropTypes.object),
    onSelectProfile: PropTypes.func.isRequired
};

export default ProfileSelect;

