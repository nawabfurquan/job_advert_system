import { TextField } from "@mui/material";
import React from "react";
import PhoneInput from "react-phone-input-2";
import theme from "../../../utils/theme/theme";

interface IPersonal {
  name: string;
  setName: (value: React.SetStateAction<string>) => void;
  email: string;
  setEmail: (value: React.SetStateAction<string>) => void;
  phone: string;
  setPhone: (value: React.SetStateAction<string>) => void;
  location: string;
  setLocation: (value: React.SetStateAction<string>) => void;
}

const UserProfilePersonal: React.FC<IPersonal> = ({
  name,
  setName,
  email,
  setEmail,
  phone,
  setPhone,
  location,
  setLocation,
}) => {
  return (
    <>
      <TextField
        label="Name"
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        margin="normal"
        inputProps={{ "data-testid": "name_field" }}
        required
      />
      <TextField
        label="Email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        margin="normal"
        disabled
        inputProps={{ "data-testid": "email_field" }}
      />
      <PhoneInput
        value={phone}
        onChange={(e) => setPhone(e)}
        placeholder="Enter your Phone Number"
        inputStyle={{ width: "100%", ...theme.typography.body1 }}
        enableSearch
        containerStyle={{
          width: "100%",
          height: "100%",
          marginTop: "16px",
        }}
        inputProps={{ "data-testid": "phone_field" }}
      />
      <TextField
        label="Location"
        name="location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        fullWidth
        margin="normal"
        required
        inputProps={{ "data-testid": "location_field" }}
      />
    </>
  );
};

export default UserProfilePersonal;
