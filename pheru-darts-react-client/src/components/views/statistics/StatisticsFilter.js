import React from 'react'
import ScoreInput from "../../general/input/ScoreInput";
import {Button, Collapse} from "react-bootstrap";
import Glyphicon from "react-bootstrap/es/Glyphicon";
import CheckInModeSelection from "../../general/input/CheckInModeSelection";
import CheckOutModeSelection from "../../general/input/CheckOutModeSelection";
import DatePicker, {CalendarContainer} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import PropTypes from "prop-types";
import SortUtil from "../../../util/SortUtil";
import KeyUtil from "../../../util/KeyUtil";
import DateUtil from "../../../util/DateUtil";

const INITIAL_STATE = {
    open: false,
    players: [],
    games: [],
    scoreComparator: "",
    score: "",
    currentScoreComparator: "",
    currentScore: "",
    checkInMode: undefined,
    checkOutMode: undefined,
    startDate: undefined,
    endDate: undefined,
    startDateOpen: false,
    endDateOpen: false
};

class StatisticsFilter extends React.Component {

    constructor(props) {
        super(props);
        this.state = {...INITIAL_STATE};
        this.toggleOpen = this.toggleOpen.bind(this);

        this.handlePlayerChange = this.handlePlayerChange.bind(this);
        this.handleGamesChange = this.handleGamesChange.bind(this);

        this.handleScoreComparatorChange = this.handleScoreComparatorChange.bind(this);
        this.handleScoreChange = this.handleScoreChange.bind(this);

        this.handleCurrentScoreComparatorChange = this.handleCurrentScoreComparatorChange.bind(this);
        this.handleCurrentScoreChange = this.handleCurrentScoreChange.bind(this);

        this.handleCheckInModeChange = this.handleCheckInModeChange.bind(this);
        this.handleCheckOutModeChange = this.handleCheckOutModeChange.bind(this);

        this.toggleStartDateOpen = this.toggleStartDateOpen.bind(this);
        this.toggleEndDateOpen = this.toggleEndDateOpen.bind(this);
        this.handleStartDateChange = this.handleStartDateChange.bind(this);
        this.handleEndDateChange = this.handleEndDateChange.bind(this);

        this.applyFilter = this.applyFilter.bind(this);
        this.resetFilter = this.resetFilter.bind(this);

        this.closeDates = this.closeDates.bind(this);

        this.hideDatePortalsKeyListener = KeyUtil.ifEscKey(this.closeDates);
    }

    componentDidMount() {
        document.addEventListener('keydown', this.hideDatePortalsKeyListener);
    }

