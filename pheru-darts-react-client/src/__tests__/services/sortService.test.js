import {sortDartDataByScoreDesc, sortGameDataByOpponentAsc, sortPlayerByNameAsc} from "../../services/sortService";

describe('sortService', () => {

    it('sortPlayerByNameAsc', () => {
        let players = [
            createPlayer("Chris"),
            createPlayer("Peter B"),
            createPlayer("Willi"),
            createPlayer("Karl"),
            createPlayer("Peter"),
            createPlayer("Adam")
        ];

        players.sort(sortPlayerByNameAsc);

        expect(players[0].name).toEqual("Adam");
        expect(players[1].name).toEqual("Chris");
        expect(players[2].name).toEqual("Karl");
        expect(players[3].name).toEqual("Peter");
        expect(players[4].name).toEqual("Peter B");
        expect(players[5].name).toEqual("Willi");
    });

    it('sortDartDataByScoreDesc', () => {
        let dartData = [
            createDartData("25"),
            createDartData("18"),
            createDartData("1"),
            createDartData("13"),
            createDartData("20"),
            createDartData("3"),
            createDartData("12")
        ];

        dartData.sort(sortDartDataByScoreDesc);

        expect(dartData[0].score).toEqual("25");
        expect(dartData[1].score).toEqual("20");
        expect(dartData[2].score).toEqual("18");
        expect(dartData[3].score).toEqual("13");
        expect(dartData[4].score).toEqual("12");
        expect(dartData[5].score).toEqual("3");
        expect(dartData[6].score).toEqual("1");
    });

    it('sortGameDataByOpponentAsc', () => {
        let gameData = [
            createGameData("Adelbert"),
            createGameData("Bernd"),
            createGameData("Puh Bär"),
            createGameData("Adelbert II"),
            createGameData("Noch ein Adelbert")
        ];

        gameData.sort(sortGameDataByOpponentAsc);

        expect(gameData[0].opponent).toEqual("Adelbert");
        expect(gameData[1].opponent).toEqual("Adelbert II");
        expect(gameData[2].opponent).toEqual("Bernd");
        expect(gameData[3].opponent).toEqual("Noch ein Adelbert");
        expect(gameData[4].opponent).toEqual("Puh Bär");
    });

});

function createPlayer(name){
    return {name};
}

function createDartData(score){
    return {score};
}

function createGameData(opponent){
    return {opponent};
}