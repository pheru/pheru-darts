import React from 'react'

class Bracket extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return <section id="bracket">
            <div className="bracket-container">
                <div className="bracket-split">
                    <div className="bracket-round bracket-round-one bracket-current">
                        <div className="bracket-round-details">1. Runde<br/>
                            <span className="bracket-round-sub-details">First to 1 Set<br/>First to 3 Legs</span>
                        </div>
                        <ul className="bracket-matchup">
                            <li className="bracket-player bracket-player-top">WWWWWWWWWWWWWWWWWWWW
                                <span className="bracket-score">64</span>
                            </li>
                            <li className="bracket-player bracket-player-bottom">Clemson
                                <span className="bracket-score">56</span>
                            </li>
                        </ul>
                        <ul className="bracket-matchup">
                            <li className="bracket-player bracket-player-top">North Carolina<span
                                className="bracket-score">68</span></li>
                            <li className="bracket-player bracket-player-bottom">Florida State<span
                                className="bracket-score">54</span></li>
                        </ul>
                        <ul className="bracket-matchup">
                            <li className="bracket-player bracket-player-top">NC State<span
                                className="bracket-score">74</span></li>
                            <li className="bracket-player bracket-player-bottom">Maryland<span
                                className="bracket-score">92</span></li>
                        </ul>
                        <ul className="bracket-matchup">
                            <li className="bracket-player bracket-player-top">Georgia Tech<span
                                className="bracket-score">78</span></li>
                            <li className="bracket-player bracket-player-bottom">Georgia<span
                                className="bracket-score">80</span></li>
                        </ul>
                        <ul className="bracket-matchup">
                            <li className="bracket-player bracket-player-top">Wake Forest<span
                                className="bracket-score">64</span></li>
                            <li className="bracket-player bracket-player-bottom">Clemson<span
                                className="bracket-score">56</span></li>
                        </ul>
                        <ul className="bracket-matchup">
                            <li className="bracket-player bracket-player-top">North Carolina<span
                                className="bracket-score">68</span></li>
                            <li className="bracket-player bracket-player-bottom">Florida State<span
                                className="bracket-score">54</span></li>
                        </ul>
                        <ul className="bracket-matchup">
                            <li className="bracket-player bracket-player-top">NC State<span
                                className="bracket-score">74</span></li>
                            <li className="bracket-player bracket-player-bottom">Maryland<span
                                className="bracket-score">92</span></li>
                        </ul>
                        <ul className="bracket-matchup">
                            <li className="bracket-player bracket-player-top">Georgia Tech<span
                                className="bracket-score">78</span></li>
                            <li className="bracket-player bracket-player-bottom">Georgia<span
                                className="bracket-score">80</span></li>
                        </ul>
                    </div>

                    <div className="bracket-round bracket-round-two bracket-current">
                        <div className="bracket-round-details">2. Runde<br/><span className="bracket-round-sub-details">March 18</span>
                        </div>
                        <ul className="bracket-matchup">
                            <li className="bracket-player bracket-player-top">ABC<span
                                className="bracket-score">&nbsp;</span></li>
                            <li className="bracket-player bracket-player-bottom">&nbsp;<span
                                className="bracket-score">&nbsp;</span></li>
                        </ul>
                        <ul className="bracket-matchup">
                            <li className="bracket-player bracket-player-top">&nbsp;<span
                                className="bracket-score">&nbsp;</span></li>
                            <li className="bracket-player bracket-player-bottom">&nbsp;<span
                                className="bracket-score">&nbsp;</span></li>
                        </ul>
                        <ul className="bracket-matchup">
                            <li className="bracket-player bracket-player-top">ABC<span
                                className="bracket-score">&nbsp;</span></li>
                            <li className="bracket-player bracket-player-bottom">&nbsp;<span
                                className="bracket-score">&nbsp;</span></li>
                        </ul>
                        <ul className="bracket-matchup">
                            <li className="bracket-player bracket-player-top">&nbsp;<span
                                className="bracket-score">&nbsp;</span></li>
                            <li className="bracket-player bracket-player-bottom">&nbsp;<span
                                className="bracket-score">&nbsp;</span></li>
                        </ul>
                    </div>

                    <div className="bracket-round bracket-round-three">
                        <div className="bracket-round-details">3. Runde<br/><span className="bracket-round-sub-details">March 22</span>
                        </div>
                        <ul className="bracket-matchup">
                            <li className="bracket-player bracket-player-top">Test<span
                                className="bracket-score">&nbsp;</span></li>
                            <li className="bracket-player bracket-player-bottom">&nbsp;<span
                                className="bracket-score">&nbsp;</span></li>
                        </ul>
                        <ul className="bracket-matchup">
                            <li className="bracket-player bracket-player-top">Test<span
                                className="bracket-score">&nbsp;</span></li>
                            <li className="bracket-player bracket-player-bottom">&nbsp;<span
                                className="bracket-score">&nbsp;</span></li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    }

}

Bracket.propTypes = {
    //TODO
};

export default Bracket
