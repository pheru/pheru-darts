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
import SortUtil from "../../../util/SortUtil";

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
        sortedData.sort(SortUtil.sortDartDataByScoreBoardOrder);
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
        let windowWidth = (window.innerWidth > 0) ? window.innerWidth : window.screen.width;
        let windowHeight = (window.innerHeight > 0) ? window.innerHeight : window.screen.height;
        return <ResponsiveContainer width="100%" height={windowWidth > windowHeight ? 500 : windowWidth}>
            <RadarChart cx="50%" cy="50%" outerRadius="90%" data={this.state.data}>
                <PolarGrid/>
                <PolarAngleAxis dataKey="score"/>
                <PolarRadiusAxis angle={90} scale="sqrt"/>
                <Radar isAnimationActive={false} name="Single" dataKey="singleCount" stroke="#222222" fill="#222222" fillOpacity={0.6}/>
                <Radar isAnimationActive={false} name="Double" dataKey="doubleCount" stroke="#08965f" fill="#08965f" fillOpacity={0.6}/>
                <Radar isAnimationActive={false} name="Triple" dataKey="tripleCount" stroke="#e01d36" fill="#e01d36" fillOpacity={0.6}/>
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