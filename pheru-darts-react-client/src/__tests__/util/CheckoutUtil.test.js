import POSSIBLE_CHECKOUTS from "../../util/PossibleCheckouts";

describe('CheckOutUtil', () => {

    it('Alle definierten Checkouts korrekt', () => {
        for (let checkInKey in POSSIBLE_CHECKOUTS) {
            if (POSSIBLE_CHECKOUTS.hasOwnProperty(checkInKey)) {
                let forCheckIn = POSSIBLE_CHECKOUTS[checkInKey];

                for (let checkOutKey in forCheckIn) {
                    if (forCheckIn.hasOwnProperty(checkOutKey)) {
                        let forCheckOut = forCheckIn[checkOutKey];

                        testScores(forCheckOut[1]);
                        testScores(forCheckOut[2]);
                        testScores(forCheckOut[3]);
                    }
                }
            }
        }
    });
});

function testScores(checkOutsForScore) {
    for (let score in checkOutsForScore) {
        if (checkOutsForScore.hasOwnProperty(score)) {
            let checkOut = checkOutsForScore[score];
            let checkOutSplit = checkOut.split(" ");
            let checkOutSum = 0;
            for (let i = 0; i < checkOutSplit.length; i++) {
                let valueAsString = checkOutSplit[i];
                let value = 0;
                if (valueAsString.includes("D")) {
                    value = 2 * Number.parseInt(valueAsString.replace("D", ""));
                } else if (valueAsString.includes("T")) {
                    value = 3 * Number.parseInt(valueAsString.replace("T", ""));
                } else {
                    value = Number.parseInt(valueAsString);
                }
                checkOutSum += value;
            }
            expect(checkOutSum).toEqual(Number.parseInt(score));
        }
    }
}