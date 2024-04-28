import { TextField, Button, Card } from "@mui/material";
import { useState } from "react";
import "./InputCard.css";

function InputCard() {
  const [userName, setUserName] = useState("");
  const onUsernameChange = (ev) => {
    setUserName(ev.target.value);
  };
  const onGenerateClick = () => {
    alert(userName);
  };
  return (
    <Card variant="outlined" className="input-card-container">
      <div className="input-container">
        <TextField
          id="standard-basic"
          label="Username"
          variant="standard"
          value={userName}
          onChange={onUsernameChange}
        ></TextField>
        <Button variant="contained" onClick={onGenerateClick}>
          Generate
        </Button>
      </div>
    </Card>
  );
}
export default InputCard;
