import React from 'react'
import PropTypes from "prop-types";

const DEFAULT_STYLE = {
    textAlign: "center",
    fontWeight: "bold",
    margin: 0,
    padding: 0,
};
const BLACK_BORDER = '1px solid black';
const BORDER_RADIUS = 6;
const FONT_SIZE_DART = "6vh";
const FONT_SIZE_NAME = "6vh";
const FONT_SIZE_SCORE = "9vh";
const FONT_SIZE_DART_COUNT = "5vh";
const FONT_SIZE_AVERAGE = "5vh";

class Player extends React.Component {

    render() {
        return <div style={{...DEFAULT_STYLE, borderRadius: BORDER_RADIUS, ...this.props.style}}
                    className={"player" + (this.props.current ? " player-current" : "")}>
            <div style={{
                ...DEFAULT_STYLE,
                height: "66.666%", display: "flex",
                borderTopLeftRadius: BORDER_RADIUS, borderTopRightRadius: BORDER_RADIUS,
            }}>
                <div style={{...DEFAULT_STYLE, width: "66.666%"}}>
                    <div className="center-content" style={{...DEFAULT_STYLE, height: "35%", borderRight: BLACK_BORDER, fontSize: FONT_SIZE_NAME}}>
                        {this.props.name}
                    </div>
                    <div className="center-content"
                        style={{...DEFAULT_STYLE, height: "65%", borderRight: BLACK_BORDER, fontSize: FONT_SIZE_SCORE}}>
                        {this.props.score}
                    </div>
                </div>
                <div style={{...DEFAULT_STYLE, width: "33.333%"}}>
                    <div className="center-content" style={{
                        ...DEFAULT_STYLE,
                        height: "50%", fontSize: FONT_SIZE_DART_COUNT,
                        borderBottom: BLACK_BORDER
                    }}>
                        # {this.props.dartCount}
                    </div>
                    <div className="center-content" style={{...DEFAULT_STYLE, height: "50%", fontSize: FONT_SIZE_AVERAGE}}>
                        &empty; {this.props.average}
                    </div>
                </div>
            </div>
            <div style={{height: "33.333%", ...DEFAULT_STYLE, display: "flex"}}>
                <div className="center-content" style={{
                    ...DEFAULT_STYLE,
                    width: "33.333%", fontSize: FONT_SIZE_DART,
                    borderBottomLeftRadius: BORDER_RADIUS, borderTop: BLACK_BORDER
                }}>
                    {this.props.dart1}
                </div>
                <div className="center-content" style={{
                    ...DEFAULT_STYLE,
                    width: "33.333%", fontSize: FONT_SIZE_DART,
                    borderRight: BLACK_BORDER, borderLeft: BLACK_BORDER, borderTop: BLACK_BORDER
                }}>
                    {this.props.dart2}
                </div>
                <div className="center-content" style={{
                    ...DEFAULT_STYLE,
                    width: "33.333%", fontSize: FONT_SIZE_DART,
                    borderBottomRightRadius: BORDER_RADIUS, borderTop: BLACK_BORDER
                }}>
                    {this.props.dart3}
                </div>
            </div>
        </div>;
    }
}

Player.propTypes = {
    name: PropTypes.string.isRequired,
    score: PropTypes.number.isRequired,
    dartCount: PropTypes.number.isRequired,
    average: PropTypes.string.isRequired,
    dart1: PropTypes.string.isRequired,
    dart2: PropTypes.string.isRequired,
    dart3: PropTypes.string.isRequired,
    current: PropTypes.bool.isRequired
};

export default Player
