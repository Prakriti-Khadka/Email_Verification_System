document.addEventListener("DOMContentLoaded", function () {
    const steps = Array.from(document.querySelectorAll(".form-step"));
    const nextBtns = document.querySelectorAll(".next-btn");
    const prevBtns = document.querySelectorAll(".prev-btn");
    const progressSteps = document.querySelectorAll(".progress-step");
    const textProgressBar = document.querySelectorAll(".step");
    let currentStep = 0;
  
    /**
     * Updates the visibility of the steps and the progress tracker.
     */
    function updateSteps() {
      steps.forEach((step, index) => {
        step.classList.toggle("active", index === currentStep);
      });
  
      progressSteps.forEach((progressStep, index) => {
        if (index < currentStep) {
          progressStep.classList.add("completed");
          progressStep.classList.remove("active");
        } else if (index === currentStep) {
          progressStep.classList.add("active");
          progressStep.classList.remove("completed");
        } else {
          progressStep.classList.remove("active", "completed");
        }
      });
  
      textProgressBar.forEach((textStep, index) => {
        textStep.classList.toggle("active", index === currentStep);
      });
    }
  
    
    //  Handles the navigation to the next step.
     
    function handleNext() {
      const inputs = Array.from(
        steps[currentStep].querySelectorAll("input, textarea, select")
      );
      const allValid = inputs.every((input) => input.reportValidity());
      if (allValid && currentStep < steps.length - 1) {
        currentStep++;
        updateSteps();
      }
    }
  
    
    // Handles the navigation to the previous step.
     
    function handlePrev() {
      if (currentStep > 0) {
        currentStep--;
        updateSteps();
      }
    }
  
    // Shows a congratulatory effect with confetti and balloons.
   
    function showCongratulations() {
      const body = document.body;
  
      // Create a full-screen container for the celebration

      const celebrationContainer = document.createElement("div");
      celebrationContainer.style.position = "fixed";
      celebrationContainer.style.top = "0";
      celebrationContainer.style.left = "0";
      celebrationContainer.style.width = "100%";
      celebrationContainer.style.height = "100%";
      celebrationContainer.style.zIndex = "9999";
      celebrationContainer.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
      celebrationContainer.style.display = "flex";
      celebrationContainer.style.alignItems = "center";
      celebrationContainer.style.justifyContent = "center";
      celebrationContainer.style.flexDirection = "column";
      celebrationContainer.style.color = "#fff";
  
      // Add congratulation text
      const text = document.createElement("h1");
      text.innerText = "Congratulations! Form is successfully submitted.🎉";
      text.style.fontSize = "3rem";
      text.style.marginBottom = "20px";
      celebrationContainer.appendChild(text);
  
      // Add confetti effect

      const confetti = document.createElement("div");
      confetti.style.position = "absolute";
      confetti.style.width = "100%";
      confetti.style.height = "100%";
      confetti.style.pointerEvents = "none";
      confetti.style.backgroundSize = "cover";
      confetti.style.opacity = "0.8";
      celebrationContainer.appendChild(confetti);
  
      // Append the container to the body
      body.appendChild(celebrationContainer);
  
      // Automatically close the browser tab after 5 seconds
      setTimeout(() => {
        body.removeChild(celebrationContainer);
        window.location.href = "/verification/email-verification/"; 
      }, 2000);
    }
  
    // Add click event listeners for Next buttons
    nextBtns.forEach((btn) => {
      btn.addEventListener("click", handleNext);
    });
  
    // Add click event listeners for Previous buttons
    prevBtns.forEach((btn) => {
      btn.addEventListener("click", handlePrev);
    });
  
    // Handle form submission
    document
      .getElementById("multistep-form")
      .addEventListener("submit", function (e) {
        e.preventDefault();
        if (currentStep === steps.length - 1) {
          showCongratulations();
        }
      });
  
    // Initialize progress tracker
    updateSteps();
  });