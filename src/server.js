const express = require('express')
const cors = require('cors');
const endpoints = require('express-list-endpoints')
const port = process.env.PORT || 3001


server.use(express.json())
server.use("/api", services)


server.listen(port,()=>{
    console.info(' ✅  Server is running on port ' + port + "with these endpoints: " + endpoints)
});


server.on("error",(error)=>{
    console.error(' ❌ Error : server is not running :  ' + error )
});