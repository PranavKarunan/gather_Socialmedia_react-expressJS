import mongoose from 'mongoose'
const schema = mongoose.Schema;

const PostSchema = schema (
    {
        user_id :{
            type:schema.ObjectId,
            required:true,
            ref:'User'
            
        },
        description:{
            type:String,
            
        },
        image:{
            type:String
        },
        comments:[
            {
                comment: {
                    type: String
                },
                image:{
                    type:String
                },
                commentedBy: {
                    type:schema.ObjectId,
                    ref:"User"
                },
                commentAt: {
                    type: Date,
                    default: new Date()
                }
            }
        ]
    },
    {
        timestamps:true
    }
)
export default mongoose.model("Post", PostSchema);