document.addEventListener('DOMContentLoaded', () => {
    const circuit = new Circuit();
    const answerInput = document.getElementById('answer');
    const checkButton = document.getElementById('checkAnswer');
    const newCircuitButton = document.getElementById('newCircuit');
    const feedback = document.getElementById('feedback');
    const circuitImage = document.getElementById('circuitImage');
    const resistorValues = document.getElementById('resistorValues');

    function updateView() {
        // Toon juiste afbeelding
        circuitImage.src = circuit.getImageForType();
        circuitImage.alt = `Schakeling: ${circuit.circuitType}`;
        // Toon waarden in de kantlijn
        resistorValues.innerHTML = `
            <div>R<sub>1</sub> = ${circuit.resistors[0]} Ω</div>
            <div>R<sub>2</sub> = ${circuit.resistors[1]} Ω</div>
            <div>R<sub>3</sub> = ${circuit.resistors[2]} Ω</div>
        `;
    }

    // Generate initial circuit
    circuit.generateCircuit();
    updateView();

    // Check answer
    checkButton.addEventListener('click', () => {
        const userAnswer = parseInt(answerInput.value);
        const calcText = circuit.getCalculationText();
        
        if (isNaN(userAnswer)) {
            feedback.innerHTML = 'Voer een geldig getal in';
            feedback.className = 'feedback incorrect';
            return;
        }

        if (Math.abs(userAnswer - circuit.correctAnswer) <= 1) {
            feedback.innerHTML = `✅ Correct!<br><br><strong>Berekening:</strong><br>${calcText.replace(/\n/g, '<br>')}`;
            feedback.className = 'feedback correct';
        } else {
            feedback.innerHTML = `❌ Incorrect. Het juiste antwoord is ${circuit.correctAnswer}Ω<br><br><strong>Berekening:</strong><br>${calcText.replace(/\n/g, '<br>')}`;
            feedback.className = 'feedback incorrect';
        }
    });

    // Generate new circuit
    newCircuitButton.addEventListener('click', () => {
        circuit.generateCircuit();
        updateView();
        answerInput.value = '';
        feedback.textContent = '';
        feedback.className = 'feedback';
    });

    // Allow Enter key to check answer
    answerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkButton.click();
        }
    });
}); 