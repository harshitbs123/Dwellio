const express = require("express");
const app = express();
const session = require("express-session");

app.use(
  session({ secret: "mysecretstring", resave: false, saveUninitialized: true }),
);

app.get("/test" , (req,res) =>{
    if (req.session.count >= 1){
        req.session.count ++
    } else {
        req.session.count = 1
    };
    res.send(`You sent req ${req.session.count} times.`);
});

app.get("/register" , (req,res)=>{
    let {name} = req.query;
    req.session.name = name;
    res.send(name)
})

app.get("/hello" , (req,res)=>{
    res.send(`Hello ${req.session.name}`)
})

app.listen(3030, () => {
  console.log("Server running on port 3000");
});