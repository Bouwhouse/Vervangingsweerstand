class Circuit {
    constructor() {
        this.resistors = [];
        this.circuitType = '';
        this.correctAnswer = 0;
    }

    generateRandomResistor() {
        return Math.floor(Math.random() * 10 + 1) * 10; // Random value from 10 to 100 in steps of 10
    }

    generateCircuit() {
        this.resistors = [
            this.generateRandomResistor(),
            this.generateRandomResistor(),
            this.generateRandomResistor()
        ];

        const types = ['series', 'parallel', 'series-parallel', 'parallel-series'];
        this.circuitType = types[Math.floor(Math.random() * types.length)];

        this.calculateCorrectAnswer();
    }

    calculateCorrectAnswer() {
        switch (this.circuitType) {
            case 'series':
                this.correctAnswer = this.resistors.reduce((a, b) => a + b, 0);
                break;
            case 'parallel':
                this.correctAnswer = Math.round(1 / this.resistors.reduce((a, b) => a + 1/b, 0));
                break;
            case 'series-parallel':
                // Eerst R2 en R3 parallel, dan R1 in serie
                const invSP = 1/this.resistors[1] + 1/this.resistors[2];
                const R23 = 1 / invSP;
                this.correctAnswer = Math.round(this.resistors[0] + R23);
                break;
            case 'parallel-series':
                const R12 = this.resistors[0] + this.resistors[1];  // Eerst R1 en R2 in serie
                const invPS = 1/R12 + 1/this.resistors[2];  // Dan parallel met R3
                const exactRvPS = 1/invPS;
                this.correctAnswer = Math.round(exactRvPS);
                break;
        }
    }

    getImageForType() {
        switch (this.circuitType) {
            case 'series':
                return 'serie.png';
            case 'parallel':
                return 'parallel.png';
            case 'series-parallel':
                return 'serie-parallel.png';
            case 'parallel-series':
                return 'parallel-serie.png';
            default:
                return '';
        }
    }

    getCalculationText() {
        const [R1, R2, R3] = this.resistors;
        // Helper voor getallen netjes weergeven
        const fmt = (x) => Number.isInteger(x) ? x : x.toFixed(2).replace('.', ',');
        const fmtExact = (x) => {
            const str = x.toString();
            if (str.includes('.')) {
                const parts = str.split('.');
                if (parts[1].length > 5) {
                    return x.toFixed(5).replace('.', ',') + '...';
                }
            }
            return str.replace('.', ',');
        };
        switch (this.circuitType) {
            case 'series':
                return [
                    `R<sub>v</sub> = R<sub>1</sub> + R<sub>2</sub> + R<sub>3</sub>`,
                    `= ${fmt(R1)} + ${fmt(R2)} + ${fmt(R3)}`,
                    `= ${fmt(R1 + R2 + R3)} Ω`
                ].join('\n');
            case 'parallel':
                const inv1 = 1/R1, inv2 = 1/R2, inv3 = 1/R3, invSum = inv1 + inv2 + inv3;
                const exactRv = 1/invSum;
                return [
                    `1/R<sub>v</sub> = 1/R<sub>1</sub> + 1/R<sub>2</sub> + 1/R<sub>3</sub>`,
                    `= 1/${fmt(R1)} + 1/${fmt(R2)} + 1/${fmt(R3)}`,
                    `= ${fmtExact(inv1)} + ${fmtExact(inv2)} + ${fmtExact(inv3)}`,
                    `= ${fmtExact(invSum)}`,
                    `R<sub>v</sub> = 1/(${fmtExact(invSum)}) = ${fmtExact(exactRv)} Ω`,
                    `≈ ${Math.round(exactRv)} Ω`
                ].join('\n');
            case 'series-parallel':
                // Eerst R2 en R3 parallel, dan R1 in serie
                const invSP1 = 1/R2, invSP2 = 1/R3, invSumSP = invSP1 + invSP2;
                const R23 = 1 / invSumSP;
                const exactRvSP = R1 + R23;
                return [
                    `1/R<sub>23</sub> = 1/R<sub>2</sub> + 1/R<sub>3</sub>`,
                    `= 1/${fmt(R2)} + 1/${fmt(R3)}`,
                    `= ${fmtExact(invSP1)} + ${fmtExact(invSP2)}`,
                    `= ${fmtExact(invSumSP)}`,
                    `R<sub>23</sub> = 1/(${fmtExact(invSumSP)}) = ${fmtExact(R23)} Ω`,
                    `R<sub>v</sub> = R<sub>1</sub> + R<sub>23</sub>`,
                    `= ${fmt(R1)} + ${fmtExact(R23)}`,
                    `= ${fmtExact(exactRvSP)} Ω`,
                    `≈ ${Math.round(exactRvSP)} Ω`
                ].join('\n');
            case 'parallel-series':
                const R12 = R1 + R2;  // Eerst R1 en R2 in serie
                const invPS = 1/R12 + 1/R3;  // Dan parallel met R3
                const exactRvPS = 1/invPS;
                return [
                    `R<sub>12</sub> = R<sub>1</sub> + R<sub>2</sub>`,
                    `= ${fmt(R1)} + ${fmt(R2)}`,
                    `= ${fmtExact(R12)} Ω`,
                    `1/R<sub>v</sub> = 1/R<sub>12</sub> + 1/R<sub>3</sub>`,
                    `= 1/${fmtExact(R12)} + 1/${fmt(R3)}`,
                    `= ${fmtExact(1/R12)} + ${fmtExact(1/R3)}`,
                    `= ${fmtExact(invPS)}`,
                    `R<sub>v</sub> = 1/(${fmtExact(invPS)}) = ${fmtExact(exactRvPS)} Ω`,
                    `≈ ${Math.round(exactRvPS)} Ω`
                ].join('\n');
            default:
                return '';
        }
    }
} 