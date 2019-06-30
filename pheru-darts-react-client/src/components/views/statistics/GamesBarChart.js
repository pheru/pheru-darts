import React from 'react'
import {Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import PropTypes from "prop-types";

class GamesBarChart extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return <ResponsiveContainer width="100%" height={300}>
            <BarChart data={this.props.data}>
                <CartesianGrid vertical={false}/>
                <XAxis dataKey="opponent"/>
                <YAxis/>
                <Tooltip labelFormatter={() => ""}/>
                <Legend/>
                <Bar name="Gewonnen" dataKey="wonCount" stackId="a" fillOpacity={0.8} fill="#08965f"/>
                <Bar name="Verloren" dataKey="lostCount" stackId="a" fillOpacity={0.8} fill="#e01d36"/>
            </BarChart>
        </ResponsiveContainer>
    }
}

GamesBarChart.propTypes = {
    data : PropTypes.array.isRequired
};

export default GamesBarChart;