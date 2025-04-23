import app from "./app.js";
import ConnectDb from "./db/db.js";


ConnectDb().then(() => {
    app.listen(5001, () => {
        console.log("server is running");
    })
}).catch(error => {
    console.log(error);
})


