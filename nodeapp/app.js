const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000; // Port 3000 is default port

app.get("/", (req, res)=>{
    res.send("Hello World Server is up and running");
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})