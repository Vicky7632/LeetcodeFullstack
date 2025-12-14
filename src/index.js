const express=require('express');
require('dotenv').config();
const app=express();
const main=require('./config/database');
const cookieParser=require('cookie-parser');
const authRouter=require("./routes/userAuth");
const problemRouter=require('./routes/problemCreator')
const redisClient=require("./config/redis");
const submitRouter=require("./routes/submit");
const aiRouter=require("./routes/aiChatting");
const videoRouter = require("./routes/videoCreator");
const cors=require('cors');
//using cors
app.use(cors({
    //* for everyonre in origin
    origin:['http://localhost:5173','http://127.0.0.1:5173'],
    credentials:true
}))

app.use(express.json());
app.use(cookieParser());
app.use('/user',authRouter);
app.use('/problem',problemRouter);
app.use('/submission',submitRouter);
app.use('/ai',aiRouter);
app.use("/video",videoRouter);

const initializeConnection = async () => {
    try {
        await Promise.all([
            redisClient.connect(),
            main()
        ]);

        console.log(" Redis + MongoDB Connected");

        app.listen(process.env.PORT, () => {
            console.log(` Server running on port ${process.env.PORT}`);
        });

    } catch (err) {
        console.error(" Error:", err);
        process.exit(1);
    }
};

initializeConnection();
