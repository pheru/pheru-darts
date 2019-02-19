import React from 'react'
import {Button, Glyphicon} from "react-bootstrap";

class FullscreenButton extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            fullscreen: false
        };
        this.toggleFullscreen = this.toggleFullscreen.bind(this);
        this.updateFullscreen = this.updateFullscreen.bind(this);
    }

    componentDidMount() {
        this.updateFullscreen();
        document.addEventListener("fullscreenchange", this.updateFullscreen);
        document.addEventListener("webkitfullscreenchange", this.updateFullscreen);
        document.addEventListener("msfullscreenchange", this.updateFullscreen);
    }

    componentWillUnmount() {
        document.removeEventListener("fullscreenchange", this.updateFullscreen);
        document.removeEventListener("webkitfullscreenchange", this.updateFullscreen);
        document.removeEventListener("msfullscreenchange", this.updateFullscreen);
    }

    updateFullscreen(e) {
        this.setState({fullscreen: this.isFullscreen()});
    }

    toggleFullscreen() {
        let docElm = document.documentElement;
        if (!this.isFullscreen()) {
            if (docElm.requestFullscreen) {
                docElm.requestFullscreen();
            } else if (docElm.mozRequestFullScreen) {
                docElm.mozRequestFullScreen();
            } else if (docElm.webkitRequestFullScreen) {
                docElm.webkitRequestFullScreen();
            } else if (docElm.msRequestFullscreen) {
                docElm.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    }

    isFullscreen() {
        return (document.fullscreenElement && document.fullscreenElement !== null) ||
            (document.webkitFullscreenElement && document.webkitFullscreenElement !== null) ||
            (document.mozFullScreenElement && document.mozFullScreenElement !== null) ||
            (document.msFullscreenElement && document.msFullscreenElement !== null);
    }

    render() {
        return <Button bsStyle={this.props.bsStyle} onClick={this.toggleFullscreen} className={this.props.className} style={{...this.props.style}}>
            {this.state.fullscreen
                ? <Glyphicon style={{...this.props.glyphiconStyle}} className={this.props.className ? this.props.className + "-icon" : ""} glyph="resize-small"/>
                : <Glyphicon style={{...this.props.glyphiconStyle}} className={this.props.className ? this.props.className + "-icon" : ""} glyph="resize-full"/>
            }
        </Button>
    }
}

FullscreenButton.propTypes = {};

export default FullscreenButton
