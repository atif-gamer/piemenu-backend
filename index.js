import app from "./app.js";
import ConnectDb from "./db/db.js";


ConnectDb().then(() => {
    app.listen(process.env.PORT, () => {
        console.log("server is running on", process.env.PORT);
    })
}).catch(error => {
    console.log(error);
})


