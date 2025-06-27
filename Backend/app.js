const express = require("express");
const app = express();
const connectDb = require("../Backend/config/dataBase");
const authRouter = require("../Backend/routes/auth");
const taskRouter = require("../Backend/routes/task");
const cookieParser = require("cookie-parser");
const cors = require("cors")

app.use(cors( {  //this the middleware cors middle ware used to resolev the cros oringin eror and 
    origin : "http://localhost:5173", // we have to five the origin of our fronted app
    credentials : true ,//this is used to allow the cokkie to be set in the browser
    methods: ["GET", "POST", "PUT", "DELETE","PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());
app.use(cookieParser())
app.use("/",authRouter);
app.use("/",taskRouter);



connectDb()
.then(()=>{
    console.log("dataBase connection is established");
    app.listen(5000,()=>{
        console.log("server is listening on port 3000");
    })
})
.catch(()=>{
    console.log("database can not be acessed")
})

