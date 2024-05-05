const express = require("express");
const cors = require("cors");
const app = express();
const axios = require("axios");
const PORT = 3000;

const doesPostHaveKeyword = (text,keyword)=>{
    let regex = new RegExp("\\b" + keyword + "\\b");
    let match;
    while ((match = regex.exec(text)) !== null) {
        if(match[1]!=''){
            return true;
        }
    }
    return false;
}

const getAllValidPosts = (posts,keyword)=>{
    var validPosts = []
    posts.forEach((post)=>{
        if(doesPostHaveKeyword(post.text,keyword)){
            validPosts.push(post);
        }
    })
    return validPosts
}

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
function shuffle(handles) {
    let currentIndex = handles.length;
    while (currentIndex != 0) {
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [handles[currentIndex], handles[randomIndex]] = [
        handles[randomIndex], handles[currentIndex]];
    }
    return handles
}
app.use(cors());


app.get("/query", async (req, res) => {
  const circle = new Set();
  const userName = req.query.username.toLowerCase();
  const keyword  = req.query.keyword.toLowerCase();
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
  console.log(getAllValidPosts(timelineResponse.data.entries,keyword))
  getUsers(timelineResponse.data.entries).forEach((user)=>{
    circle.add(user);
  });
  var count = 0;
  while (timelineCursor) {
    count++;
    if(count>5)break;
    queryString = `https://api.twitterpicker.com/user/timeline?minimal=twittercircle&username=${id}&cursor=${timelineCursor}`;
    timelineResponse = await axios.get(queryString);
    if(timelineResponse.data.entries == undefined || timelineResponse.data.entries == ''){
        break;
    }
    console.log(getAllValidPosts(timelineResponse.data.entries,keyword))
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
  count = 0;
  while (likesCursor) {
    count++;
    if(count>5)break;
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
    handle = handle.toLowerCase();
    if(handle==`@${userName}`)return;
    handles.push(handle);
  })
  handles = shuffle(handles);
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
