
//we have created our own date module 
//console.log(module);
module.exports.getDate=getDate;//this is used to export the data from this module to the main(app.js) module
function getDate(){
var today=new Date();//used to get the current date


   var options ={
     weekday:"long",
     day: "numeric",
     month :"long"
   };


   var day=today.toLocaleDateString("en-US",options);//this extract the dte inthe format mentioned in the object option
   return day;
}
module.exports.getDay=getDay;
function getDay(){
  var today=new Date();//used to get the current date
  
  
     var options ={
       weekday:"long",
       
     };
  
  
     var day=today.toLocaleDateString("en-US",options);//this extract the dte inthe format mentioned in the object option
     return day;
  }
console.log(module.exports);