// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch((error) => {
        console.log('Service Worker registration failed:', error);
      });
  });
}

// DOM Elements
const keySelect = document.getElementById("key-select");
const accidentalSelect = document.getElementById("accidental-select");
const flashCardTitle = document.getElementById("flash-card-title");
const flashCardScreen = document.getElementById("flash-card-screen");
const startButton = document.getElementById("start-button");
const backButton = document.getElementById("back-button");
const randomChordElement = document.getElementById("random-number");
const chordButtons = document.getElementById("chord-buttons");
const feedback = document.getElementById("feedback");

// Valid keys & accidentals
const validNaturals = ["C", "D", "E", "F", "G", "A", "B"];
const validSharps = ["C", "D", "F", "G", "A"]; // Can have #
const validFlats = ["D", "E", "G", "A", "B"]; // Can have b

// Function to Update Accidentals Based on Key Selection
function updateAccidentalOptions() {
  accidentalSelect.innerHTML = '<option value="">Natural</option>'; // Default natural option
  accidentalSelect.disabled = true; // Disable until a key is selected
  const selectedKey = keySelect.value;

  if (!selectedKey) return; // If no key is selected, stop here
  accidentalSelect.disabled = false; // Enable accidental dropdown

  // Add valid sharps
  if (validSharps.includes(selectedKey)) {
    accidentalSelect.innerHTML += '<option value="#">Sharp (#)</option>';
  }

  // Add valid flats
  if (validFlats.includes(selectedKey)) {
    accidentalSelect.innerHTML += '<option value="b">Flat (b)</option>';
  }
}

// Chord Mappings for Each Key (Accurate Enharmonics)
const chordMappings = {
  "C": ["C", "Dm", "Em", "F", "G", "Am", "Bdim"],
  "D": ["D", "Em", "F#m", "G", "A", "Bm", "C#dim"],
  "E": ["E", "F#m", "G#m", "A", "B", "C#m", "D#dim"],
  "F": ["F", "Gm", "Am", "Bb", "C", "Dm", "Edim"],
  "G": ["G", "Am", "Bm", "C", "D", "Em", "F#dim"],
  "A": ["A", "Bm", "C#m", "D", "E", "F#m", "G#dim"],
  "B": ["B", "C#m", "D#m", "E", "F#", "G#m", "A#dim"],
  "Bb": ["Bb", "Cm", "Dm", "Eb", "F", "Gm", "Adim"],
  "Eb": ["Eb", "Fm", "Gm", "Ab", "Bb", "Cm", "Ddim"],
  "Ab": ["Ab", "Bbm", "Cm", "Db", "Eb", "Fm", "Gdim"],
  "Db": ["Db", "Ebm", "Fm", "Gb", "Ab", "Bbm", "Cdim"],
  "F#": ["F#", "G#m", "A#m", "B", "C#", "D#m", "E#dim"],
  "C#": ["C#", "D#m", "E#m", "F#", "G#", "A#m", "B#dim"]
};

// Function to Update the Displayed Key
function updateFlashCardTitle() {
  const key = keySelect.value;
  const accidental = accidentalSelect.value;
  const displayKey = accidental ? `${key}${accidental}` : key;
  flashCardTitle.textContent = `Key of ${displayKey}`;
}

// Event Listeners for Dropdowns
keySelect.addEventListener("change", () => {
  accidentalSelect.value = ""; // Reset accidental dropdown
  updateAccidentalOptions();
  updateFlashCardTitle();
});
accidentalSelect.addEventListener("change", updateFlashCardTitle);

// Initialize Accidental Options on Page Load
updateAccidentalOptions();

// Flash Card Logic
let currentKey = "C";
let currentAccidental = "";

function generateFlashCard() {
  const selectedKey = currentAccidental ? `${currentKey}${currentAccidental}` : currentKey;
  const chordsInKey = chordMappings[selectedKey] || chordMappings[currentKey];

  const randomChordIndex = Math.floor(Math.random() * 7);
  const randomChord = chordsInKey[randomChordIndex];

  randomChordElement.textContent = `What is the number for the chord: ${randomChord}?`;
  chordButtons.innerHTML = '';
  feedback.textContent = '';

  for (let i = 1; i <= 7; i++) {
    const button = document.createElement('button');
    button.textContent = i;
    button.classList.add('chord-button');
    button.addEventListener('click', () => {
      if (i - 1 === randomChordIndex) {
        feedback.textContent = 'Correct!';
        feedback.style.color = 'green';
        setTimeout(generateFlashCard, 1500);
      } else {
        feedback.textContent = 'Try again!';
        feedback.style.color = 'red';
      }
    });
    chordButtons.appendChild(button);
  }
}

// Start Flash Card Game
startButton.addEventListener("click", function () {
  currentKey = keySelect.value;
  currentAccidental = accidentalSelect.value;
  updateFlashCardTitle();
  document.getElementById("main-screen").style.display = "none";
  flashCardScreen.style.display = "block";
  generateFlashCard();
});

// Back to Main Screen
backButton.addEventListener("click", function () {
  flashCardScreen.style.display = "none";
  document.getElementById("main-screen").style.display = "block";
  feedback.textContent = '';
});
