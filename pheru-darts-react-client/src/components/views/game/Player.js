import React from 'react'
import PropTypes from "prop-types";
import WindowUtil from "../../../util/WindowUtil";

const DEFAULT_STYLE = {
    textAlign: "center",
    fontWeight: "bold",
    margin: 0,
    padding: 0,
};
const BLACK_BORDER = '1px solid black';
const BORDER_RADIUS = 6;

class Player extends React.Component {

    render() {
        let landscapeOrientation = WindowUtil.isLandscapeOrientation();
        let fontSizeDart = landscapeOrientation ? "6vh" : "3vh";
        let fontSizeName = landscapeOrientation ? "6vh" : "3vh";
        let fontSizeScore = landscapeOrientation ? "9vh" : "5vh";
        let fontSizeDartCount = landscapeOrientation ? "5vh" : "3vh";
        let fontSizeAverage = landscapeOrientation ? "5vh" : "3vh";
        return <div style={{...DEFAULT_STYLE, borderRadius: BORDER_RADIUS, ...this.props.style}}
                    className={"player" + (this.props.current ? " player-current" : "")}>
            <div style={{
                ...DEFAULT_STYLE,
                height: "66.666%", display: "flex",
                borderTopLeftRadius: BORDER_RADIUS, borderTopRightRadius: BORDER_RADIUS,
            }}>
                <div style={{...DEFAULT_STYLE, width: "66.666%"}}>
                    <div className="center-content"
                         style={{...DEFAULT_STYLE, height: "35%", borderRight: BLACK_BORDER, fontSize: fontSizeName}}>
                        {this.props.name}
                    </div>
                    <div className="center-content"
                         style={{
                             ...DEFAULT_STYLE,
                             height: "65%",
                             borderRight: BLACK_BORDER,
                             fontSize: fontSizeScore
                         }}>
                        {this.props.score}
                    </div>
                </div>
                <div style={{...DEFAULT_STYLE, width: "33.333%"}}>
                    <div className="center-content" style={{
                        ...DEFAULT_STYLE,
                        height: "50%", fontSize: fontSizeDartCount,
                        borderBottom: BLACK_BORDER
                    }}>
                        # {this.props.dartCount}
                    </div>
                    <div className="center-content"
                         style={{...DEFAULT_STYLE, height: "50%", fontSize: fontSizeAverage}}>
                        &empty; {this.props.average}
                    </div>
                </div>
            </div>
            <div style={{height: "33.333%", ...DEFAULT_STYLE, display: "flex"}}>
                <div className="center-content" style={{
                    ...DEFAULT_STYLE,
                    width: "33.333%", fontSize: fontSizeDart,
                    borderBottomLeftRadius: BORDER_RADIUS, borderTop: BLACK_BORDER
                }}>
                    {this.props.dart1}
                </div>
                <div className="center-content" style={{
                    ...DEFAULT_STYLE,
                    width: "33.333%", fontSize: fontSizeDart,
                    borderRight: BLACK_BORDER, borderLeft: BLACK_BORDER, borderTop: BLACK_BORDER
                }}>
                    {this.props.dart2}
                </div>
                <div className="center-content" style={{
                    ...DEFAULT_STYLE,
                    width: "33.333%", fontSize: fontSizeDart,
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
