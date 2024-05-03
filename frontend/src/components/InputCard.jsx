import { TextField, Button} from "@mui/material";
import { useState } from "react";
import axios from 'axios';


import "./InputCard.css";

function InputCard() {
  const [userName, setUserName] = useState("");

  const onUsernameChange = (ev) => {
    setUserName(ev.target.value);
  };

  const BASE_URL = 'http://localhost:3000'
  
  const onGenerateClick = () => {
    var queryString = `${BASE_URL}/query?username=${userName}`
    console.log(queryString);
    axios.get(queryString).then((response)=>{
      console.log(response.data);
    }).catch((reason)=>{
      console.log(reason);
    });
  };

  return (
    <div className="input-card-container">
      <div className="input-container">
        <TextField
          id="standard-basic"
          label="Username"
          variant="standard"
          value={userName}
          onChange={onUsernameChange}
          size="small"
          required= {true}
          className="input-style"
        ></TextField>
        <Button variant="contained" onClick={onGenerateClick} size="medium" className="button-container">
          Generate
        </Button>
      </div>
    </div>
  );
}
export default InputCard;
