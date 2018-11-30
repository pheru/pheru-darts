import React from 'react'
import {
    Legend,
    PolarAngleAxis,
    PolarGrid,
    PolarRadiusAxis,
    Radar,
    RadarChart,
    ResponsiveContainer,
    Tooltip
} from "recharts";
import PropTypes from "prop-types";
import {sortDartDataByScoreBoardOrder} from "../../../services/sortService";

class DartsRadarChart extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: this.sortAndFillData(props.data)
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.data !== this.props.data) {
            this.setState({
                data: this.sortAndFillData(this.props.data)
            });
        }
    }

    sortAndFillData(data) {
        let sortedData = [];
        for (let i = 1; i <= 20; i++) {
            let existing = this.getExisitingScore(data, i);
            if (existing !== null) {
                sortedData.push(existing);
            } else {
                sortedData.push({
                    score: "" + i,
                    singleCount: 0,
                    doubleCount: 0,
                    tripleCount: 0
                });
            }
        }
        sortedData.sort(sortDartDataByScoreBoardOrder);
        return sortedData;
    }

    getExisitingScore(data, score) {
        for (let i = 0; i < data.length; i++) {
            if (parseInt(data[i].score, 10) === score) {
                return data[i];
            }
        }
        return null;
    }

    render() {
        return <ResponsiveContainer width="100%" height={500}>
            <RadarChart cx="50%" cy="50%" outerRadius="90%" data={this.state.data}>
                <PolarGrid/>
                <PolarAngleAxis dataKey="score"/>
                <PolarRadiusAxis angle={90} scale="sqrt"/>
                <Radar name="Single" dataKey="singleCount" stroke="#222222" fill="#222222" fillOpacity={0.6}/>
                <Radar name="Double" dataKey="doubleCount" stroke="#08965f" fill="#08965f" fillOpacity={0.6}/>
                <Radar name="Triple" dataKey="tripleCount" stroke="#e01d36" fill="#e01d36" fillOpacity={0.6}/>
                <Legend/>
                <Tooltip labelFormatter={() => ""}/>
            </RadarChart>
        </ResponsiveContainer>
    }
}

DartsRadarChart.propTypes = {
    data: PropTypes.array.isRequired
};

export default DartsRadarChart;
