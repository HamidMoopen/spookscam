const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.addCallerDocument = functions.https.onRequest(async (req, res) => {
    // Check that this request is authorized with Firebase auth token (optional)
    if (req.method !== "POST") {
        return res.status(400).send("Only POST requests are allowed");
    }

    try {
        // Get the caller ID from the request body
        const callerId = req.body.caller_id;
        if (!callerId) {
            return res.status(400).send("caller_id is required in the request body");
        }

        // Create a document with the caller ID and isScam field in the 'callers' collection
        await admin.firestore().collection("callers").doc(callerId).set({
            isScam: false,  // Add the isScam field set to false
            time: new Date().toLocaleString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).replace(/,/, '')
        });
        
        res.status(200).send("Document added successfully");
    } catch (error) {
        console.error("Error adding document:", error);
        res.status(500).send("Failed to add document");
    }
});



exports.addCallerDocument2 = functions.https.onRequest(async (req, res) => {
    // Check that this request is authorized with Firebase auth token (optional)
    if (req.method !== "POST") {
        return res.status(400).send("Only POST requests are allowed");
    }

    try {
        // Get the caller ID from the request body
        const callerId = req.body.caller_id;
        if (!callerId) {
            return res.status(400).send("caller_id is required in the request body");
        }

        // Create a document with the caller ID and isScam field in the 'callers' collection
        await admin.firestore().collection("callers").doc(callerId).set({
            isScam: true,  // Change the isScam field to true
            time: new Date().toLocaleString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).replace(/,/, '')
        });
        
        res.status(200).send("Document added successfully");
    } catch (error) {
        console.error("Error adding document:", error);
        res.status(500).send("Failed to add document");
    }
});
