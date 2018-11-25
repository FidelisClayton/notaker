import firebase from 'firebase'

const config = {
  apiKey: "AIzaSyBCjzdwhaL8RliUiCjAbcLjy6wy0GKBPKc",
  authDomain: "notaker-1b171.firebaseapp.com",
  databaseURL: "https://notaker-1b171.firebaseio.com",
  storageBucket: "notaker-1b171.appspot.com",
}

firebase.initializeApp(config)

export const db = firebase.database()

export default firebase
