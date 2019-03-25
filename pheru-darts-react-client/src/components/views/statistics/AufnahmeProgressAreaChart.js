import React from 'react'
import {Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import PropTypes from "prop-types";

class AufnahmeProgressAreaChart extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={this.props.data}>
                <defs>
                    <linearGradient id="colorAverageAufnahmeScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#337ab7" stopOpacity={0.85}/>
                        <stop offset="95%" stopColor="#337ab7" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorAverageAufnahmeScoreCurrentGame" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#08965f" stopOpacity={0.66}/>
                        <stop offset="95%" stopColor="#08965f" stopOpacity={0.1}/>
                    </linearGradient>
                </defs>
                <CartesianGrid/>
                <XAxis tick={false} />
                {this.props.fixedYAxis
                    ? <YAxis interval={0} ticks={[20, 40, 60, 80, 100, 120, 140, 160, 180]}/>
                    : <YAxis/>}
                <Tooltip labelFormatter={() => ""}/>
                <Legend/>
                <Area type="monotone" name="Gesamtdurchschnitt" dataKey="averageAufnahmeScore"
                      stroke="#337ab7" fillOpacity={1} fill="url(#colorAverageAufnahmeScore)"/>
                <Area type="monotone" name="Durchschnitt je Spiel" dataKey="averageAufnahmeScoreCurrentGame"
                      stroke="#08965f" fillOpacity={1} fill="url(#colorAverageAufnahmeScoreCurrentGame)"/>
            </AreaChart>
        </ResponsiveContainer>
    }
}

AufnahmeProgressAreaChart.propTypes = {
    data: PropTypes.array.isRequired,
    fixedYAxis: PropTypes.bool
};

export default AufnahmeProgressAreaChart;