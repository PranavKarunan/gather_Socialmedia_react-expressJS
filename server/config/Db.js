import mongoose from "mongoose";

const dbConnection = async () => {
  mongoose
    .connect(process.env.DB_URL, {
      useNewUrlParser: true,
    })
    .then(() => console.log("db connected"))
    .catch((err) => console.log("db connection failed ", err.message));
};

export default dbConnection;

