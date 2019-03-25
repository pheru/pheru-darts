import React from 'react'
import {Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import PropTypes from 'prop-types';

class DartsBarChart extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return <ResponsiveContainer width="100%" height={300}>
            <BarChart data={this.props.data}>
                <CartesianGrid vertical={false}/>
                <XAxis dataKey="score" interval={0}/>
                <YAxis/>
                <Tooltip labelFormatter={() => ""}/>
                <Legend/>
                <Bar name="Single" dataKey="singleCount" stackId="a" fillOpacity={0.8} fill="#333"/>
                <Bar name="Double" dataKey="doubleCount" stackId="a" fillOpacity={0.8} fill="#08965f"/>
                <Bar name="Triple" dataKey="tripleCount" stackId="a" fillOpacity={0.8} fill="#e01d36"/>
            </BarChart>
        </ResponsiveContainer>
    }

    /* Vertical-Layout (achsen anpassen, (cartesian grid anpassen?))
    <BarChart data={this.props.data} layout="vertical">
                <CartesianGrid vertical={false}/>
                <XAxis type="number" />
                <YAxis interval={0} type="category" dataKey="score"/>
                <Tooltip labelFormatter={() => ""}/>
                <Legend/>
                <Bar name="Single" dataKey="singleCount" stackId="a" fill="#222222"/>
                <Bar name="Double" dataKey="doubleCount" stackId="a" fill="#08965f"/>
                <Bar name="Triple" dataKey="tripleCount" stackId="a" fill="#e01d36"/>
            </BarChart>
     */
}

DartsBarChart.propTypes = {
    data : PropTypes.array.isRequired
};

export default DartsBarChart;