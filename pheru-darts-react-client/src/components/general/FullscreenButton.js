import React from 'react'
import {Button} from "react-bootstrap";
import {FaCompress, FaExpand} from "react-icons/fa";

class FullscreenButton extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            fullscreen: false
        };
        this.toggleFullscreen = this.toggleFullscreen.bind(this);
        this.fullscreenchangeEventListener = this.fullscreenchangeEventListener.bind(this);
    }

    componentDidMount() {
        document.addEventListener("fullscreenchange", this.fullscreenchangeEventListener);
        document.addEventListener("webkitfullscreenchange", this.fullscreenchangeEventListener);
        document.addEventListener("msfullscreenchange", this.fullscreenchangeEventListener);
    }

    componentWillUnmount() {
        document.removeEventListener("fullscreenchange", this.fullscreenchangeEventListener);
        document.addEventListener("webkitfullscreenchange", this.fullscreenchangeEventListener);
        document.addEventListener("msfullscreenchange", this.fullscreenchangeEventListener);
    }

    fullscreenchangeEventListener(e) {
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
        return <Button onClick={this.toggleFullscreen} className={this.props.className}>
            {this.state.fullscreen
                ? <FaCompress className={this.props.className + "-icon"} glyph="resize-small"/>
                : <FaExpand className={this.props.className + "-icon"}/>
            }
        </Button>
    }
}

FullscreenButton.propTypes = {};

export default FullscreenButton
