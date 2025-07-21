const subjectGroups = {
  science: ['Biology', 'Physics', 'Chemistry',],
  arts: ['Geography', 'E-Maths', 'E-ICT',]
};

const gradeToScore = {
  A1: 1, B2: 2, B3: 3, C4: 4, C5: 5, C6: 6,
  D7: 7, E8: 8, F9: 9
};

const courseSelect = document.getElementById('course-group');
const subjectsContainer = document.getElementById('subjects-container');
const resultDiv = document.getElementById('result');
const checkBtn = document.getElementById('check-btn');
const dialog = document.getElementById('dialog-box');

function showDialog(message) {
  dialog.textContent = message;
  dialog.style.display = 'block';
  setTimeout(() => {
    dialog.style.display = 'none';
  }, 3500);
}

courseSelect.addEventListener('change', () => {
  const selectedGroup = courseSelect.value;
  subjectsContainer.innerHTML = '';
  resultDiv.style.display = 'none';
  dialog.style.display = 'none';

  if (subjectGroups[selectedGroup]) {
    subjectGroups[selectedGroup].forEach(subject => {
      const label = document.createElement('label');
      label.textContent = subject;

      const input = document.createElement('input');
      input.type = 'text';
      input.name = subject.toLowerCase();
      input.placeholder = 'Enter grade (e.g., A1)';
      input.required = true;

      subjectsContainer.appendChild(label);
      subjectsContainer.appendChild(input);
    });
  }
});

checkBtn.addEventListener('click', () => {
  const selectedGroup = courseSelect.value;
  const inputs = subjectsContainer.querySelectorAll('input');
  const scores = {};
  resultDiv.style.display = 'block';

  if (!selectedGroup) {
    showDialog("Please select a course group.");
    return;
  }

  for (let input of inputs) {
    const subject = input.name.toLowerCase();
    const grade = input.value.trim().toUpperCase();

    if (!grade) {
      showDialog("Please fill in all grades.");
      return;
    }

    if (!gradeToScore.hasOwnProperty(grade)) {
      showDialog(`Invalid grade: "${grade}". Use A1 to F9.`);
      return;
    }

    scores[subject] = gradeToScore[grade];
  }

  let resultText = "Not eligible for any program.";

  if (selectedGroup === "science") {
    const hasMedicineGrades =
      scores['biology'] === 1 &&
      scores['chemistry'] === 1 &&
      scores['physics'] === 1;

    const allAtLeastB3 = Object.values(scores).every(score => score <= 3);

    if (hasMedicineGrades && allAtLeastB3) {
      resultText = "Eligible for Medicine.";
    } else if (allAtLeastB3) {
      resultText = "Eligible for Computer Science.";
    }
  }

  else if (selectedGroup === "arts") {
    const ictA1 = scores['e-ict'] === 1;
    const emathsB3orBetter = scores['e-maths'] <= 3;

    const geographyA1 = scores['geography'] === 1;
    const emathsA1 = scores['e-maths'] === 1;
    const allAtLeastC4 = Object.values(scores).every(score => score <= 4);

    if (ictA1 && emathsB3orBetter) {
      resultText = "Eligible for Computer Science.";
    } else if ((geographyA1 || emathsA1) && allAtLeastC4) {
      resultText = "Eligible for Archaeology.";
    }
  }

  resultDiv.textContent = resultText;
});

