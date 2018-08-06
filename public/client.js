var sendPushover = function(event){
  event.preventDefault();
  var emailInput = document.getElementById("emailInput").value;
  var recipientInput = document.getElementById("recipientInput").value;
  var messageInput = document.getElementById("message").value;
  console.log('Client yep')
  axios.post('/send-pushover/', {email_input : emailInput, recipient_input : recipientInput, message_input : messageInput})
    .then(function (response) {
      if (response.status == 200) {
        var formcontainer = document.getElementById("formcontainer");
        formcontainer.innerHTML =  "<h3> Message sent! </h3>";
      }
      else {
        var formcontainer = document.getElementById("formcontainer");
        formcontainer.innerHTML =  "<h3> Message could not be sent </h3>";
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

var welcomeEventListeners = function(){
  var formchallenge = document.getElementById("formchallenge")
  formchallenge.addEventListener("submit", sendPushover, false);
}
