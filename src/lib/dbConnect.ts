import mongoose, { Promise } from "mongoose";

type ConnectionObject ={
    isConnected?:number
}

const connection : ConnectionObject = {}

async function dbConnect():Promise<void>{
    if(connection.isConnected){
        console.log("Already connectd to database");
        return
    }
    try{
        const db = await mongoose.connect(process.env.
            MONGODB_URI || "",{})

            connection.isConnected = db.connections[0].readyState
            console.log("DB connected successfully");
            console.log("db.connection",db.connections);
            console.log("db console karte h",db);


    }
    catch(error){
        console.log("Database Connection failed",error)
       process.exit()
    }
    
}

export default dbConnect;