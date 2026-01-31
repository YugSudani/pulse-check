const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    notificationSetting:{
        push:{
            type:Boolean,
            default:true
        },
        email:{
            type:Boolean,
            default:true

        },
        call:{
            type:Boolean,
            default:true
        }
    }
})

const adminModel = mongoose.model("adminModel", adminSchema);

module.exports = adminModel;