import mongoose from "mongoose";
const schema = mongoose.Schema;

const UserSchema = schema(
  {
    firstName: { type : String ,required:[true,"First Name is required"]  },
    lastName: { type : String ,required:[true,"Last Name is required"]  },
    userName: { type : String ,required:[true,"user name is required" ], unique:true },
    mobileNumber:{ type: Number ,required:true , unique:true },
    email: { type: String, trim: true, lowercase: true ,unique:true},
    password: {type:String, required:[true,"Password is required"] },
    friends:{
      type:Array,
      default:[]
    },
    following:{
      type:Array,
      default:[]
    },
    followers:{
      type:Array,
      default:[]
    },
    requests:{
      type:Array,
      default:[]
    },
    profile:{
      bio: String,
      byear:{
        type:Number,
        trim:true
      },
      bmonth:{
        type:Number,
        trim:true
      },
      bdate:{
        type:Number,
        trim:true
      },
      gender:{type:String ,trim:true},
      job: String,
      qualification:{type:String,default:''},
      address: 
        {
          homeAddress: String,
          landMark: String,
          pincode: Number,
          area: String,
        },
      
     
    },
      isBlocked: {
        type:Boolean, default:false
      },
      isAdmin:{
        type:Boolean, default:false
      },
    
    search:[
     {
      user:{
        type:schema.ObjectId,
        ref:'User'
      }
     }
    ],
    saveAt: {
      type: Date,
      default:new Date()
    }
  },
  
  {
    timestamps: true,
  }
);

export default mongoose.model("User", UserSchema);
