const mongoose = require('mongoose');
const habitSchema = new mongoose.Schema({
    user_id:{type:mongoose.Schema.Types.ObjectId, required:true, ref:'User'},
    title : {   type: String , required: true},
    identity:{type:String},
    cue:{type: String},
    completedDates : [{type: String}],
    streak:{type: Number, default:0}

},{timestamps: true})

module.exports = mongoose.model('Habit', habitSchema)