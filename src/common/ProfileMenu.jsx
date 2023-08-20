import PropTypes from "prop-types";
import { Tooltip } from "react-tooltip";
import { contextAddress } from "../api/sizeme-api";
import "./ProfileMenu.scss";
import { useState } from "react";

const ProfileMenu = ({ profiles, selectedProfile, setSelectedProfile }) => {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const closeMenu = (open) => {
    if (!open) {
      setProfileMenuOpen(open);
    }
  };

  const selectProfile = (e, profileId) => {
    setSelectedProfile(profileId);
  };

  const profileAddress = (profileId) =>
    `${contextAddress}/account/profiles/${profileId}/profile.html`;

  return (
    <div className="profile-menu-container">
      <i
        className="fa-solid fa-cog fa-lg"
        id="profile-menu"
        onClick={() => setProfileMenuOpen((prev) => !prev)}
      />
      <Tooltip
        anchorSelect="#profile-menu"
        className="profile-menu"
        isOpen={profileMenuOpen}
        setIsOpen={closeMenu}
        openOnClick
        closeOnEsc
        place="left"
        variant="light"
      >
        <div className="profile-list">
          {profiles.map((profile) => (
            <div key={profile.id} className="profile" onClick={(e) => selectProfile(e, profile.id)}>
              <span
                className={"profile-name" + (profile.id === selectedProfile ? " selected" : "")}
              >
                {profile.profileName}
              </span>
              <a
                href={profileAddress(profile.id)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
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
      </Tooltip>
    </div>
  );
};

ProfileMenu.propTypes = {
  profiles: PropTypes.array.isRequired,
  selectedProfile: PropTypes.string.isRequired,
  setSelectedProfile: PropTypes.func.isRequired,
};

export default ProfileMenu;
