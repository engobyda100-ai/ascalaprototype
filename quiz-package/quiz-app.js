(function () {
  const QUESTIONS = window.QUIZ_QUESTIONS || [];

  const grid = document.getElementById("questionGrid");
  const qTag = document.getElementById("qTag");
  const qNumber = document.getElementById("qNumber");
  const qText = document.getElementById("qText");
  const answers = document.getElementById("answers");
  const result = document.getElementById("result");
  const startBtn = document.getElementById("startBtn");
  const resetBtn = document.getElementById("resetBtn");
  const nextBtn = document.getElementById("nextBtn");

  let current = 0;

  function setActiveButton(index) {
    [...grid.children].forEach((node, i) => node.classList.toggle("active", i === index));
  }

  function evaluate(button) {
    [...answers.children].forEach(node => node.classList.remove("selected"));
    button.classList.add("selected");
    result.style.visibility = "visible";
  }

  function renderQuestion(index) {
    current = index;
    const q = QUESTIONS[index];
    setActiveButton(index);
    qTag.textContent = q.site;
    qNumber.textContent = "Question " + q.id;
    qText.textContent = q.text;
    result.textContent = "Answer selected and locked. (No reveal shown)";
    result.style.visibility = "hidden";
    resetBtn.style.display = "";
    nextBtn.style.display = "";
    answers.innerHTML = "";

    q.choices.forEach((choice, choiceIndex) => {
      const answerBtn = document.createElement("button");
      answerBtn.className = "answer";
      answerBtn.innerHTML = '<span class="key">' + String.fromCharCode(65 + choiceIndex) + '</span><span>' + choice + "</span>";
      answerBtn.addEventListener("click", () => evaluate(answerBtn));
      answers.appendChild(answerBtn);
    });
  }

  function showStartScreen() {
    setActiveButton(-1);
    qTag.textContent = "Ready";
    qNumber.textContent = "";
    qText.textContent = "Start now";
    answers.innerHTML = "";
    result.textContent = "";
    result.style.visibility = "hidden";
    resetBtn.style.display = "none";
    nextBtn.style.display = "none";
  }

  QUESTIONS.forEach((q, i) => {
    const btn = document.createElement("button");
    btn.className = "q-btn";
    btn.textContent = q.id;
    btn.addEventListener("click", () => renderQuestion(i));
    grid.appendChild(btn);
  });

  resetBtn.addEventListener("click", () => renderQuestion(current));
  nextBtn.addEventListener("click", () => renderQuestion((current + 1) % QUESTIONS.length));
  startBtn.addEventListener("click", showStartScreen);

  showStartScreen();
})();