    componentDidUpdate(prevProps) {
        // Vorbelegung für Comparators
        if (prevProps.options.comparativeOperators !== this.props.options.comparativeOperators
            && this.props.options.comparativeOperators.length > 0) {
            this.setState({
                currentScoreComparator: this.state.currentScoreComparator === INITIAL_STATE.currentScoreComparator
                    ? {
                        value: this.props.options.comparativeOperators[0],
                        label: this.props.options.comparativeOperators[0]
                    }
                    : INITIAL_STATE.currentScoreComparator,
                scoreComparator: this.state.scoreComparator === INITIAL_STATE.scoreComparator
                    ? {
                        value: this.props.options.comparativeOperators[0],
                        label: this.props.options.comparativeOperators[0]
                    }
                    : INITIAL_STATE.scoreComparator
            });
        }
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.hideDatePortalsKeyListener);
    }

    handlePlayerChange(value) {
        this.setState({players: value});
    }

    handleGamesChange(value) {
        this.setState({games: value});
    }

    handleScoreComparatorChange(value) {
        this.setState({scoreComparator: value});
    }

    handleScoreChange(value) {
        this.setState({score: value});
    }

    handleCurrentScoreComparatorChange(value) {
        this.setState({currentScoreComparator: value});
    }

    handleCurrentScoreChange(value) {
        this.setState({currentScore: value});
    }

    toggleOpen() {
        this.setState({open: !this.state.open});
    }

    toggleStartDateOpen() {
        this.setState({startDateOpen: !this.state.startDateOpen});
    }

    toggleEndDateOpen() {
        this.setState({endDateOpen: !this.state.endDateOpen});
    }

    closeDates() {
        this.setState({startDateOpen: false, endDateOpen: false});
    }

    handleStartDateChange(value) {
        this.setState({
            startDate: value,
            startDateOpen: false
        });
    }

    handleEndDateChange(value) {
        this.setState({
            endDate: value,
            endDateOpen: false
        });
    }

    handleCheckInModeChange(e) {
        this.setState({
            checkInMode: e
        });
    }

    handleCheckOutModeChange(e) {
        this.setState({
            checkOutMode: e
        });
    }

    applyFilter(e) {
        let filter = {};
        if (this.state.players.length > 0) {
            filter.userIds = [];
            for (let i = 0; i < this.state.players.length; i++) {
                for (let j = 0; j < this.state.players[i].value.length; j++) {
                    filter.userIds.push(this.state.players[i].value[j]);
                }
            }
        }
        if (this.state.games.length > 0) {
            filter.gameIds = [];
            for (let i = 0; i < this.state.games.length; i++) {
                filter.gameIds.push(this.state.games[i].value);
            }
        }
        if (this.state.checkInMode) {
            filter.checkInMode = this.state.checkInMode;
        }
        if (this.state.checkOutMode) {
            filter.checkOutMode = this.state.checkOutMode;
        }
        if (this.state.scoreComparator.value !== ""
            && this.state.score !== "") {
            filter.startScore = this.state.score;
            filter.startScoreComparativeOperator = this.state.scoreComparator.value;
        }
        if (this.state.currentScoreComparator.value !== ""
            && this.state.currentScore !== "") {
            filter.currentScore = this.state.currentScore;
            filter.currentScoreComparativeOperator = this.state.currentScoreComparator.value;
        }
        if (this.state.startDate) {
            filter.startDate = this.state.startDate.getTime();
        }
        if (this.state.endDate) {
            filter.endDate = this.state.endDate.getTime();
        }
        this.props.fetchStatistics(filter);
        this.toggleOpen();
    }

    resetFilter(e) {
        let comparatorResetValue = this.props.options.comparativeOperators.length > 0
            ? {value: this.props.options.comparativeOperators[0], label: this.props.options.comparativeOperators[0]}
            : INITIAL_STATE.scoreComparator;
        this.setState({
            ...INITIAL_STATE,
            currentScoreComparator: comparatorResetValue,
            scoreComparator: comparatorResetValue,
            open: true
        });
    }

    customSelectStyles(height, width, zIndex) {
        return {
            control: base => ({
                ...base,
                height: height,
                minHeight: height,
                minWidth: width,
                maxWidth: width
            }),
            container: (base) => ({...base, zIndex: zIndex})
        };
    }

    render() {
        let usernameToUserIds = [];
        for (let username in this.props.options.usernameToUserIds) {
            if (this.props.options.usernameToUserIds.hasOwnProperty(username)) {
                usernameToUserIds.push({label: username, value: this.props.options.usernameToUserIds[username]});
            }
        }
        usernameToUserIds.sort(SortUtil.sortByLabelAsc);

        let sortedGames = this.props.options.games.slice().sort(SortUtil.sortByTimestampDesc);
        let playedGames = [];
        for (let i = 0; i < sortedGames.length; i++) {
            let gameText = sortedGames[i].opponents.length > 0
                ? " vs. " + sortedGames[i].opponents.join() : " Training";
            let gameNumber = sortedGames.length - i;
            let gameDate = DateUtil.toDate(new Date(sortedGames[i].timestamp),
                {replaceToday: true, replaceYesterday: true});
            let gameTime = DateUtil.toTime(new Date(sortedGames[i].timestamp));
            playedGames.push({
                label: gameText + " (" + gameDate + " " + gameTime + ") [#" + gameNumber + "]",
                value: sortedGames[i].id
            });
        }

        let comparativeOperators = this.props.options.comparativeOperators.map(op => {
            return {value: op, label: op}
        });

        let calendarContainer = ({className, children}) =>
            <CalendarContainer className={className}>
                <Button onClick={this.closeDates}
                        style={{
                            position: "absolute",
                            top: -17,
                            right: -20,
                            borderRadius: "100%",
                            zIndex: 5
                        }}>
                    <Glyphicon glyph="remove"/>
                </Button>
                {children}
            </CalendarContainer>;
        return <div style={{...this.props.style}}>
            <Button bsStyle="primary" style={{marginBottom: 5}} onClick={this.toggleOpen}>
                <Glyphicon glyph="filter"/> Filter {this.state.open ? " verbergen" : " anzeigen"}
            </Button>
            <Collapse in={this.state.open}>
                <div style={{
                    backgroundColor: "#337ab71c", borderRadius: 3,
                    borderLeft: "3px solid #337ab7", borderRight: "3px solid #337ab7"
                }}>
                    <FilterRow>
                        <div style={{marginLeft: 3, marginRight: 3, marginBottom: 5, flexBasis: "48%", minWidth: 250}}>
                            <p style={{margin: 0}}>Spieler</p>
                            <Select placeholder=""
                                    className="select-container"
                                    classNamePrefix="select"
                                    value={this.state.players}
                                    onChange={this.handlePlayerChange}
                                    styles={this.customSelectStyles(undefined, undefined, 550)}
                                    blurInputOnSelect={false}
                                    closeMenuOnSelect={false}
                                    options={usernameToUserIds}
                                    isMulti/>
                        </div>
                        <div style={{marginLeft: 3, marginRight: 3, marginBottom: 5, flexBasis: "48%", minWidth: 250}}>
                            <p style={{margin: 0}}>Gespielte Spiele</p>
                            <Select placeholder=""
                                    className="select-container"
                                    classNamePrefix="select"
                                    value={this.state.games}
                                    onChange={this.handleGamesChange}
                                    styles={this.customSelectStyles(undefined, undefined, 540)}
                                    blurInputOnSelect={false}
                                    closeMenuOnSelect={false}
                                    options={playedGames}
                                    isMulti/>
                        </div>
                    </FilterRow>
                    <FilterRow>
                        <div style={{marginRight: 5, marginBottom: 5}}>
                            <p style={{margin: 0}}>Score</p>
                            <div style={{display: "flex"}}>
                                <div style={{width: 75}}>
                                    <Select value={this.state.scoreComparator}
                                            className="select-container"
                                            classNamePrefix="select"
                                            onChange={this.handleScoreComparatorChange}
                                            styles={this.customSelectStyles(34, 75, 530)}
                                            placeholder=""
                                            options={comparativeOperators}/>
                                </div>
                                <ScoreInput id="filter_scoreinput" value={this.state.score}
                                            onChange={this.handleScoreChange}/>
                            </div>
                        </div>
                        <div style={{marginBottom: 5}}>
                            <p style={{margin: 0}}>Aktueller Score</p>
                            <div style={{display: "flex"}}>
                                <Select value={this.state.currentScoreComparator}
                                        className="select-container"
                                        classNamePrefix="select"
                                        onChange={this.handleCurrentScoreComparatorChange}
                                        styles={this.customSelectStyles(34, 75, 520)}
                                        placeholder=""
                                        options={comparativeOperators}/>
                                <ScoreInput id="filter_currentscoreinput" value={this.state.currentScore}
                                            onChange={this.handleCurrentScoreChange}/>
                            </div>
                        </div>
                    </FilterRow>
                    <FilterRow>
                        <div style={{marginRight: 5, marginBottom: 5}}>
                            <p style={{margin: 0}}>Check-In</p>
                            <CheckInModeSelection value={this.state.checkInMode}
                                                  onChange={this.handleCheckInModeChange}
                                                  borderRightZero/>
                            <Button style={{borderTopLeftRadius: 0, borderBottomLeftRadius: 0, marginLeft: -1}}
                                    onClick={() => this.handleCheckInModeChange(null)}>
                                <Glyphicon glyph="remove"/>
                            </Button>
                        </div>
                        <div style={{marginBottom: 5}}>
                            <p style={{margin: 0}}>Check-Out</p>
                            <CheckOutModeSelection value={this.state.checkOutMode}
                                                   onChange={this.handleCheckOutModeChange}
                                                   borderRightZero/>
                            <Button style={{borderTopLeftRadius: 0, borderBottomLeftRadius: 0, marginLeft: -1}}
                                    onClick={() => this.handleCheckOutModeChange(null)}>
                                <Glyphicon glyph="remove"/>
                            </Button>
                        </div>
                    </FilterRow>
                    <FilterRow>
                        <div style={{marginRight: 5, marginBottom: 5}}>
                            <p style={{margin: 0}}>Von</p>
                            <div style={{display: "flex"}}>
                                <DatePicker
                                    isClearable
                                    disabledKeyboardNavigation
                                    dateFormat="dd.MM.yyyy"
                                    className="form-control datepicker-input-for-toggle"
                                    selected={this.state.startDate}
                                    onChange={this.handleStartDateChange}
                                    popperClassName="datepicker-hidden-popper"
                                />
                                <Button style={{
                                    borderTopLeftRadius: 0,
                                    borderBottomLeftRadius: 0,
                                    borderLeftWidth: 0
                                }}
                                        onClick={this.toggleStartDateOpen}>
                                    <Glyphicon glyph="calendar"/>
                                </Button>
                            </div>
                            {this.state.startDateOpen &&
                            <DatePicker inline withPortal
                                        selected={this.state.startDate}
                                        selectsStart
                                        startDate={this.state.startDate}
                                        endDate={this.state.endDate}
                                        maxDate={new Date()}
                                        onChange={this.handleStartDateChange}
                                        showYearDropdown
                                        scrollableYearDropdown
                                        calendarContainer={calendarContainer}
                                        todayButton="Heute"/>
                            }
                        </div>
                        <div style={{marginBottom: 5}}>
                            <p style={{margin: 0}}>Bis</p>
                            <div style={{display: "flex"}}>
                                <DatePicker
                                    isClearable
                                    disabledKeyboardNavigation
                                    dateFormat="dd.MM.yyyy"
                                    className="form-control datepicker-input-for-toggle"
                                    selected={this.state.endDate}
                                    onChange={this.handleEndDateChange}
                                    popperClassName="datepicker-hidden-popper"
                                />
                                <Button style={{
                                    borderTopLeftRadius: 0,
                                    borderBottomLeftRadius: 0,
                                    borderLeftWidth: 0
                                }}
                                        onClick={this.toggleEndDateOpen}>
                                    <Glyphicon glyph="calendar"/>
                                </Button>
                            </div>
                            {this.state.endDateOpen &&
                            <DatePicker inline withPortal
                                        selected={this.state.endDate}
                                        selectsEnd
                                        startDate={this.state.startDate}
                                        endDate={this.state.endDate}
                                        maxDate={new Date()}
                                        onChange={this.handleEndDateChange}
                                        showYearDropdown
                                        scrollableYearDropdown
                                        calendarContainer={calendarContainer}
                                        todayButton="Heute"/>
                            }
                        </div>
                    </FilterRow>
                    <FilterRow style={{justifyContent: "center"}}>
                        <Button bsStyle="success" style={{marginRight: 5, marginBottom: 5}}
                                onClick={this.applyFilter}>
                            <Glyphicon glyph="ok"/> Filter anwenden
                        </Button>
                        <Button bsStyle="danger" style={{marginRight: 5, marginBottom: 5}}
                                onClick={this.resetFilter}>
                            <Glyphicon glyph="remove"/> Filter zurücksetzen
                        </Button>
                    </FilterRow>
                </div>
            </Collapse>
        </div>
    }
}

class FilterRow extends React.Component {

    render() {
        return <div style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-around",
            textAlign: "center",
            ...this.props.style
        }}>
            {this.props.children}
        </div>
    }
}

StatisticsFilter.propTypes = {
    fetchStatistics: PropTypes.func.isRequired,
    options: PropTypes.object.isRequired
};

export default StatisticsFilter;