import mongoose from "mongoose"

const ConnectDb = async () => {
    console.log('connecting to db');
    console.log(process.env.MONGOOS_URI);
    try {
        const connection = await mongoose.connect("mongodb+srv://atifahmad:cv9Jy8PcL67qZHge@pie-menu.p6gug.mongodb.net/piemenu")

        console.log(connection.connection.host);
    }
    catch (err) {
        console.log("Error connecting to database", err);
        process.exit(1)
    }
}

export default ConnectDb;