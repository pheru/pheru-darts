import React from 'react'
import {Route, Switch} from "react-router-dom";
import NewGameConfigContainer from "../../containers/views/newgame/NewGameConfigContainer";
import GameContainer from "../../containers/views/game/GameContainer";
import {NAVIGATION_ITEM} from "../../constants/navigationItems";
import {LocalStorageUtil} from "../../util/StorageUtil";
import StatisticsContainer from "../../containers/views/statistics/StatisticsContainer";
import SettingsContainer from "../../containers/views/settings/SettingsContainer";
import LoginModalContainer from "../../containers/modals/LoginModalContainer";
import SignUpModalContainer from "../../containers/modals/SignUpModalContainer";
import PropTypes from 'prop-types';
import SimpleModalContainer from "../../containers/modals/SimpleModalContainer";
import MainContainer from "../../containers/views/main/MainContainer";
import NotificationsContainer from "../../containers/views/notifications/NotificationsContainer";
import AppNavigationBarContainer from "../../containers/app/AppNavigationBarContainer";
import WindowUtil from "../../util/WindowUtil";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import de from "date-fns/locale/de";
import About from "../views/about/About";

class App extends React.Component {

    constructor(props) {
        super(props);
        this.appContainerRef = React.createRef();

        this.updateOrientation = this.updateOrientation.bind(this);
        this.onBeforeUnload = this.onBeforeUnload.bind(this);
        this.onUnload = this.onUnload.bind(this);
    }

    componentDidMount() {
        registerLocale("de", de);
        setDefaultLocale("de");

        console.log(`Client Version: ${process.env.REACT_APP_VERSION}`);
        this.props.fetchServerVersion();

        this.updateOrientation();
        window.addEventListener("resize", this.updateOrientation);

        window.onunload = this.onUnload;
        window.onbeforeunload = this.onBeforeUnload;

        this.props.setPossibleVoices(window.speechSynthesis.getVoices());
        this.props.setSelectedVoiceByName(LocalStorageUtil.getSelectedVoiceName());
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = () => {
                this.props.setPossibleVoices(window.speechSynthesis.getVoices());
                if (this.props.selectedVoice === undefined) {
                    this.props.setSelectedVoiceByName(LocalStorageUtil.getSelectedVoiceName());
                }
            };
        }

        this.props.loginByToken(false);
    }

    onUnload(e) {
        if (this.props.selectedVoice) {
            LocalStorageUtil.setSelectedVoiceName(this.props.selectedVoice.name);
        }
    }

    onBeforeUnload(e) {
        if (this.props.gameRunning) {
            let dialogText = 'Seite wirklich verlassen?';
            e.returnValue = dialogText;
            return dialogText;
        } else {
            return undefined;
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.location !== prevProps.location) {
            this.appContainerRef.current.scrollTo(0, 0);
        }
        if (this.props.serverVersion !== prevProps.serverVersion) {
            console.log("Server Version: " + this.props.serverVersion);
        }
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateOrientation);
    }

    updateOrientation() {
        let landscapeOrientation = WindowUtil.isLandscapeOrientation();
        if (this.props.landscapeOrientation !== landscapeOrientation) {
            this.props.setLandscapeOrientation(landscapeOrientation);
        }
    }

    render() {
        return <div style={{height: "100%"}}>
            {this.props.navigationBarVisible &&
            <AppNavigationBarContainer/>
            }
            <div ref={this.appContainerRef}
                 style={{
                     position: "absolute",
                     top: 0,
                     left: 0,
                     right: 0,
                     bottom: 0,
                     padding: 5,
                     marginTop: this.props.navigationBarVisible ? 40 : 0,
                     overflowY: "auto"
                 }}>
                <Switch>
                    <Route path={NAVIGATION_ITEM.NEW_GAME.route} render={(props) =>
                        <NewGameConfigContainer {...props} key="newgameconfig"/>}
                    />
                    <Route path={NAVIGATION_ITEM.NEW_TRAINING.route} render={(props) =>
                        <NewGameConfigContainer {...props} key="newgameconfig_training" training/>}
                    />
                    {this.props.gameRunning &&
                    <Route path={NAVIGATION_ITEM.GAME.route} component={GameContainer}/>
                    }
                    <Route path={NAVIGATION_ITEM.NOTIFICATIONS.route} component={NotificationsContainer}/>
                    <Route path={NAVIGATION_ITEM.STATISTICS.route} component={StatisticsContainer}/>
                    <Route path={NAVIGATION_ITEM.SETTINGS.route} component={SettingsContainer}/>
                    <Route path={NAVIGATION_ITEM.ABOUT.route} component={About}/>
                    {/*no-match-route*/}
                    <Route component={MainContainer}/>
                </Switch>
            </div>
            <LoginModalContainer/>
            <SignUpModalContainer/>
            <SimpleModalContainer/>
        </div>
    }
}

App.propTypes = {
    serverVersion: PropTypes.string,
    landscapeOrientation: PropTypes.bool.isRequired,
    userName: PropTypes.string,

    navigationBarVisible: PropTypes.bool.isRequired,

    gameRunning: PropTypes.bool.isRequired,

    fetchPlayableUsers: PropTypes.func.isRequired,
    fetchPlayableUsersFailed: PropTypes.bool.isRequired,

    fetchPermittedUsers: PropTypes.func.isRequired,
    fetchPermittedUsersFailed: PropTypes.bool.isRequired,

    showLogin: PropTypes.func.isRequired,
    loginByToken: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,

    showConfirmation: PropTypes.func.isRequired,
    exitGame: PropTypes.func.isRequired,

    unreadNotificationsCount: PropTypes.number.isRequired,

    selectedVoice: PropTypes.object,
    setLandscapeOrientation: PropTypes.func.isRequired,
};

export default App;