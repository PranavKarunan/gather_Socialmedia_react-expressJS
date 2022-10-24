import User from "../models/User.js";
import bcrypt from "bcrypt";
import accessToken from "../helpers/generateToken.js";

const AdminLogin = async (req, res) => {
  try {
    const { email, password } = req.body.values;
    console.log(req.body.values);
    console.log(email);
    const Admin = await User.findOne({ email: email });
    console.log(Admin);
    const admin = await bcrypt.compare(password, Admin.password);
    console.log(admin);
    if (Admin.isAdmin) {
      if (admin) {
        // const token = accessToken(Admin)
        // console.log(token)
        console.log("login success");
        res.status(200).json(Admin);
      } else {
        console.log("wrong password");
        res.status(500).json({ message: "Wrong password" });
      }
    } else {
      console.log("sorry");
      res
        .status(500)
        .json({ message: "sorry..! You don't have the permission" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export { AdminLogin };
