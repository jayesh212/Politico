import { TextField, Button} from "@mui/material";
import { useState } from "react";
import axios from 'axios';


import "./InputCard.css";
import SimpleTable from "./Table";

function InputCard() {
  const [userName, setUserName] = useState("");
  const [keyword,setKeyword] = useState("");
  const [circle, setCircle] = useState([]);
  const onUsernameChange = (ev) => {
    setUserName(ev.target.value);
  };

  const BASE_URL = 'http://localhost:3000'
  
  const onGenerateClick = () => {
    var queryString = `${BASE_URL}/query?username=${userName}&keyword=${keyword}`
    console.log(queryString);
    axios.get(queryString).then((response)=>{
      console.log(response.data);
      setCircle(response.data.circle);
    }).catch((reason)=>{
      console.log(reason);
    });
  };
  const onKeywordChange = (ev)=>{
    setKeyword(ev.target.value)
  }
  return (
    <div className="container">
    <div className="input-card-container">
      <div className="input-container">
        <TextField
          id="standard-basic"
          label="Keyword"
          variant="standard"
          value={keyword}
          onChange={onKeywordChange}
          size="small"
          required= {true}
          className="input-style"
        ></TextField>
        <Button variant="contained" onClick={onGenerateClick} size="medium" className="button-container">
          Query
        </Button>
      </div>
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
    <SimpleTable data={circle}/>
    </div>
  );
}
export default InputCard;
