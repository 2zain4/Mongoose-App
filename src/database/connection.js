import mongoose from "mongoose";
export const databaseConnection = async()=>{
    await mongoose.connect('mongodb://127.0.0.1:27017/Assignment9').then(()=>{
        console.log("database Connected");
    }).catch((err)=>{
        console.log(err); 
    })
}