const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");
admin.initializeApp();

exports.addCallerDocument = functions.https.onRequest(async (req, res) => {
    if (req.method !== "POST") {
        return res.status(400).send("Only POST requests are allowed");
    }

    try {
        const callerId = req.body.caller_id;
        if (!callerId) {
            return res.status(400).send("caller_id is required in the request body");
        }

        await admin.firestore().collection("callers").doc(callerId).set({
            isScam: false,
            time: new Date().toLocaleString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).replace(/,/, '')
        });
        
        res.status(200).send("Document added successfully");
    } catch (error) {
        console.error("Error adding document:", error);
        res.status(500).send("Failed to add document");
    }
});

exports.addCallerDocument2 = functions.https.onRequest(async (req, res) => {
    if (req.method !== "POST") {
        return res.status(400).send("Only POST requests are allowed");
    }

    try {
        const callerId = req.body.caller_id;
        if (!callerId) {
            return res.status(400).send("caller_id is required in the request body");
        }

        await admin.firestore().collection("callers").doc(callerId).set({
            isScam: true,
            time: new Date().toLocaleString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).replace(/,/, '')
        });
        
        res.status(200).send("Document added successfully");
    } catch (error) {
        console.error("Error adding document:", error);
        res.status(500).send("Failed to add document");
    }
});

exports.checkEmployeeStatus = functions.https.onRequest(async (req, res) => {
    if (req.method !== "POST") {
        return res.status(400).send("Only POST requests are allowed");
    }

    try {
        const username = req.body.username;
        if (!username) {
            return res.status(400).send("username is required in the request body");
        }

        const response = await axios.post('https://api.perplexity.ai/v1/query', {
            prompt: `Is someone named ${username} an employee at Wells Fargo? If to your best knowledge they are, when did they start working?`,
            api_key: Process.env.PERPLEXITY_API_KEY
        });

        res.status(200).send(response.data);
    } catch (error) {
        console.error("Error querying Perplexity API:", error);
        res.status(500).send("Failed to query Perplexity API");
    }
});