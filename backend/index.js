const express = require('express')
const cors = require('cors');
const app = express();
const axios = require('axios');
const PORT = 3000;


const restClient = new axios.Axios();
app.use(cors())

app.get('/',(req,res)=>{
    res.send('Hello from Politico');
})

app.get('/query', (req,res)=>{
    const userName = req.query.username
    const queryString = `https://api.twitterpicker.com/user/data?minimal=twittercircle&id=${userName}`
    console.log(queryString)
    restClient.get(queryString).then((response)=>{
        console.log(response);
    })
    res.status(200).json({
        'political-inclination': 'BJP',
        'accuracy': '89%'
    });
});

app.listen(PORT, ()=>{
    console.log("Server Started on PORT : "+PORT);
})