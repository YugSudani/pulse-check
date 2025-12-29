const mongoose = require("mongoose");

const incidentSchema = new mongoose.Schema({
    
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    monitorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "monitorModel",
        required: true,
    },

    monitorUrl:{
        type: String,
        required: true,
    },

    incidentType:{
        type: String,
        required: true,
    },

    incidentStartTime:{
        type: Date,
        required: true,
    },
    
    incidentEndTime:{
        type: Date,
    },

    incidentDuration:{
        type: Number,
    },

});

const incidentModel = mongoose.model("incidentModel", incidentSchema);

module.exports = incidentModel;
