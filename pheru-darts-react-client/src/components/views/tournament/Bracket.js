import React from 'react'

class Bracket extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: this.testData2()
        };
    }

    testData2() {
        return [
            {
                config: {legs: 3, sets: 2},
                games: [
                    {
                        gameId: "g1",
                        players: [
                            {
                                id: "p1",
                                name: "Spieler 1",
                                score: "3-3",
                                won: true
                            },
                            {
                                id: "p2",
                                name: "Spieler 2",
                                score: "2-1",
                                won: false
                            }
                        ]
                    },
                    {
                        gameId: "g2",
                        players: [
                            {
                                id: "p3",
                                name: "Spieler 3",
                                score: "0-3-2",
                                won: false
                            },
                            {
                                id: "p4",
                                name: "Spieler 4",
                                score: "3-1-3",
                                won: true
                            }
                        ]
                    }
                ]
            },
            {
                config: {legs: 5, sets: 3},
                games: [
                    {
                        gameId: "g3",
                        players: [
                            {
                                id: "p1",
                                name: "Spieler 1"
                            },
                            {
                                id: "p4",
                                name: "Spieler 4"
                            }
                        ]
                    }
                ]
            }
        ];
    }

    render() {
        let roundData = this.state.data;
        let roundElements = [];
        for (let i = 0; i < roundData.length; i++) {
            let matchupData = roundData[i].games;
            let matchupElements = [];
            for (let j = 0; j < matchupData.length; j++) {
                let player1 = matchupData[j].players[0];
                let p1Class = "bracket-player bracket-player-top"
                    + (player1.won === true ? " bracket-player-winner" : "")
                    + (player1.won === false ? " bracket-player-loser" : "")
                ;
                let player2 = matchupData[j].players[1];
                let p2Class = "bracket-player bracket-player-bottom"
                    + (player2.won === true ? " bracket-player-winner" : "")
                    + (player2.won === false ? " bracket-player-loser" : "")
                ;
                matchupElements.push(
                    <ul className="bracket-matchup">
                        <li className={p1Class}>{player1.name}<span
                            className="bracket-score">{player1.score}</span></li>
                        <li className={p2Class}>{player2.name}<span
                            className="bracket-score">{player2.score}</span></li>
                    </ul>
                );
            }
            roundElements.push(
                <div className={"bracket-round bracket-round-" + (i + 1)}>
                    <div className="bracket-round-details">
                        {i + 1}. Runde<br/>
                        <span className="bracket-round-sub-details">
                            First to {roundData[i].config.legs} Legs<br/>
                            First to {roundData[i].config.sets} Sets
                        </span>
                    </div>
                    {matchupElements}
                </div>
            );
        }
        return <section id="bracket">
            <div className="bracket-container">
                <div className="bracket-split">
                    {roundElements}
                </div>
            </div>
        </section>
    }

}

Bracket.propTypes = {
    //TODO
};

export default Bracket
