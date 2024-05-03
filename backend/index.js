const express = require("express");
const cors = require("cors");
const app = express();
const axios = require("axios");
const PORT = 3000;

const getUsersFromText = (text)=>{
    if(text== undefined || text =='' || text ==null)return [];
    const users = new Set();
    const regex = /@(\w+)/g;
    length = text.length
    let match;
    while ((match = regex.exec(text)) !== null) {
        if(match[1]!='')users.add('@' +match[1]);
    }
    return users;
}
const getUsers = (response) => {
  if(response == undefined ||response ==[] || response == null)return [];
  const users = new Set();
  response.forEach((interaction)=>{
    getUsersFromText(interaction.text).forEach((user)=>{
        users.add(user);
    })
  })
  response.forEach((interaction)=>{
    if(interaction.user){
        if(interaction.user.screen_name!='') users.add('@'+interaction.user.screen_name);
    }
  })
  return users;
};

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello from Politico");
});

app.get("/query", async (req, res) => {
  const circle = new Set();
  const userName = req.query.username;
  var queryString = `https://api.twitterpicker.com/user/data?minimal=twittercircle&id=${userName}`;
  const initialResponse = await axios.get(queryString);
  if (initialResponse.data.result === "error") {
    res.status(200).json({
      status: "account suspended",
    });
    return;
  }
  const id = initialResponse.data.id_str;

  var queryString = `https://api.twitterpicker.com/user/timeline?minimal=twittercircle&username=${id}`;
  var timelineResponse = await axios.get(queryString);
  var timelineCursor = timelineResponse.data.cursor;
  getUsers(timelineResponse.data.entries).forEach((user)=>{
    circle.add(user);
  });;

  while (timelineCursor) {
    queryString = `https://api.twitterpicker.com/user/timeline?minimal=twittercircle&username=${id}&cursor=${timelineCursor}`;
    timelineResponse = await axios.get(queryString);
    if(timelineResponse.data.entries == undefined || timelineResponse.data.entries == ''){
        break;
    }
    getUsers(timelineResponse.data.entries).forEach((user)=>{
        circle.add(user);
      });
    timelineCursor = timelineResponse.data.cursor;
  }
  queryString = `https://api.twitterpicker.com/user/likes?minimal=twittercircle&username=${id}`;
  var likesResponse = await axios.get(queryString);
  var likesCursor = likesResponse.data.cursor;
  getUsers(likesResponse.entries).forEach((user)=>{
    circle.add(user);
  });

  while (likesCursor) {
    queryString = `https://api.twitterpicker.com/user/likes?minimal=twittercircle&username=${id}&cursor=${timelineCursor}`;
    likesResponse = await axios.get(queryString);
    if(likesResponse.data.entries == undefined || likesResponse.data.entries == ''){
        break;
    }
    getUsers(likesResponse.data.entries).forEach((user)=>{
        circle.add(user);
      });
    likesCursor = likesResponse.data.cursor;
  }
  var handles = [];
  circle.forEach((handle)=>{
    handles.push(handle);
  })
  res.status(200).json({
    status: "success",
    circle: handles
  });
  console.log(handles);
  console.log("Response Served")
});

app.listen(PORT, () => {
  console.log("Server Started on PORT : " + PORT);
});
