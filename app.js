JavaScript
// --- DATABASE ---
const tracksDatabase = {
    ministry: [
        {
            reference: "1 John 1:9",
            stages: [
                {
                    stage_number: 1,
                    english_segment: "If we confess...",
                    matchPhrase: "kung ipapahayag natin",
                    words: [
                        { word: "Kung", phonetic: "koohng" },
                        { word: "ipapahayag", phonetic: "ee-pah-pah-hah-yag" },
                        { word: "natin", phonetic: "nah-teen" }
                    ]
                },
                {
                    stage_number: 2,
                    english_segment: "If we confess our sins...",
                    matchPhrase: "kung ipapahayag natin ang ating mga kasalanan",
                    words: [
                        { word: "Kung", phonetic: "koohng" },
                        { word: "ipapahayag", phonetic: "ee-pah-pah-hah-yag" },
                        { word: "natin", phonetic: "nah-teen" },
                        { word: "ang", phonetic: "ahng" },
                        { word: "ating", phonetic: "ah-teeng" },
                        { word: "mga", phonetic: "manga" },
                        { word: "kasalanan,", phonetic: "kah-sah-lah-nahn" }
                    ]
                },
                {
                    stage_number: 3,
                    english_segment: "If we confess our sins, he is faithful and just...",
                    matchPhrase: "kung ipapahayag natin ang ating mga kasalanan siya ay tapat at matuwid",
                    words: [
                        { word: "Kung", phonetic: "koohng" },
                        { word: "ipapahayag", phonetic: "ee-pah-pah-hah-yag" },
                        { word: "natin", phonetic: "nah-teen" },
                        { word: "ang", phonetic: "ahng" },
                        { word: "ating", phonetic: "ah-teeng" },
                        { word: "mga", phonetic: "manga" },
                        { word: "kasalanan,", phonetic: "kah-sah-lah-nahn" },
                        { word: "siya", phonetic: "shyah" },
                        { word: "ay", phonetic: "ay" },
                        { word: "tapat", phonetic: "tah-paht" },
                        { word: "at", phonetic: "aht" },
                        { word: "matuwid", phonetic: "mah-too-weed" }
                    ]
                }
            ]
        }
    ]
};

// --- CORE ENGINE ---
let activeTrack = [];
let currentLessonIndex = 0;
let currentStageIndex = 0;
let localRepetitionCounter = 1;

function selectPackage(chosenPack) {
    document.getElementById('onboarding-screen').style.display = 'none';
    document.getElementById('lesson-screen').style.display = 'block';
    activeTrack = tracksDatabase[chosenPack] || tracksDatabase['ministry'];
    renderProgressiveStage();
}

function renderProgressiveStage() {
    const stage = activeTrack[currentLessonIndex].stages[currentStageIndex];
    document.getElementById('counter-badge').innerText = `Section Build: ${stage.stage_number}/3`;
    document.getElementById('english-frame').innerText = stage.english_segment;
    
    const container = document.getElementById('word-columns-container');
    container.innerHTML = ""; 
    stage.words.forEach(item => {
        const div = document.createElement('div');
        div.style = "border: 2px solid #ccc; padding: 10px; border-radius: 8px; cursor: pointer; text-align: center; min-width: 70px;";
        div.innerHTML = `<div style="font-weight:bold">${item.word}</div><div style="font-size:0.8rem">${item.phonetic}</div>`;
        container.appendChild(div);
    });
}
