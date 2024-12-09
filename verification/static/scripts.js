document.addEventListener("DOMContentLoaded", function () {
    const verificationForm = document.getElementById("verification-form");
    const verifyBtn = document.getElementById("verify-btn");
    const confirmBtn = document.getElementById("confirm-btn");
    const resendBtn = document.getElementById("resend-btn");
    const emailInput = document.getElementById("email");
    const codeInput = document.getElementById("code");
    const errorMessage = document.getElementById("error-message");
    const verificationCodeSection = document.getElementById("verification-code-section");


    function startTimer(duration) {
        let timer = duration, minutes, seconds;
        
        const timerDisplay = document.getElementById("timer");  // Get the element to display the timer
        
        const resendBtn = document.getElementById("resend-btn"); // Resend button reference

    // Disable the resend button at the start of the timer
    resendBtn.disabled = true;
    resendBtn.style.opacity = "0.5"; // Optionally, change the appearance
    resendBtn.style.cursor = "not-allowed";


        // Update the timer every second
        const interval = setInterval(function () {
            minutes = Math.floor(timer / 60); // Get minutes
            seconds = timer % 60; // Get seconds
    
            // Display the timer 
            timerDisplay.textContent = `Wait ${minutes}:${seconds < 10 ? '0' : ''}${seconds} seconds before requesting new code.`;
            // Decrease the timer by one second
            if (--timer < 0) {
                clearInterval(interval);  // To stop the timer
                resendBtn.disabled = false;
                resendBtn.style.opacity = "1";
                resendBtn.style.cursor = "pointer";
                timerDisplay.textContent = 'You can request a new code now.'; // Optionally show message when time is up
                // document.getElementById("resend-btn").style.display = 'block'; // Enable resend button
            }
        }, 1000);
    }

    // Handle sending the verification code
    verificationForm.addEventListener("submit", function (event) {
        event.preventDefault();
        startTimer(60);
        const email = emailInput.value.trim();
        const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

        fetch('/verification/send-verification-code/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
            body: JSON.stringify({ email: email })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to send verification code.');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            alert(`${data.message}`)
            if (data.success) {
                verificationCodeSection.style.display = "block";
                // errorMessage.style.display = "none";
                errorMessage.style.display = data;
                verificationForm .style.display="none";

                document.querySelector('#verification-code-section p strong').textContent = data.masked_email;

            } else {
                errorMessage.textContent = data.message || "Failed to send verification code.";
                errorMessage.style.display = "block";
            }
        })
        
        .catch(error => {
                console.error('Error:', error.message);
                alert(`Error: ${error.message}`);
            });
    });

// Handle confirming the verification code
    if (confirmBtn) {
        confirmBtn.addEventListener("click", function () {
            const email = emailInput.value.trim(); 
            const code = codeInput.value.trim();  
            const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    
            // Check if both email and code are provided
            if (!email || !code) {
                errorMessage.textContent = "Please enter both email and verification code";
                errorMessage.style.display = "block";  // to display the error message
                return;  
            }
        fetch('/verification/verify-code/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken  // Add CSRF token to the request
            },
            body: JSON.stringify({ email: email, code: code })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.success) {
                errorMessage.style.display = data;
                console.log('Verification Code Sent:', data.message);
                // Redirect on successful verification
                window.location.href = '/verification/success/';
            } else {
                document.getElementById("error-message").style.display = "block";
                document.getElementById("error-message").innerText = data.message;  // Show error message if code is invalid
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error during verification.');
        });
    });
    }
    
    // Handle resending the code
    if (resendBtn) {
        resendBtn.addEventListener("click", function () {
            startTimer(60);
            const email = emailInput.value;
            const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

            fetch('/verification/resend-code/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken
                },
                body: JSON.stringify({ email: email })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to resend code.');
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                if (data.success) {
                    errorMessage.style.display = data;
                    // errorMessage.style.display = "none";
                    alert(`Verification code resent successfully and ${data.message}`);
                } else {
                    errorMessage.textContent = data.message || "Failed to resend verification code.";
                    errorMessage.style.display = "block";
                }
            })
            .catch(error => {
                console.error('Error:', error);
                errorMessage.textContent = "An error occurred while resending the code.";
                errorMessage.style.display = "block";
            });
        });
    }
});

