const mongoose = require("mongoose");

var mongoURL = 'mongodb+srv://mrmatchesm:deltacharlie1939@cluster0.okyrfnu.mongodb.net/sanctuary-rooms'

mongoose.connect(mongoURL)

var connection = mongoose.connection

connection.on('error' , ()=>{
    console.log('Mongo DB connection failed')
})

connection.on('connected' , ()=>{
    console.log('Mongo DB connection successful')
})


module.exports = mongoose