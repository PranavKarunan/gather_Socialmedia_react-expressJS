import bcrypt from "bcrypt";
import User from "../models/User.js";
import { dosms, otpVerify } from "../config/twilioConfig.js";
import { validEmail } from "../helpers/validate.js";
import accessToken from "../helpers/generateToken.js";


// User signup

const userRegister = async (req, res) => {
  const { firstName, lastName, userName, mobile, password, confirmPassword } =
    req.body;
    // let hashedPassword = await bcrypt.hash(password, 10);
    // let newUser = new User({
    //   firstName: firstName,
    //   lastName: lastName,
    //   userName: userName,
    //   mobileNumber: mobile,
    //   password: hashedPassword,
    // }).save();
  const userNameExist = User.findOne({ userName: userName });

  const uniqueId = Number(mobile);
  console.log(uniqueId);

  try {
    if (uniqueId) {
      let moblen = mobile.toString().length;
      console.log(moblen);
      if (moblen == 10) {
        let user = await User.findOne({ mobileNumber: mobile });

        if (user) {
          console.log("user is already exist");
          return res
            .status(400)
            .json({ message: "mobile already exists please try other" });
        } else {
          console.log("req.body is in backend");
          const userNameExist = await User.findOne({ userName: userName });
          if (userNameExist) {
            return res
              .status(400)
              .json({ message: "user name already exist please try other" });
          }
          let otp = dosms(mobile);

          if (!otp.valid) {
            res.status(200).json({
              created: true,
              hash: otp.hash,
              message: "OTP sent successfully",
              user: req.body.values,
            });
          }
        }
      } else {
        res.status(400).json({ message: "Please enter a valid number" });
        console.log("number not valid");
      }
    } else {
      if (!validEmail(mobile)) {
        return res.status(400).json({ message: "invalid email" });
      }
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

const otpValidation = async (req, res) => {
  const { otp, signupData } = req.body;

  try {
    let valid = await otpVerify(otp, signupData.mobile);
    console.log({ valid });
    let hashedPassword = await bcrypt.hash(signupData.password, 10);
    if (valid.valid) {
      let newUser = new User({
        firstName: signupData.firstName,
        lastName: signupData.lastName,
        userName: signupData.userName,
        mobileNumber: signupData.mobile,
        password: hashedPassword,
      }).save();
      const token = accessToken(newUser);
      console.log(token);
      res.status(201).json(newUser, token);
    } else {
      res.status(500).json({ message: "validation failed" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// Login user

const userLogin = async (req, res) => {
  const { userName, password } = req.body;
  const user = await User.findOne({ userName: userName });

  try {
    if (user) {
      const valid = await bcrypt.compare(password, user.password);
      if (valid) {
        const token = accessToken(user);
        console.log(token);
        res.status(200).json({
          firstName: user.firstName,
          mobileNumber: user.mobileNumber,
          userName: userName,
          _id: user._id,
          token,
        });
      } else {
        res.status(500).json({ message: "Please enter correct password" });
      }
    } else {
      res.status(500).json({
        message: "User not found!!! Please check your username and try again",
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// get user

const getUser = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id);

    if (user) {
      const { password, ...otherDetails } = user._doc;
      res.status(200).json(otherDetails);
    } else {
      res.status(404).json("user not exists");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// update a user

const updateUser = async (req, res) => {
  const id = req.params.id;
  const { currentUserId, currentUserAdminStatus, password } = req.body;

  if (id === currentUserId || currentUserAdminStatus) {
    try {
      if (password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(password, salt);
      }

      const user = await User.findByIdAndUpdate(id, req.body, { new: true });
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json(error.message);
    }
  } else {
    res.status(403).json("Access denied! You can only update your own profile");
  }
};

// Delete user
const deleteUser = async (req, res) => {
  const id = req.params.id;
  const { currentUserId, currentUserAdminStatus, password } = req.body;
  if (id === currentUserId || currentUserAdminStatus) {
    try {
      if (password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(password, salt);
      }

      const user = await User.findByIdAndDelete(id, req.body, { new: true });
      res.status(200).json("User deleted successfully");
    } catch (error) {
      res.status(500).json(error.message);
    }
  } else {
    res.status(403).json("Access denied! You can only delete your own profile");
  }
};

//  Follow a User

const followUser = async (req, res) => {
  const id = req.params.id;
  console.log(id)
  const { currentUserId } = req.body;

  if (currentUserId === id) {
    res.status(403).json("Action forbidden");
  } else {
    try {
      const followUser = await User.findById(id);
      const followingUser = await User.findById(currentUserId);
      
      if (!followUser.followers.includes(currentUserId)) {
        await followUser.updateOne({
          $push: { followers: currentUserId },
        });
        await followingUser.updateOne({ $push: { following: id } });
        res.status(200).json("user followed");
      } else {
        res.status(403).json("user is already followed by you");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }
};


//  Unfollow a User

const unFollowUser = async (req, res) => {
  const id = req.params.id;
  console.log(id)
  const { currentUserId } = req.body;

  if (currentUserId === id) {
    res.status(403).json("Action forbidden");
  } else {
    try {
      const followUser = await User.findById(id);
      const followingUser = await User.findById(currentUserId);
      
      if (followUser.followers.includes(currentUserId)) {
        await followUser.updateOne({
          $pull: { followers: currentUserId },
        });
        await followingUser.updateOne({ $push: { following: id } });
        res.status(200).json("user unfollowed");
      } else {
        res.status(403).json("user is not followed by you");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }
};

export {
  userRegister,
  userLogin,
  otpValidation,
  getUser,
  updateUser,
  deleteUser,
  followUser,
  unFollowUser
};
