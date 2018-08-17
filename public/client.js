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
  axios.post('/checkAlreadySubscribing', {email_input : emailInput, recipient_input : recipientInput})
  .then(function (response) {
    if (response.data.newSubscriber) {
      axios.post('/sendActivationEmail/', {email_input : emailInput, recipient_input : recipientInput})
        .then(function (response) {
          if (response.data.emailStatus) {
            var formcontainer = document.getElementById("formcontainer");
            formcontainer.innerHTML =  "<h4> An email has been sent to " + emailInput + ", activate the subscription to " + recipientInput + " by clicking on the link in the email </h4>";
          }
          else {
            var formcontainer = document.getElementById("formcontainer");
            formcontainer.innerHTML =  "<h4> We didn't manage to send an email to " + recipientInput + ", please try again. </h4>";
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
    else {
      var formcontainer = document.getElementById("formcontainer");
      formcontainer.innerHTML =  "<h4> You are already subscribing to the spot: " + recipientInput + "... </h4>";
    }
  })
  .catch(function (error) {
    console.log(error);
  });
}

var activateSubscription = function(element){
  var emailInput = element.split(" ")[0]
  var recipientInput = element.split(" ")[1]

  axios.post('/subscriptionInsert/', {email_input : emailInput, recipient_input : recipientInput})
    .then(function (response) {
      if (response.data.emailStatus) {
        var activateContainer = document.getElementById("activateContainer");
        activateContainer.innerHTML =  "<h4> An email has been sent to " + emailInput + ", activate the subscription to " + recipientInput + " by clicking on the link in the email </h4>";
      }
      else {
        var activateContainer = document.getElementById("activateContainer");
        activateContainer.innerHTML =  "<h4> We didn't manage to send an email to " + recipientInput + "... </h4>";
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

var addSubscription = function(element){
  var emailInput = element.split(" ")[0]
  var recipientInput = element.split(" ")[1]

  axios.post('/subscriptionInsert/', {email_input : emailInput, recipient_input : recipientInput})
    .then(function (response) {
      console.log(response)
      if (response.data.inserted) {
        var activateContainer = document.getElementById("activateContainer");
        activateContainer.innerHTML =  "<h3> Hurray, " + emailInput + " is now subscribing to the spot: " + recipientInput + "! </h3> \
        <h4> Want to subscribe to more spots? <h4> <a class=" + "button" + " href=" + "http://perwelander.com/surfvarning" + ">Yes!</a>"
      }
      else {
        var activateContainer = document.getElementById("activateContainer");
        activateContainer.innerHTML =  "<h3> You are already subscribing to the spot: " + recipientInput + "... </h3>";
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

var unsubscribe = function(element){
  var emailInput = element.split(" ")[0]
  var recipientInput = element.split(" ")[1]

  axios.delete('/subscription/', {params: {email_input: emailInput, recipient_input: recipientInput}})
    .then(function (response) {
      console.log(response.data)
      if (response.data.removed) {
        var unsubscribeContainer = document.getElementById("unsubscribeContainer");
        unsubscribeContainer.innerHTML =  "<h4> We are sad to see you go, you are no longer subscribing to the spot: " + recipientInput + "</h4>";
      }
      else {
        var unsubscribeContainer = document.getElementById("unsubscribeContainer");
        unsubscribeContainer.innerHTML =  "<h4> The email " + emailInput + " doesn't have a subscription to the spot " + recipientInput + " </h4>";
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

var surfvarningAddSubscriptionEventListeners = function(){
  var subscriptionForm = document.getElementById("subscriptionForm")
  subscriptionForm.addEventListener("submit", checkSubscription, false);
}
