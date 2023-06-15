import PropTypes from "prop-types";
import React from "react";
import ReactTooltip from "react-tooltip";

import { contextAddress } from "../api/sizeme-api";
import "./ProfileMenu.scss";

const ProfileMenu = (props) => {
  const selectProfile = (e, profileId) => {
    if (e.target.classList.contains("profile") || e.target.classList.contains("profile-name")) {
      props.setSelectedProfile(profileId);
    }
  };

  const profileAddress = (profileId) =>
    `${contextAddress}/account/profiles/${profileId}/profile.html`;

  return (
    <div className="profile-menu-container">
      <i className="fa-solid fa-cog fa-lg" data-tip data-for="profile-menu" data-event="click" />
      <ReactTooltip
        id="profile-menu"
        className="profile-menu"
        globalEventOff="click"
        place="left"
        type="light"
        effect="solid"
      >
        <div className="profile-list">
          {props.profiles.map((profile) => (
            <div key={profile.id} className="profile" onClick={(e) => selectProfile(e, profile.id)}>
              <span
                className={
                  "profile-name" + (profile.id === props.selectedProfile ? " selected" : "")
                }
              >
                {profile.profileName}
              </span>
              <a href={profileAddress(profile.id)} target="_blank" rel="noopener noreferrer">
                <i className="fa-solid fa-pencil" />
              </a>
            </div>
          ))}
          <div className="profile">
            <a
              className="profile-name add-new"
              href={`${contextAddress}/account/profiles.html`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Add new profile
            </a>
          </div>
        </div>
      </ReactTooltip>
    </div>
  );
};

ProfileMenu.propTypes = {
  profiles: PropTypes.array.isRequired,
  selectedProfile: PropTypes.string.isRequired,
  setSelectedProfile: PropTypes.func.isRequired,
};

export default ProfileMenu;
