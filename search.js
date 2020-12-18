const mongoose = require('mongoose');
const { parentPort, workerData } =  require("worker_threads");

mongoose.connect('mongodb://127.0.0.1:27017/', {useNewUrlParser: true, useUnifiedTopology: true});

const Combined_schema = new mongoose.Schema({
    agent_id: mongoose.ObjectId,
    user_id: mongoose.ObjectId,
    userAccount_id: mongoose.ObjectId,
    lob_id: mongoose.ObjectId,
    carrier_id: mongoose.ObjectId,
    policy_id: mongoose.ObjectId
});

const Agent_schema = new mongoose.Schema({ agentName: String });

const User_schema = new mongoose.Schema({
    firstName: String,
    dob: String,
    address: String,
    phoneNumber: String,
    state: String,
    zipCode: String,
    email: String,
    gender: String,
    userType: String
});

const UserAccount_schema = new mongoose.Schema({ accountName: String });

const LOB_schema = new mongoose.Schema({ categoryName: String });

const Carrier_schema = new mongoose.Schema({ companyName: String })

const Policy_schema = new mongoose.Schema({
    policyNumber: String,
    policyStartDate: String,
    policyEndDate: String,
    policyCategory: String,
    collectionId: String,
    companyCollectionId: String,
    userId: String
});

const Agent = mongoose.model('Agent', Agent_schema);
const User = mongoose.model('User', User_schema);
const UserAccount = mongoose.model('UserAccount', UserAccount_schema);
const LOB = mongoose.model('LOB', LOB_schema);
const Carrier = mongoose.model('Carrier', Carrier_schema);
const Policy = mongoose.model('Policy', Policy_schema);
const Combined = mongoose.model('Combined', Combined_schema);

async function getPolicyInfo() {

    const { userName } = workerData;

    User.findOne({ firstName: userName }).then((result) => {
        if(result) {
            Combined.findOne({ user_id: result.id }).then((result) => {
                if(result) {
                    Policy.findOne({ _id: result.policy_id}).then((result) => {
                        if(result) {
                            console.log("found the policy info : ", result.toJSON());
                            parentPort.postMessage({ result: {
                                policyNumber: result.policyNumber,
                                policyCategory: result.policyCategory,
                                policyStartDate: result.policyStartDate,
                                policyEndDate: result.policyEndDate
                            } });
                        }
                        else {
                            console.log("NO MATCH FOUND");
                        }
                    })
                }
                else {
                    console.log("NO MATCH FOUND");
                }
            })
        }
        else {
            console.log("NO MATCH FOUND");
        }
    });

    
}

getPolicyInfo();