import {DOUBLE_OUT, SINGLE_OUT} from "../../constants/checkoutModes";
import getTurnInformation from "../../services/gameInformationService";
import {DOUBLE_IN, SINGLE_IN} from "../../constants/checkinModes";

describe('gameInformationService', () => {

    it('getTurnInformation einfach', () => {
        let players = defaultPlayers();
        players[0].aufnahmen = [
            [{value: 1, multiplier: 1}, {value: 1, multiplier: 1}, {value: 1, multiplier: 1}]
        ];
        players[1].aufnahmen = [
            [{value: 1, multiplier: 1}, {value: 1, multiplier: 1}]
        ];

        let turnInfo = getTurnInformation(players, 101, SINGLE_IN, DOUBLE_OUT);

        expect(turnInfo.playerInformation[0].score).toEqual(98);
        expect(turnInfo.playerInformation[1].score).toEqual(99);
        expect(turnInfo.playerInformation[0].dartCount).toEqual(3);
        expect(turnInfo.playerInformation[1].dartCount).toEqual(2);
        expect(turnInfo.playerInformation[0].average).toEqual("3.00");
        expect(turnInfo.playerInformation[1].average).toEqual("0.00");

        expect(turnInfo.turnInformation.current.playerIndex).toEqual(1);
        expect(turnInfo.turnInformation.current.aufnahmeIndex).toEqual(0);
        expect(turnInfo.turnInformation.current.dartIndex).toEqual(2);

        expect(turnInfo.turnInformation.previous.playerIndex).toEqual(1);
        expect(turnInfo.turnInformation.previous.aufnahmeIndex).toEqual(0);
        expect(turnInfo.turnInformation.previous.dartIndex).toEqual(1);
    });

    it('getTurnInformation anderer Spieler in vorherigem Zug', () => {
        let players = defaultPlayers();
        players[0].aufnahmen = [
            [{value: 1, multiplier: 1}, {value: 1, multiplier: 1}, {value: 1, multiplier: 1}]
        ];
        players[1].aufnahmen = [];

        let turnInfo = getTurnInformation(players, 101, SINGLE_IN, DOUBLE_OUT);

        expect(turnInfo.turnInformation.current.playerIndex).toEqual(1);
        expect(turnInfo.turnInformation.current.aufnahmeIndex).toEqual(0);
        expect(turnInfo.turnInformation.current.dartIndex).toEqual(0);

        expect(turnInfo.turnInformation.previous.playerIndex).toEqual(0);
        expect(turnInfo.turnInformation.previous.aufnahmeIndex).toEqual(0);
        expect(turnInfo.turnInformation.previous.dartIndex).toEqual(2);
    });

    it('getTurnInformation mehrere Aufnahmen', () => {
        let players = defaultPlayers();
        players[0].aufnahmen = [
            [{value: 1, multiplier: 1}, {value: 1, multiplier: 1}, {value: 1, multiplier: 1}],
            [{value: 1, multiplier: 1}, {value: 1, multiplier: 1}, {value: 1, multiplier: 1}]
        ];
        players[1].aufnahmen = [
            [{value: 1, multiplier: 1}, {value: 1, multiplier: 1}, {value: 1, multiplier: 1}],
            [{value: 11, multiplier: 1}, {value: 11, multiplier: 1}]
        ];

        let turnInfo = getTurnInformation(players, 101, SINGLE_IN, DOUBLE_OUT);

        expect(turnInfo.playerInformation[0].score).toEqual(95);
        expect(turnInfo.playerInformation[1].score).toEqual(76);
        expect(turnInfo.playerInformation[0].dartCount).toEqual(6);
        expect(turnInfo.playerInformation[1].dartCount).toEqual(5);
        expect(turnInfo.playerInformation[0].average).toEqual("3.00");
        expect(turnInfo.playerInformation[1].average).toEqual("3.00");

        expect(turnInfo.turnInformation.current.playerIndex).toEqual(1);
        expect(turnInfo.turnInformation.current.aufnahmeIndex).toEqual(1);
        expect(turnInfo.turnInformation.current.dartIndex).toEqual(2);

        expect(turnInfo.turnInformation.previous.playerIndex).toEqual(1);
        expect(turnInfo.turnInformation.previous.aufnahmeIndex).toEqual(1);
        expect(turnInfo.turnInformation.previous.dartIndex).toEqual(1);
    });

    it('getTurnInformation checkout doubleout', () => {
        let players = defaultPlayers();
        players[0].aufnahmen = [
            [{value: 20, multiplier: 3}, {value: 1, multiplier: 1}, {value: 20, multiplier: 2}]
        ];
        players[1].aufnahmen = [];

        let turnInfo = getTurnInformation(players, 101, SINGLE_IN, DOUBLE_OUT);

        expect(turnInfo.playerInformation[0].score).toEqual(0);
        expect(turnInfo.playerInformation[1].score).toEqual(101);
        expect(turnInfo.playerInformation[0].dartCount).toEqual(3);
        expect(turnInfo.playerInformation[1].dartCount).toEqual(0);
        expect(turnInfo.playerInformation[0].average).toEqual("101.00");
        expect(turnInfo.playerInformation[1].average).toEqual("0.00");

        expect(turnInfo.turnInformation.current.playerIndex).toEqual(1);
        expect(turnInfo.turnInformation.current.aufnahmeIndex).toEqual(0);
        expect(turnInfo.turnInformation.current.dartIndex).toEqual(0);

        expect(turnInfo.turnInformation.previous.playerIndex).toEqual(0);
        expect(turnInfo.turnInformation.previous.aufnahmeIndex).toEqual(0);
        expect(turnInfo.turnInformation.previous.dartIndex).toEqual(2);
    });

    it('getTurnInformation checkout fehlgeschlagen da doubleout', () => {
        let players = defaultPlayers();
        players[0].aufnahmen = [
            [{value: 20, multiplier: 3}, {value: 15, multiplier: 2}, {value: 11, multiplier: 1}]
        ];
        players[1].aufnahmen = [];

        let turnInfo = getTurnInformation(players, 101, SINGLE_IN, DOUBLE_OUT);

        expect(turnInfo.playerInformation[0].score).toEqual(101);
        expect(turnInfo.playerInformation[1].score).toEqual(101);
        expect(turnInfo.playerInformation[0].dartCount).toEqual(3);
        expect(turnInfo.playerInformation[1].dartCount).toEqual(0);
        expect(turnInfo.playerInformation[0].average).toEqual("0.00");
        expect(turnInfo.playerInformation[1].average).toEqual("0.00");

        expect(turnInfo.turnInformation.current.playerIndex).toEqual(1);
        expect(turnInfo.turnInformation.current.aufnahmeIndex).toEqual(0);
        expect(turnInfo.turnInformation.current.dartIndex).toEqual(0);

        expect(turnInfo.turnInformation.previous.playerIndex).toEqual(0);
        expect(turnInfo.turnInformation.previous.aufnahmeIndex).toEqual(0);
        expect(turnInfo.turnInformation.previous.dartIndex).toEqual(2);
    });

    it('getTurnInformation checkout singleout', () => {
        let players = defaultPlayers();
        players[0].aufnahmen = [
            [{value: 20, multiplier: 3}, {value: 20, multiplier: 2}, {value: 1, multiplier: 1}]
        ];
        players[1].aufnahmen = [];

        let turnInfo = getTurnInformation(players, 101, SINGLE_IN, SINGLE_OUT);

        expect(turnInfo.playerInformation[0].score).toEqual(0);
        expect(turnInfo.playerInformation[1].score).toEqual(101);
        expect(turnInfo.playerInformation[0].dartCount).toEqual(3);
        expect(turnInfo.playerInformation[1].dartCount).toEqual(0);
        expect(turnInfo.playerInformation[0].average).toEqual("101.00");
        expect(turnInfo.playerInformation[1].average).toEqual("0.00");

        expect(turnInfo.turnInformation.current.playerIndex).toEqual(1);
        expect(turnInfo.turnInformation.current.aufnahmeIndex).toEqual(0);
        expect(turnInfo.turnInformation.current.dartIndex).toEqual(0);

        expect(turnInfo.turnInformation.previous.playerIndex).toEqual(0);
        expect(turnInfo.turnInformation.previous.aufnahmeIndex).toEqual(0);
        expect(turnInfo.turnInformation.previous.dartIndex).toEqual(2);
    });

    it('getTurnInformation checkout singleout mit double', () => {
        let players = defaultPlayers();
        players[0].aufnahmen = [
            [{value: 20, multiplier: 3}, {value: 1, multiplier: 1}, {value: 20, multiplier: 2}]
        ];
        players[1].aufnahmen = [];

        let turnInfo = getTurnInformation(players, 101, SINGLE_IN, SINGLE_OUT);

        expect(turnInfo.playerInformation[0].score).toEqual(0);
        expect(turnInfo.playerInformation[1].score).toEqual(101);
        expect(turnInfo.playerInformation[0].dartCount).toEqual(3);
        expect(turnInfo.playerInformation[1].dartCount).toEqual(0);
        expect(turnInfo.playerInformation[0].average).toEqual("101.00");
        expect(turnInfo.playerInformation[1].average).toEqual("0.00");

        expect(turnInfo.turnInformation.current.playerIndex).toEqual(1);
        expect(turnInfo.turnInformation.current.aufnahmeIndex).toEqual(0);
        expect(turnInfo.turnInformation.current.dartIndex).toEqual(0);

        expect(turnInfo.turnInformation.previous.playerIndex).toEqual(0);
        expect(turnInfo.turnInformation.previous.aufnahmeIndex).toEqual(0);
        expect(turnInfo.turnInformation.previous.dartIndex).toEqual(2);
    });

    it('getTurnInformation ueberworfen', () => {
        let players = defaultPlayers();
        players[0].aufnahmen = [
            [{value: 1, multiplier: 1}, {value: 1, multiplier: 1}, {value: 1, multiplier: 1}],
            [{value: 1, multiplier: 1}, {value: 1, multiplier: 1}, {value: 1, multiplier: 1}]
        ];
        players[1].aufnahmen = [
            [{value: 1, multiplier: 1}, {value: 1, multiplier: 1}, {value: 1, multiplier: 1}],
            [{value: 20, multiplier: 3}, {value: 20, multiplier: 3}]
        ];

        let turnInfo = getTurnInformation(players, 101, SINGLE_IN, DOUBLE_OUT);

        expect(turnInfo.playerInformation[0].score).toEqual(95);
        expect(turnInfo.playerInformation[1].score).toEqual(98);
        expect(turnInfo.playerInformation[0].dartCount).toEqual(6);
        expect(turnInfo.playerInformation[1].dartCount).toEqual(5);
        expect(turnInfo.playerInformation[0].average).toEqual("3.00");
        expect(turnInfo.playerInformation[1].average).toEqual("1.50");

        expect(turnInfo.turnInformation.current.playerIndex).toEqual(0);
        expect(turnInfo.turnInformation.current.aufnahmeIndex).toEqual(2);
        expect(turnInfo.turnInformation.current.dartIndex).toEqual(0);

        expect(turnInfo.turnInformation.previous.playerIndex).toEqual(1);
        expect(turnInfo.turnInformation.previous.aufnahmeIndex).toEqual(1);
        expect(turnInfo.turnInformation.previous.dartIndex).toEqual(1);
    });

    it('getTurnInformation 1 bei Double out ist ueberworfen', () => {
        let players = defaultPlayers();
        players[0].aufnahmen = [
            [{value: 20, multiplier: 3}, {value: 20, multiplier: 2}]
        ];
        players[1].aufnahmen = [];

        let turnInfo = getTurnInformation(players, 101, SINGLE_IN, DOUBLE_OUT);

        expect(turnInfo.playerInformation[0].score).toEqual(101);
        expect(turnInfo.playerInformation[1].score).toEqual(101);
        expect(turnInfo.playerInformation[0].dartCount).toEqual(2);
        expect(turnInfo.playerInformation[1].dartCount).toEqual(0);
        expect(turnInfo.playerInformation[0].average).toEqual("0.00");
        expect(turnInfo.playerInformation[1].average).toEqual("0.00");

        expect(turnInfo.turnInformation.current.playerIndex).toEqual(1);
        expect(turnInfo.turnInformation.current.aufnahmeIndex).toEqual(0);
        expect(turnInfo.turnInformation.current.dartIndex).toEqual(0);

        expect(turnInfo.turnInformation.previous.playerIndex).toEqual(0);
        expect(turnInfo.turnInformation.previous.aufnahmeIndex).toEqual(0);
        expect(turnInfo.turnInformation.previous.dartIndex).toEqual(1);
    });

    it('getTurnInformation Double-In keine Punkte für Single oder Triple', () => {
        let players = defaultPlayers();
        players[0].aufnahmen = [
            [{value: 1, multiplier: 1}, {value: 1, multiplier: 3}, {value: 1, multiplier: 1}]
        ];
        players[1].aufnahmen = [
            [{value: 1, multiplier: 1}, {value: 1, multiplier: 1}]
        ];

        let turnInfo = getTurnInformation(players, 101, DOUBLE_IN, DOUBLE_OUT);

        expect(turnInfo.playerInformation[0].score).toEqual(101);
        expect(turnInfo.playerInformation[1].score).toEqual(101);
        expect(turnInfo.playerInformation[0].dartCount).toEqual(3);
        expect(turnInfo.playerInformation[1].dartCount).toEqual(2);
        expect(turnInfo.playerInformation[0].average).toEqual("0.00");
        expect(turnInfo.playerInformation[1].average).toEqual("0.00");

        expect(turnInfo.turnInformation.current.playerIndex).toEqual(1);
        expect(turnInfo.turnInformation.current.aufnahmeIndex).toEqual(0);
        expect(turnInfo.turnInformation.current.dartIndex).toEqual(2);

        expect(turnInfo.turnInformation.previous.playerIndex).toEqual(1);
        expect(turnInfo.turnInformation.previous.aufnahmeIndex).toEqual(0);
        expect(turnInfo.turnInformation.previous.dartIndex).toEqual(1);
    });

    it('getTurnInformation Double-In standard', () => {
        let players = defaultPlayers();
        players[0].aufnahmen = [
            [{value: 1, multiplier: 1}, {value: 1, multiplier: 1}, {value: 1, multiplier: 1}],
            [{value: 20, multiplier: 2}, {value: 11, multiplier: 1}, {value: 25, multiplier: 2}]
        ];
        players[1].aufnahmen = [
            [{value: 1, multiplier: 1}, {value: 1, multiplier: 1}, {value: 1, multiplier: 1}]
        ];

        let turnInfo = getTurnInformation(players, 101, DOUBLE_IN, DOUBLE_OUT);

        expect(turnInfo.playerInformation[0].score).toEqual(0);
        expect(turnInfo.playerInformation[1].score).toEqual(101);
        expect(turnInfo.playerInformation[0].dartCount).toEqual(6);
        expect(turnInfo.playerInformation[1].dartCount).toEqual(3);
        expect(turnInfo.playerInformation[0].average).toEqual("50.50");
        expect(turnInfo.playerInformation[1].average).toEqual("0.00");

        expect(turnInfo.turnInformation.current.playerIndex).toEqual(1);
        expect(turnInfo.turnInformation.current.aufnahmeIndex).toEqual(1);
        expect(turnInfo.turnInformation.current.dartIndex).toEqual(0);

        expect(turnInfo.turnInformation.previous.playerIndex).toEqual(0);
        expect(turnInfo.turnInformation.previous.aufnahmeIndex).toEqual(1);
        expect(turnInfo.turnInformation.previous.dartIndex).toEqual(2);
    });

    it('getTurnInformation Double-In condition auch wenn überworfen', () => {
        let players = defaultPlayers();
        players[0].aufnahmen = [
            [{value: 25, multiplier: 2}, {value: 20, multiplier: 3}],
            [{value: 17, multiplier: 3}, {value: 25, multiplier: 2}]
        ];
        players[1].aufnahmen = [
            [{value: 1, multiplier: 2}, {value: 1, multiplier: 1}, {value: 1, multiplier: 1}]
        ];

        let turnInfo = getTurnInformation(players, 101, DOUBLE_IN, DOUBLE_OUT);

        expect(turnInfo.playerInformation[0].score).toEqual(0);
        expect(turnInfo.playerInformation[1].score).toEqual(97);
        expect(turnInfo.playerInformation[0].dartCount).toEqual(4);
        expect(turnInfo.playerInformation[1].dartCount).toEqual(3);
        expect(turnInfo.playerInformation[0].average).toEqual("50.50");
        expect(turnInfo.playerInformation[1].average).toEqual("0.00");

        expect(turnInfo.turnInformation.current.playerIndex).toEqual(1);
        expect(turnInfo.turnInformation.current.aufnahmeIndex).toEqual(1);
        expect(turnInfo.turnInformation.current.dartIndex).toEqual(0);

        expect(turnInfo.turnInformation.previous.playerIndex).toEqual(0);
        expect(turnInfo.turnInformation.previous.aufnahmeIndex).toEqual(1);
        expect(turnInfo.turnInformation.previous.dartIndex).toEqual(1);
    });

    it('Bug #11 fehlerhafte average-berechnung', () => {
        let players = defaultPlayers();
        players[0].aufnahmen = [
            [{value: 20, multiplier: 1}, {value: 20, multiplier: 1}, {value: 20, multiplier: 1}],
            [{value: 14, multiplier: 1}, {value: 7, multiplier: 1}]
        ];
        players[1].aufnahmen = [
            [{value: 20, multiplier: 1}, {value: 20, multiplier: 1}, {value: 20, multiplier: 1}]
        ];

        let turnInfo = getTurnInformation(players, 101, SINGLE_IN, DOUBLE_OUT);

        expect(turnInfo.playerInformation[0].average).toEqual("60.00");
    });

});

function defaultPlayers(){
    let player1 = {id: 1, name: "Eins"};
    let player2 = {id: 2, name: "Zwei"};
    return [player1, player2];
}
