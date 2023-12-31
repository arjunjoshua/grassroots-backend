const mongoose=require('mongoose');
require('dotenv').config();

const connectDB=async()=>{
    // if already connected, return
    if(mongoose.connections[0].readyState) return; 
    
    
const connectionURL=process.env.MONGO_URI;

//connect to database
await mongoose.connect(connectionURL,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
});
};

module.exports=connectDB;

