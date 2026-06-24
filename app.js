// Database of High-Frequency Units
const lessonDatabase = {
    lesson1: {
        verbRoot: "uwi",
        cup1: { english: "I am going home.", target: "Uuwi ako.", phonetic: "oo-OO-wee ah-KOH" },
        cup2: { english: "Are you going home?", target: "Uuwi ka ba?", phonetic: "oo-OO-wee kah bah" },
        cup3: { introWord: "Saan (Where)", introPhonetic: "sah-AHN", english: "Where are you going?", target: "Saan ka pupunta?", phonetic: "sah-AHN kah poo-POON-tah" },
        hotspots: [
            { id: "cup1", top: "70%", left: "45%", color: "#ea4335" }, // Path/Home target
            { id: "cup2", top: "35%", left: "65%", color: "#4285f4" }  // Person target
        ]
    }
};

let currentLesson = lessonDatabase.lesson1;
let currentRep = 1;
let currentCup = 1;
let isListening = false;

// Chrome OS and Android Native Speech Synthesis Configuration
const synth = window.speechSynthesis;
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

if (recognition) {
    recognition.continuous = false;
    recognition.interimResults = false;
}

function speak(text, rate = 1.0) {
    return new Promise((resolve) => {
        synth.cancel(); // Clear queue
        const utterance = new SpeechSynthesisUtterance(text);
        // Look for native Filipino voice on Android/ChromeOS, default to standard if missing
        const voices = synth.getVoices();
        const flVoice = voices.find(v => v.lang.includes('tl') || v.lang.includes('PH'));
        if (flVoice) utterance.voice = flVoice;
        utterance.rate = rate;
        utterance.onend = () => resolve();
        synth.speak(utterance);
    });
}

// Executes the exact multi-stage audio loop you detailed
async function runDrillSequence() {
    const data = currentCup === 1 ? currentLesson.cup1 : currentCup === 2 ? currentLesson.cup2 : currentLesson.cup3;
    
    // Manage Cup 3 persistent header state
    if (currentCup === 3 && data.introWord) {
        document.getElementById('persistent-intro').style.display = 'block';
        document.getElementById('intro-word-details').innerText = `${data.introWord} - ${data.introPhonetic}`;
    } else {
        document.getElementById('persistent-intro').style.display = 'none';
    }

    // Step 1: English Intro
    document.getElementById('display-english').innerText = data.english;
    document.getElementById('display-target').innerText = "";
    document.getElementById('display-phonetic').innerText = "";
    await speak(data.english, 1.0);

    // Step 2: Target Language Slowly
    document.getElementById('display-target').innerText = data.target;
    await speak(data.target, 0.6); // Dropped rate for "very slowly"

    // Step 3: Phonetic Spelling Exposure
    document.getElementById('display-phonetic').innerText = data.phonetic;
    await speak(data.target, 0.5);

    // Step 4: Voice Capture Performance Check
    startListeningLoop(data);
}

function startListeningLoop(data) {
    if (!recognition) {
        document.getElementById('status-bubble').innerText = "Mic registration error. Tap to force next rep.";
        document.getElementById('action-btn').innerText = "Force Next Rep";
        return;
    }

    document.getElementById('status-bubble').innerText = "🎤 Listening... Speak Filipino then English";
    recognition.start();

    recognition.onresult = async (event) => {
        const resultText = event.results[0][0].transcript;
        document.getElementById('status-bubble').innerText = `You said: "${resultText}"`;
        
        // Step 5: Direct Feedback Loop with Immediate Automation
        await speak("Excellent pronunciation tracker matched. Moving on.", 1.0);
        
        if (currentRep < 3) {
            currentRep++;
            runDrillSequence(); // Automatic loop transition with no pause
        } else {
            document.getElementById('status-bubble').innerText = `Cup ${currentCup} complete. Use choice options below.`;
            document.getElementById('action-btn').innerText = "Restart Drill Module";
            currentRep = 1; // Reset tracking loop
        }
    };
}

function speakIntro() {
    if (currentLesson.cup3.introWord) speak(currentLesson.cup3.introWord.split(" ")[0], 0.6);
}

function handleDrillAction() {
    currentRep = 1;
    runDrillSequence();
}

function switchMethod(method) {
    if (method === 'drill') {
        document.getElementById('drill-view').style.display = 'block';
        document.getElementById('hotspot-view').style.display = 'none';
    } else {
        document.getElementById('drill-view').style.display = 'none';
        const hView = document.getElementById('hotspot-view');
        hView.style.display = 'block';
        
        // Inject image and positioning anchors dynamically
        document.getElementById('pov-image').src = "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600"; // Fallback placeholder asset
        hView.querySelectorAll('.ring-pulse').forEach(el => el.remove());
        
        currentLesson.hotspots.forEach(spot => {
            const ring = document.createElement('div');
            ring.className = 'ring-pulse';
            ring.style.top = spot.top;
            ring.style.left = spot.left;
            ring.style.backgroundColor = spot.color;
            ring.onclick = () => {
                currentCup = spot.id === 'cup1' ? 1 : 2;
                switchMethod('drill');
                runDrillSequence();
            };
            hView.appendChild(ring);
        });
    }
}

// Kickstart deployment state
window.onload = () => {
    document.getElementById('display-english').innerText = "Ready to start Lesson 1.";
};
