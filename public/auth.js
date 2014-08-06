(function(){
  var myRef = new Firebase("https://publicartfound.firebaseio.com");
  var auth = new FirebaseSimpleLogin(myRef, function(error, user) {
    if (error) {
      // an error occurred while attempting login
      console.log(error);
    } else if (user) {
      // user authenticated with Firebase
      console.log("User ID: " + user.uid + ", Provider: " + user.provider);
    } else {
      // user is logged out
    }
  });
});

var authRef = new Firebase("https://<your-firebase>.firebaseio.com/.info/authenticated");
authRef.on("value", function(snap) {
  if (snap.val() === true) {
    alert("authenticated");
  } else {
    alert("not authenticated");
  }
});
