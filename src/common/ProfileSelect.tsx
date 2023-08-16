import { Profile } from "../types/api";
import { ChangeEvent, FC } from "react";

interface Props {
  selectedProfile?: string;
  profiles: Profile[];
  onSelectProfile: (id: string) => void;
}

const ProfileSelect: FC<Props> = ({ selectedProfile, profiles, onSelectProfile }) => {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onSelectProfile?.(event.target.value);
  };

  return (
    <div>
      <select value={selectedProfile || ""} onChange={handleChange} className="profile-select">
        {profiles.map((profile) => (
          <option key={profile.id} value={profile.id}>
            {profile.profileName}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ProfileSelect;
