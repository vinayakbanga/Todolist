//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date=require(__dirname+"/date.js");//added our own created module
const mongoose=require("mongoose");
const _=require("lodash");


const app = express();



// var items=["Buy food","cook food","eat food"];
// let workItems=[];



app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));// this line is used when we want to add css to our web page



//creating mongoose database
//conecting
mongoose.connect('mongodb+srv://admin-vinayak:vinayakbanga@cluster0.ndne3.mongodb.net/todolistDB?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});
//mongodb://localhost:27017/todolistDB we can add tid statement for testing
//creating new schema
const itemsSchema={
  name:String
};
//creating modal
const Item=mongoose.model("Item",itemsSchema);
//adding some items
const item1=new Item({
  name:"Welcome to Your todolist"
});

const item2=new Item({
  name:"The + Button is there to add new stuff"
});

const item3=new Item({
  name:"<-- Hit this to dlete an item"
});

const defaultItems=[item1,item2,item3];

const listSchema={
  name:String,
  items:[itemsSchema]
};

const List=mongoose.model("List",listSchema);








//home route-------------------------------------------
//We first load our home page through the code below

app.get("/", function(req, res){

  //                        foundItems is the list of all the items in our todo list
  Item.find({},function(err,foundItems){//this stament is used to diplay the items in the modal (item)
    if(foundItems.length === 0)
    {
      
      Item.insertMany(defaultItems,function(err){
        if(err){
          console.log("error");
        }else{
          console.log("Items are added successfully");
        }
      });
      res.redirect("/");// this statement redireccts to the app.get of the home route
      
    }else{
      
      //then we render our list.ejs template and add the day and items in it
      res.render("list", {listTitle: "today",newListItems :foundItems,Date: day});  //for this line to work we should have views folder and it should have the list.ejs file
      
    }
    
    
    
  });
  
  //--------------------------------------------------------------------------------------------------------------------------------------------------------------------
        
    //in place of the below commented code we will create our own module
    //   var today=new Date();//used to get the current date
    //  var options ={
    //    weekday:"long",
    //    day: "numeric",
    //    month :"long"
    //  };
   let day= date.getDate();//istead of the above commented code we have created a seprate file with it and added here
  //if we use .getday mathod creadted in our date.js module then we will get only day
  //if we will use .getdate method then we will get both day and date
     // var day=today.toLocaleDateString("en-US",options);//this extract the dte inthe format mentioned in the object option
  //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  
});



app.post("/",function(req,res){//through post we will recive the data from the user
  const itemName=(req.body.newItem);//the new item types in the input field is get saved here
  const listName=(req.body.list);// name of the list


const item=new Item({
  name:itemName
});
if(listName === "today"){
  
  item.save();
  res.redirect("/");

}else{
  List.findOne({name:listName},function(err,foundList){
    foundList.items.push(item);
    foundList.save();
    res.redirect("/"+ listName);
  });
}



  




  // if(req.body.list === "Work"){// if it is so then it will go to work route
  //   workItems.push(item);
  //   res.redirect("/work");
  // }else{

  //   items.push(item);//then it will be added in the array and will pe displayed by .get block
  //   res.redirect("/");//it will redirect to .get
  // }



});

app.post("/delete",function(req,res){
  const checkedItemId=(req.body.checkbox);
  const listName=req.body.listName;
  console.log(req.body.listName);
  if(listName === "today"){

    Item.findByIdAndRemove(checkedItemId,function(err){
      if(err){
        console.log(err);
      }else{
        console.log("The Item is removed");
        res.redirect("/");
      }
    });

  }else{
    List.findOneAndUpdate({name: listName},{$pull:{items:{_id: checkedItemId}}},function (err,foundList) {
      if(!err){
        res.redirect("/"+listName);
      }
      
    });
  }
  //to remove anything from webpage
});


app.get("/:customListName",function(req,res){
  const customListName=_.capitalize(req.params.customListName); 
  let day= date.getDate();
List.findOne({name: customListName},function (err,foundList) {
     if(!err){
       if(!foundList){
         //create a new list
         const list=new List({
          name:customListName,
          items: defaultItems
        });
        list.save();
        res.redirect("/"+customListName);
       

       }else{
         //create a existing list
         res.render("list",{listTitle:foundList.name,newListItems:foundList.items,Date:day});
       }
     }
});



 


});

















//work route

// app.get("/work",function(req,res){
//   res.render("list",{listTitle:"Work List",newListItems:workItems});//.render is used to display the components in the ejs template
// });
// app.post("/work",function(req,res){
//   let item=req.body.newItem;//new item is the name of the text field
//   workItems.push(item);
//   res.redirect("/work");
// });

// app.get("/about",function(req,res){
//      res.render("about");
// });

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}


app.listen(port, function(){
  console.log("Server started on port 3000.");
});
