const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const { request } = require("express");
const date = require(__dirname + "/date.js");
const app = express();
const port = 3000;



app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/listDB',{useNewUrlParser:true});

const ListSchema = mongoose.Schema({

    name:String,
})

const ListItem = mongoose.model('list',ListSchema);

// const item1 = new ListItem({
//     name:"Pen",
// })
// const item2 = new ListItem({
//     name:"Pencil"
// })

// const item3 = new ListItem({
//     name:"Eggs"
// })

const items = [];

// ListItem.insertMany(items,(err) => {
//     if(err){
//         console.log(err);
//     }
//     else{
//         console.log("Successfully added the items");
//     }
// })


app.get("/", function(req,res){

    ListItem.find({},(err,results) => {

        if(results.length === 0 && items.length > 0){
                ListItem.insertMany(items,(err) => {
                    if(err){
                        console.log(err);
                    }
                    else{
                        console.log("Successfully added the items");
                    }
                });
            res.redirect('/');
        }else{
            const day = date.getDate();
            res.render('index', {listTitle: day,newItems: results}); 

        }   // }   // }
    })


});


app.post("/",function(req,res){

    const itemName = req.body.newItem;
    const deleteItem = req.body.deleteItem;
    console.log(deleteItem);

    const newItem = new ListItem({
        name: itemName,
    })
   
    newItem.save();
    res.redirect('/');   

        
});

app.post("/delete", (req,res) => {

    const itemId = req.body.deletedItem;
    ListItem.findByIdAndDelete(itemId,(err) => {
        if(err){
            console.log(err);
        }
        else{
            res.redirect('/');
        }
    })

})

app.get('/work',function(req,res){
    
        res.render('index',{listTitle:"Work List", newItems: workItems});
   
})

app.get('/about',function(req,res){

    res.render('about');
})


app.listen(port, function(){

    console.log("Server started at port:" + port);
})