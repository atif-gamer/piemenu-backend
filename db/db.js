import mongoose from "mongoose"

const ConnectDb = async () => {
    console.log('connecting to db');
    try {
        const connection = await mongoose.connect(process.env.MONGOOS_URI)

        console.log(connection.connection.host);
    }
    catch (err) {
        console.log("Error connecting to database", err);
        process.exit(1)
    }
}

export default ConnectDb;