const express = require('express');
const app = express();
const env = require("dotenv");

env.config();

app.use(express.json()); 
app.use(express.urlencoded({extended: true})); 

const notificationRoutes = require('./routes/notifications');

app.use('/api/notifications',notificationRoutes);


app.listen(5000,()=>{
    console.log(`Api Server running on port ${process.env.PORT}`);
});