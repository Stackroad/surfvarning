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

var checkSubscription = function(event){
  event.preventDefault();
  var emailInput = document.getElementById("emailInput").value;
  var recipientInput = document.getElementById("recipientInput").value;

  axios.post('/subscription/', {email_input : emailInput, recipient_input : recipientInput})
    .then(function (response) {
      if (response.data.inserted) {
        var formcontainer = document.getElementById("formcontainer");
        formcontainer.innerHTML =  "<h3> Hurray, " + emailInput + " is now subscribing to the spot: " + recipientInput + "! </h3>";
      }
      else {
        var formcontainer = document.getElementById("formcontainer");
        formcontainer.innerHTML =  "<h3> You are already subscribing to the spot: " + recipientInput + "... </h3>";
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

var manageSubscription = function(event){
  event.preventDefault();
  var emailInput = document.getElementById("emailInput").value;
  var recipientInput = document.getElementById("recipientInput").value;

  console.log(emailInput)
  console.log(recipientInput)

  axios.delete('/subscription/', {params: {email_input: emailInput, recipient_input: recipientInput}})
    .then(function (response) {
      console.log(response.data)
      if (response.data.removed) {
        var formcontainer = document.getElementById("formcontainer");
        formcontainer.innerHTML =  "<h3> We are sad to see you go, you are no longer subscribing to the spot: " + recipientInput + "</h3>";
      }
      else {
        var formcontainer = document.getElementById("formcontainer");
        formcontainer.innerHTML =  "<h3> The email " + emailInput + " doesn't have a subscription to the spot " + recipientInput + " </h3>";
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

var surfvarningEventListeners = function(){
  var subscriptionForm = document.getElementById("subscriptionForm")
  subscriptionForm.addEventListener("submit", checkSubscription, false);
}

var manageSubscriptionEventListeners = function(){
  var manageSubscriptionForm = document.getElementById("manageSubscriptionForm")
  manageSubscriptionForm.addEventListener("submit", manageSubscription, false);
}
