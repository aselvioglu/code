function createFillInTheBlanksQuestion(text, phrases, answers) {
    // Check if the provided arguments are valid
    if (!text || !phrases || !answers || phrases.length !== answers.length) {
      throw new Error("Invalid arguments provided");
    }
  
    // Create the question text with blanks for the phrases
    let questionText = text;
    for (let i = 0; i < phrases.length; i++) {
      questionText = questionText.replace(phrases[i], "____");
    }
  
    // Create the input fields for user answers
    let answerFields = "";
    for (let i = 0; i < phrases.length; i++) {
      answerFields += `<input type="text" id="answer-${i}" placeholder="Enter answer">`;
    }
  
    // Create the submit button
    const submitButton = `<button onclick="checkAnswers()">Check Answers</button>`;
  
    // Combine the question text, input fields, and submit button into a single HTML element
    const questionElement = `
      <div>
        <p>${questionText}</p>
        <div>${answerFields}</div>
        <div>${submitButton}</div>
      </div>
    `;
  
    return questionElement;
  }
  
  function checkAnswers() {
    // Retrieve user answers from input fields
    const userAnswers = [];
    for (let i = 0; i < phrases.length; i++) {
      const answerInput = document.getElementById(`answer-${i}`);
      userAnswers.push(answerInput.value);
    }
  
    // Check each user answer against the corresponding correct answer
    let isCorrect = true;
    for (let i = 0; i < phrases.length; i++) {
      if (userAnswers[i].toLowerCase() !== answers[i].toLowerCase()) {
        isCorrect = false;
        break;
      }
    }
  
    // Display feedback based on the correctness of the answers
    const feedback = isCorrect ? "Correct!" : "Incorrect. Please try again.";
    alert(feedback);
  }
  