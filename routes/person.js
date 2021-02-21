const express=require("express");
const router=express.Router();
const Person=require('../models/person');

//@Api http:localhost:7500/api/persons
//@desc Add new Person
//@access public

router.post("/", (req,res)=>{
    const newPerson = new Person({...req.body});
    newPerson
      .save()
      .then((person)=> res.send(person))
      .catch((err)=> res.send(err));
});

//@Api http:localhost:7500/api/persons
//@desc Get all Persons
//@access public

router.get("/", (req,res)=>{
  Person.find()
        .then((persons) => res.send(persons))
        .catch((err)=> res.send(err));
      });

//@Api http:localhost:7500/api/persons/:_id
//@desc Delete a Person by ID
//@access public

router.delete("/:_id", (req,res)=>{
  let {_id} = req.params;
  Person.findByIdAndDelete({_id})
        .then(() => res.send("this person has been deleted successfully"))
        .catch((err)=> res.send(err));
});

//@Api http:localhost:7500/api/persons/:_id
//@desc Update a Person by ID
//@access public
router.put("/:_id", (req,res)=>{
  let {_id} = req.params;
  Person.findByIdAndUpdate({_id},{$set: {...req.body}})
        .then(() => res.send("this person has been updated successfully"))
        .catch((err)=> res.send(err));
});
//----------------------
// create a document instance/record of person 
// And passing a person named Nesrine
let Person1 = new Person ({
  name:"Nesrine",
  age: 30,
  favoriteFoods :  ["Spagetti", "Hamboger"],
  "email" : "nesrine@gmail.com",
  "phone" : "+239408930",
  });
   // saving it 
   Person1.save((err, data)=>{
    err?console.log('error :',err) : console.log(data)
   });


   //ArrayOfPeople   
const ArrayOfPeople = [
   {
     name:"Mariem",
     age: 12,
     favoriteFoods :  ["Pizza"],
     email: "mariem@edu.ca",
     phone: "+123569",
   },
   { 
     name:"Malek",
     age: 20,
     favoriteFoods :  ["Escalope", "legume"],
     email: "tarek20@ca.tn",
     phone: "+21600770000",
           },
   {
     name:"Samir",
     age: 52,
     favoriteFoods :  ["Fish", "eggs"],
     email: "samir@myegy.eg",
     phone: "+2010000000",
             },
   {
     name:"Samira",
     age: 18,
     favoriteFoods :  [ "Couscous", "Ojja Merguez"],
     email: "samira@notfound.tn",
     phone: "+2160000000",
                 },
   
 ];

//Create many records with Model.create(),
Promise
   .all( ArrayOfPeople.map( el => {
       return Person.create( el ) 
                   .catch( error => ( { error } ) )
        }) )
   .then( ArrayOfPeople => {

         ArrayOfPeople.forEach( el => {
                 if ( el.error ) {
           console.log( "Item has failed with error :", el.error );
                 } else {
           console.log( "Item created successfully" );
                 }
       } );

} );

//Find all the people having a given name ("Mariem" for e.g) using Model.find() -> [Person]

Person
  .find({"name": "Mariem"})
  .then(doc => {
   console.log("Find all the people named Mariem")
   console.log(doc)
 })
  .catch(err => {
   console.error(err)
 })

//Find just one person which has a certain food in the person's favorites, 
//using Model.findOne() -> Person. 
//for exemple one person which has Pizza in his favoriteFoods
Person
.findOne({favoriteFoods: /Pizza/})
.then(doc => {
 console.log("Find a person having Pizza in his favoriteFoods")
 console.log(doc)
})
.catch(err => {
 console.error("ERROR", err)
})

  

// using Model.findById() -> Person
Person.findById({"_id": "60323f74cddeef1af8f6daf7"} ,
     
(err,doc)=> {err ? console.log ("Unfound",err) : console.log ("found successfully",doc)}

);


//Find a person by _id . Add "hamburger" to the list of the person's favoriteFoods 
//(use Array.push()). Then - inside the find callback - save() the updated Person.
Person
  .findByIdAndUpdate({
    "_id": "60323f74cddeef1af8f6daf7"
     },
      { 
       $push:{ favoriteFoods: "hamburger"},
     }, 
     {new:true,
     runValidators: true,
     useFindAndModify: false ,
     safe: true, upsert: false
   } ,
     
      (err)=> {  err? console.log("update failed with error:",err)     :     save() }    
     );
     
//Perform New Updates on a Document Using model.findOneAndUpdate()
//Find a person by Name and set the person's age to 20.
//to return the updated document, use { new: true } as the 3rd argument to findOneAndUpdate()      
Person
.findOneAndUpdate(
 {name:"Sahin"},
 {"age": 20},
{new:true,
 runValidators: true,
 useFindAndModify: false ,
 overwrite:true,
 safe: true, upsert: false
} ,
 
  (err,doc)=> {
    
   if (err ) {console.log ("failed to update",err)};
   { console.log ("updated successfully!",doc);
     }    }
 );

//Delete One Document Using model.findByIdAndRemove

Person
  .findByIdAndRemove({
    "_id": "60323b1dcddeef1af8f6daf4"
     },
 
     (err)=> {
       
      if (err ) {console.log ("failed to remove",err)};
      { console.log ("removed successfully!"); save()
         }    
     })
// MongoDB and Mongoose - Delete Many Documents with model.remove()

 Person.remove({name:"Malek"}, function (err, personFound) {
   if (err) return console.log(err);
   {console.log("All persons named Mary had been removed")
   done(null, personFound)};
 });

//Chain Search Query: Find people who like burrito. 
//Sort them by name, limit the results to two documents, and hide their age

 var foodToSearch = "Couscous";
 Person
     .find({favoriteFoods:foodToSearch})
     .sort({name : "asc"})
     .limit(2).select("-age")
     .exec((err, data) => {
         err ?  console.log(err):  console.log("Chain Search Query successfull", data);
 });

module.exports = router;