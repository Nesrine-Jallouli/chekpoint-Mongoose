const mongoose=require("mongoose");
const schema =mongoose.Schema;
const personSchema= new schema( {
name:{type :String, required: true},
age: {type: Number},
favoriteFoods : {type: [String]},
email:{type :String, required: true, unique:true, lowercase:true},
phone:{type :String, unique:true},
});
module.exports=Person=mongoose.model("person",personSchema);