import React from 'react'
import {Alert, Glyphicon, Table, ToggleButton, ToggleButtonGroup, Well} from "react-bootstrap";
import GamesBarChart from "./GamesBarChart";
import DartsBarChart from "./DartsBarChart";
import PropTypes from "prop-types";
import StackLoader from "../../general/loaders/StackLoader";
import DartsRadarChart from "./DartsRadarChart";
import OnlyForLoggedInUsersContainer from "../../../containers/general/OnlyForLoggedInUsersContainer";
import DocumentUtil from "../../../util/DocumentUtil";
import StatisticsFilter from "./StatisticsFilter";
import AufnahmeProgressAreaChart from "./AufnahmeProgressAreaChart";
import {NAVIGATION_ITEM} from "../../../constants/navigationItems";

const DART_CHART_TYPE_BAR = "bar";
const DART_CHART_TYPE_RADAR = "radar";

class Statistics extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dartChartType: DART_CHART_TYPE_BAR,
            fixedYAxisAufnahmeChart: false
        };
        this.dartsBarChartRef = React.createRef();
        this.dartsRadarChartRef = React.createRef();
        this.handleDartChartTypeChange = this.handleDartChartTypeChange.bind(this);
        this.toggleFixedYAxisAufnahmeChartChange = this.toggleFixedYAxisAufnahmeChartChange.bind(this);
    }

    componentDidMount() {
        DocumentUtil.setTitlePrefix(NAVIGATION_ITEM.STATISTICS.text);
        if (this.props.isLoggedIn) {
            this.props.fetchStatisticsFilterOptions();
            this.props.fetchStatistics();
        }
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.isLoggedIn && this.props.isLoggedIn) {
            this.props.fetchStatisticsFilterOptions();
            this.props.fetchStatistics();
        }
    }

    handleDartChartTypeChange(e) {
        this.setState({dartChartType: e},
            () => {
                // Ohne Timeout funktioniert das smooth-scrollen nicht,
                // liegt wahrscheinlich an der Chart-Komponente
                setTimeout(() => {
                    let scrollRef = this.getRefForDartChartType(e);
                    if (scrollRef && scrollRef.current) {
                        scrollRef.current.scrollIntoView({block: "end", behavior: "smooth"});
                    }
                }, 50);
            }
        );

    }

    getRefForDartChartType(type) {
        switch (type) {
            case DART_CHART_TYPE_BAR:
                return this.dartsBarChartRef;
            case DART_CHART_TYPE_RADAR:
                return this.dartsRadarChartRef;
            default:
                return null;
        }
    }

    toggleFixedYAxisAufnahmeChartChange() {
        this.setState({fixedYAxisAufnahmeChart: !this.state.fixedYAxisAufnahmeChart});
    }

    render() {
        return <OnlyForLoggedInUsersContainer
            text="Statistiken können nur für angemeldete Benutzer erstellt und eingesehen werden">
            <div className="statistics">
                <div style={{textAlign: 'center'}}>
                    <h1 style={{marginTop: 0}}><strong>{NAVIGATION_ITEM.STATISTICS.text}</strong></h1>
                    <StatisticsFilter style={{marginBottom: 5}}
                                      fetchStatistics={this.props.fetchStatistics}
                                      options={this.props.options}
                    />
                </div>
                {this.props.isFetchingStatistics ?
                    <StackLoader modal label="Lade Statistiken..."/>
                    : <div>
                        {this.props.dartData.length > 0
                            ? this.createDartsView()
                            : <Alert bsStyle="warning">
                                <strong>Keine Dart-Daten vorhanden</strong>
                            </Alert>}
                        {Object.keys(this.props.highestAufnahmen).length > 0
                            ? this.createAufnahmenView()
                            : <Alert bsStyle="warning">
                                <strong>Keine Aufnahmen-Daten vorhanden</strong>
                            </Alert>}
                        {this.props.gamesData.length > 0
                            ? this.createGamesView()
                            : <Alert bsStyle="warning">
                                <strong>Keine Spiel-Daten vorhanden</strong>
                            </Alert>}
                    </div>
                }
            </div>
        </OnlyForLoggedInUsersContainer>
    }

    createDartsView() {
        return <Well style={{
            paddingBottom: 0,
            marginBottom: 15,
            textAlign: 'center'
        }}>
            <h2 style={{marginTop: 0}}><strong>Darts</strong></h2>
            <Table className="statistics-table" responsive>
                <tbody>
                <tr>
                    <th>Gesamt:</th>
                    <td colSpan={3}>{this.props.totalDarts}</td>
                </tr>
                <tr>
                    <th rowSpan={2}>Checkouts:</th>
                    <th>Mögliche Checkouts</th>
                    <th>Erfolgreiche Checkouts</th>
                    <th>Checkoutrate</th>
                </tr>
                <tr>
                    <td>{this.props.possibleCheckoutDarts}</td>
                    <td>{this.props.checkoutDarts}</td>
                    <td>{this.getDartCheckoutRate()}</td>
                </tr>
                </tbody>
            </Table>
            <ToggleButtonGroup type="radio" name="options" value={this.state.dartChartType}
                               onChange={this.handleDartChartTypeChange}
                               style={{marginBottom: 10}}>
                <ToggleButton value={DART_CHART_TYPE_BAR} style={{width: 100}}>
                    <Glyphicon glyph="stats"/>
                </ToggleButton>
                <ToggleButton value={DART_CHART_TYPE_RADAR} style={{width: 100}}>
                    <Glyphicon glyph="certificate"/>
                </ToggleButton>
            </ToggleButtonGroup>
            {this.state.dartChartType === DART_CHART_TYPE_BAR &&
            <div ref={this.dartsBarChartRef}>
                <DartsBarChart data={this.props.dartData}/>
            </div>
            }
            {this.state.dartChartType === DART_CHART_TYPE_RADAR &&
            <div ref={this.dartsRadarChartRef}>
                <DartsRadarChart data={this.props.dartData}/>
            </div>
            }
        </Well>
    }

    createAufnahmenView() {
        let ths = [];
        let tds = [];
        for (let property in this.props.highestAufnahmen) {
            if (this.props.highestAufnahmen.hasOwnProperty(property)) {
                ths.unshift(<th key={"aufnahme_th_" + property}>{property}</th>);
                tds.unshift(<td key={"aufnahme_td_" + property}>{this.props.highestAufnahmen[property]}</td>);
            }
        }
        return <Well style={{
            paddingBottom: 0,
            marginBottom: 15,
            textAlign: 'center'
        }}>
            <h2 style={{marginTop: 0}}><strong>Aufnahmen</strong></h2>
            <Table className="statistics-table" responsive>
                <tbody>
                <tr>
                    <th>Durchschnitt:</th>
                    <td colSpan={ths.length}>{this.props.averageAufnahmeScore.toFixed(2)}</td>
                </tr>
                <tr>
                    <th rowSpan={2}>Höchste Aufnahmen (Top {ths.length}):</th>
                    {ths}
                </tr>
                <tr>
                    {tds}
                </tr>
                </tbody>
            </Table>
            <AufnahmeProgressAreaChart data={this.props.progressData}
                                       fixedYAxis={this.state.fixedYAxisAufnahmeChart}
                                       onClick={this.toggleFixedYAxisAufnahmeChartChange}/>
        </Well>
    }

    createGamesView() {
        return <Well
            style={{
                paddingBottom: 0,
                marginBottom: 15,
                textAlign: 'center'
            }}>
            <h2 style={{marginTop: 0}}><strong>Spiele</strong></h2>
            <Table className="statistics-table" responsive>
                <tbody>
                <tr>
                    <th>Gesamt</th>
                    <th>Gewonnen</th>
                    <th>Verloren</th>
                    <th>Siegrate</th>
                </tr>
                <tr>
                    <td>{this.props.gamesWon + this.props.gamesLost}</td>
                    <td>{this.props.gamesWon}</td>
                    <td>{this.props.gamesLost}</td>
                    <td>{this.getWinRate()}</td>
                </tr>
                </tbody>
            </Table>
            <GamesBarChart data={this.props.gamesData}/>
        </Well>
    }

    getWinRate() {
        return this.getRate(this.props.gamesWon, this.props.gamesWon + this.props.gamesLost);
    }

    getDartCheckoutRate() {
        return this.getRate(this.props.checkoutDarts, this.props.possibleCheckoutDarts);
    }

    getRate(value, possible) {
        let rate = (value / possible * 100).toFixed(2);
        return isNaN(rate) ? "-" : rate + "%";
    }

}

Statistics.propTypes = {
    isFetchingStatistics: PropTypes.bool.isRequired,
    gamesWon: PropTypes.number.isRequired,
    gamesLost: PropTypes.number.isRequired,
    totalDarts: PropTypes.number.isRequired,
    averageAufnahmeScore: PropTypes.number.isRequired,
    highestAufnahmen: PropTypes.object.isRequired,

    dartData: PropTypes.array,
    gamesData: PropTypes.array,

    options: PropTypes.object.isRequired,

    showLogin: PropTypes.func.isRequired,
    fetchStatistics: PropTypes.func.isRequired,
    fetchStatisticsFilterOptions: PropTypes.func.isRequired
};

export default Statistics;