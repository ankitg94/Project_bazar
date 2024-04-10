import mongoose from "mongoose";
  import colors from "colors";
  
  const connectdb = async () => {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URL);
      console.log( `Connected To mongodb Database ${conn.connection.host}`.bgGreen );
    } catch (error) {
      console.log(`Error in mongodb ${error}`.bgRed.white);
    }
  };
  export default connectdb;

/*
// practise 
import mongoose from "mongoose";

const connectdb = async()=>{
    try{
    const connect = await mongoose.connect(process.env.MONGO_URL)
        console.log(`your database connection ${connect.connection.host}`)
    }
    catch(error){
       console.log(error)
    }
}
export default connectdb;
*/
