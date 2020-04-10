//--------------------------------------------------------------
// Your web app's Firebase configuration
//--------------------------------------------------------------
let config = {
    apiKey: "AIzaSyCI3tPf61sTY3nLoHJG7P8TGBakZU69o3w",
    authDomain: "comp-1800-94b18.firebaseapp.com",
    databaseURL: "https://comp-1800-94b18.firebaseio.com",
    projectId: "comp-1800-94b18",
    storageBucket: "comp-1800-94b18.appspot.com",
    messagingSenderId: "254451731238",
    appId: "1:254451731238:web:ff1e74fe12719d02740fe7"
};

// Initialize Firebase
firebase.initializeApp(config);

//--------------------Get the HTML DOM elements---------------------------//
let displayName = document.getElementById('displayName');
let userName = document.getElementById('username');
let currentSchool = document.getElementById('currentSchool');
let currentEmail = document.getElementById('currentEmail');
let confirmation = document.getElementById('confirmation');
let welcome = document.getElementById('welcome');

//--------------------Update Users School---------------------------//
function updateSchool() {
    // Checks for changes in the signed in user.
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {

            // Get the user reference.
            let id = user.uid;
            let db = firebase.firestore();
            let ref = db.collection('Users');

            // Get the value of the new school.
            let school = document.getElementById('newSchool').value;

            // Add the user info to the database.
            ref.doc(id).update({
                'School': school
            }).then(function () {

                // Feedback to user that the update was successful.
                confirmation.innerHTML = 'Successfully updated School!';
                // Get the users new username.
                let newSchool = document.getElementById('newSchool').value;
                // Immediately Update the Users profile information.
                currentSchool.innerHTML = "School: " + newSchool;
            }).catch(function (error) {
                console.error('Error writing document: ', error);
            });
        } else {
            // If no user is signed in.
            console.log('no user logged in.');
        }
    })
}

//--------------------Update Users Username---------------------------//
function updateUsername() {
    // Checks for changes in the signed in user.
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {

            // Get the user reference.
            let id = user.uid;
            let db = firebase.firestore();
            let ref = db.collection('Users');

            // Get the value of the new username.
            let username = document.getElementById('newUsername').value;

            // Add the user info to the database.
            ref.doc(id).update({
                'Name': username,
            }).then(function () {

                // Feedback to user that the update was successful.
                confirmation.innerHTML = 'Successfully updated Username!';
                // Get the users new username.
                let newUser = document.getElementById('newUsername').value;
                // Immediately Update the Users profile information.
                displayName.innerHTML = newUser + "'s" + " Account Info";
                userName.innerHTML = "Username: " + newUser;

            }).catch(function (error) {
                console.error('Error writing document: ', error);
            });
        } else {
            // If no user is signed in.
            console.log('no user logged in.');
        }
    })
}

//--------------------Get Users Profile info---------------------------//
function getProfile() {
    // Checks for changes in the signed in user.
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {

            // Get the user reference.
            let id = user.uid;
            let db = firebase.firestore();
            let ref = db.collection('Users');

            // Get user data.
            ref.doc(id).get().then(function (doc) {

                // Assign the users name and school to variables.
                let name = doc.data().Name;
                let school = doc.data().School;
                let email = doc.data().email;

                // Show the user their current profile info.
                displayName.innerHTML = name + "'s" + " Account Info";
                userName.innerHTML = "Username: " + name;
                currentSchool.innerHTML = "School: " + school;
                currentEmail.innerHTML = "Email: " + email;
            });
        } else {
            // If no user is signed in.
            console.log('no user logged in.');
        }
    })
}

// Call the function
getProfile();

//--------------------Display Users name on Home Page---------------------------//
function getName() {
    // Checks for changes in the signed in user.
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {

            // Get the user reference.
            let id = user.uid;
            let db = firebase.firestore();
            let ref = db.collection('Users');

            // Get user data.
            ref.doc(id).get().then(function (doc) {

                // Assign the users name and school to variables.
                let name = doc.data().Name;

                // Show the user their current profile info.
                welcome.innerHTML = "Welcome " + name + "!";
            });
        } else {
            // If no user is signed in.
            console.log('no user logged in.');
        }
    })
}

// Call the function
getName();