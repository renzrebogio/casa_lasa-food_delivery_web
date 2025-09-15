import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://rebogio06renzmartin:e4FKCHWjMvK0zRET@cluster0.qe3oobr.mongodb.net/react-food-delivery-app').then(()=>console.log("DB Connected"));
}