import mongoose from 'mongoose'
const schema = mongoose.Schema;


const ReactSchema = schema(
    {
        reaction:{
            type :String,
            enum: ["Like","Love","haha","wow","angry"],
            required:true
        },
        postRef:{
            type: schema.Types.ObjectId,
            ref :"Post", 

        },
        reactedBy: {
            type: schema.Types.ObjectId,
            ref:"User"
        }
    }
)

export default mongoose.model("React", ReactSchema);