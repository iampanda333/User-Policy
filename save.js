// const {Agent, User, UserAccount, Carrier, Combined, Policy, LOB } = require('./dbc');
const { parentPort, workerData } =  require("worker_threads");

const mongoose = require('mongoose');

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

async function save() {

    const { text } = workerData;

    let n = text.length;
    // console.log(n);

    let i = 1;

    for(i = 1; i < n-1; i++) {

        let str = text[i];
        let arr = str.split(',');
        
        const agent = new Agent({ agentName: arr[0] });
        
        const user = new User({
            firstName: arr[16],
            dob: arr[23],
            address: arr[20],
            phoneNumber: arr[19],
            state: arr[21],
            zipCode: arr[22],
            email: arr[14],
            gender: arr[15],
            userType: arr[1]
        });

        const userAccount = new UserAccount({ accountName: arr[13] });

        const lob = new LOB({ categoryName: arr[9]});

        const carrier = new Carrier({ companyName: arr[8] });

        const policy = new Policy({
            policyNumber: arr[4],
            policyStartDate: arr[10],
            policyEndDate: arr[11],
            policyCategory: arr[2], // taken policy_mode from csv file
            collectionId: "",  // not found
            companyCollectionId: "", // not found
            userId: "" // not found
        });

        const combined = new Combined({
            agent_id: agent.id,
            user_id: user.id,
            userAccount_id: userAccount.id,
            lob_id: lob.id,
            carrier_id: carrier.id,
            policy_id: policy.id
        });

        agent.save((err, result) => {
            if(err) {
                console.log("error saving agent : ",err);
            }
        });

        user.save((err, result) => {
            if(err) {
                console.log("error saving user : ",err);
            }
        });

        userAccount.save((err, result) => {
            if (err) {
                console.log("error saving userAccount : ",err);
            }
        });

        lob.save((err, result) => {
            if (err) {
                console.log("error saving lob : ",err);
            }
        });

        carrier.save((err, result) => {
            if (err) {
                console.log("error saving carrier : ",err);
            }
        });

        policy.save((err, result) => {
            if (err) {
                console.log("error saving policy : ",err);
            }
        });

        combined.save((err, result) => {
            if (err) {
                console.log("error saving policy : ",err);
            }
            // if(result)
            // console.log(result);
        });
    }
    parentPort.postMessage({ saved: true });
}

save();