const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Userschema = new Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    createdDate: { type: Date, default: new Date()}
})

module.exports = mongoose.model('Users', Userschema);