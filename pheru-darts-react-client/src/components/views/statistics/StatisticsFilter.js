import React from 'react'
import ScoreInput from "../../general/input/ScoreInput";
import Select from "../../general/input/Select";
import PropTypes from "prop-types";

class StatisticsFilter extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.props.fetchFilterOptions();
    }

    render() {
        return <div style={{display: "inline-block"}}>
            <div style={{display: "flex", alignItems: "center", flexWrap: "wrap"}}>
                <p style={{width: 120, margin: 0}}>Score</p>
                <div style={{display: "flex"}}>
                    <Select style={{width: 70}} choices={["=", ">="]}/>
                    <ScoreInput id="filter_scoreinput"/>
                </div>
            </div>
            <div style={{display: "flex", alignItems: "center", flexWrap: "wrap"}}>
                <p style={{width: 120, margin: 0}}>Aktueller Score</p>
                <div style={{display: "flex"}}>
                    <Select style={{width: 70}} choices={["=", ">="]}/>
                    <ScoreInput id="filter_currentscoreinput" noChoices/>
                </div>
            </div>
        </div>
    }

}

StatisticsFilter.propTypes = {
    fetchFilterOptions: PropTypes.func.isRequired
};

export default StatisticsFilter;