// Complete Database Organized by Structure 1 through 5
const lessonData = {
    structure1: { type: "intro", title: "Structure 1: Verb Intro", target: "Uuwi", phonetic: "oo-OO-wee", english: "Going home" },
    structure2: { type: "cup1",  title: "Structure 2: Cup 1 (Statement)", target: "Uuwi ako.", phonetic: "oo-OO-wee ah-KOH", english: "I am going home." },
    structure3: { type: "cup2",  title: "Structure 3: Cup 2 (Yes/No)", target: "Uuwi ka ba?", phonetic: "oo-OO-wee kah bah", english: "Are you going home?" },
    structure4: { type: "intro", title: "Structure 4: Cup 3 Word Intro", target: "Saan", phonetic: "sah-AHN", english: "Where" },
    structure5: { type: "cup3",  title: "Structure 5: Cup 3 (Open Question)", target: "Saan ka pupunta?", phonetic: "sah-AHN kah poo-POON-tah", english: "Where are you going?" }
};

let currentStructureKey = "structure1";
let currentRep = 1;
const totalReps = 2; // Fixed to 2 repetitions per your rule

const synth = window.speechSynthesis;
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

// Build Structure Menu on launch so you can pick exactly where to start
function initStructureMenu() {
    const container = document.getElementById('structure-selector-container');
    container.innerHTML = ""; // Clear
    
    Object.keys(lessonData).forEach(key => {
        const btn = document.createElement('button');
        btn.className = "btn btn-repeat";
        btn.style.margin = "5px";
        btn.innerText = lessonData[key].title;
        btn.onclick = () => selectStructure(key);
        container.appendChild(btn);
    });
}

function selectStructure(key) {
    currentStructureKey = key;
    currentRep = 1;
    document.getElementById('status-bubble').innerText = `Selected ${lessonData[key].title}. Ready to start.`;
    runStructureSequence();
}

async function speak(text, rate = 0.7) {
    return new Promise((resolve) => {
        synth.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        const voices = synth.getVoices();
        const flVoice = voices.find(v => v.lang.includes('tl') || v.lang.includes('PH'));
        if (flVoice) utterance.voice = flVoice;
        utterance.rate = rate;
        utterance.onend = () => resolve();
        synth.speak(utterance);
    });
}

// Executes the exact audio rules for the active structure
async function runStructureSequence() {
    const data = lessonData[currentStructureKey];
    
    // UI Updates
    document.getElementById('display-english').innerText = data.english;
    document.getElementById('display-target').innerText = data.target;
    document.getElementById('display-phonetic').innerText = data.phonetic;
    document.getElementById('action-btn').style.display = "none"; // Hide button during speech
    
    document.getElementById('status-bubble').innerText = `🔊 Playing Audio (Repetition ${currentRep}/${totalReps})...`;

    // Rule: Say it out loud TWICE before the user repeats
    await speak(data.target, 0.7);
    await new Promise(r => setTimeout(r, 400)); // Short natural breath pause
    await speak(data.target, 0.7);

    // Prompt user to repeat
    document.getElementById('status-bubble').innerText = "🎤 Your turn! Repeat the phrase out loud.";
    
    if (recognition) {
        recognition.start();
        recognition.onresult = (event) => {
            const spokenText = event.results[0][0].transcript;
            document.getElementById('status-bubble').innerText = `Heard: "${spokenText}"`;
            prepareNextInteraction();
        };
        recognition.onerror = () => {
            prepareNextInteraction(); // Don't freeze the UI if mic times out
        };
    } else {
        prepareNextInteraction();
    }
}

function prepareNextInteraction() {
    const actionBtn = document.getElementById('action-btn');
    actionBtn.style.display = "inline-block";
    
    if (currentRep < totalReps) {
        actionBtn.innerText = `Proceed to Repetition ${currentRep + 1}`;
    } else {
        actionBtn.innerText = "Structure Finished! Pick Next Structure Above";
    }
}

function handleNextAction() {
    if (currentRep < totalReps) {
        currentRep++;
        runStructureSequence();
    } else {
        document.getElementById('status-bubble').innerText = "Please select the next structure from the top menu.";
    }
}

// Layout Switcher logic for future methods
function switchMethod(method) {
    if (method === 'drill') {
        document.getElementById('drill-view').style.display = 'block';
        document.getElementById('hotspot-view').style.display = 'none';
    } else if (method === 'hotspot') {
        document.getElementById('drill-view').style.display = 'none';
        document.getElementById('hotspot-view').style.display = 'block';
    }
}

window.onload = () => {
    initStructureMenu();
    selectStructure("structure1"); // Default entry point
};
