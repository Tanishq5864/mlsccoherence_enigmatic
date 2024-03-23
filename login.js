const wrapper = document.querySelector(".wrapper"),
          signupHeader = document.querySelector(".signup header"),
          loginHeader = document.querySelector(".login header");

        loginHeader.addEventListener("click", () => {
          wrapper.classList.add("active");
        });
        signupHeader.addEventListener("click", () => {
          wrapper.classList.remove("active");
        });



document.getElementById("redirectButton1").onclick = function() {

    window.location.href = "/social-media-dashboard/index.html";
}

document.getElementById("signupForm").addEventListener("submit", function(event) {
    var usernameInput = document.getElementById("username");
    var passwordInput = document.getElementById("password");
    var emailInput = document.getElementById("email");
  
    if (usernameInput.value.trim() === "" || passwordInput.value.trim() === "" || emailInput.trim() === "") {
      alert("Username and password cannot be empty!");
      event.preventDefault(); // Prevent form submission
    } else {
      // Continue with sign up process
      document.getElementById("redirectButton").onclick = function() {

        window.location.href = "/Pickup/pickup.html";
    }
    }
  });