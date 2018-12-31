import React from 'react'
import {Route, Switch} from "react-router-dom";
import NewGameConfigContainer from "../../containers/NewGameConfigContainer";
import GameContainer from "../../containers/GameContainer";
import {NAVIGATION_ITEM} from "../../constants/navigationItems";
import {localStorageService} from "../../services/storageService";
import StatisticsContainer from "../../containers/StatisticsContainer";
import SettingsContainer from "../../containers/SettingsContainer";
import LoginModalContainer from "../../containers/modals/LoginModalContainer";
import SignUpModalContainer from "../../containers/modals/SignUpModalContainer";
import PropTypes from 'prop-types';
import AboutContainer from "../../containers/AboutContainer";
import SimpleModalContainer from "../../containers/modals/SimpleModalContainer";
import MainContainer from "../../containers/MainContainer";
import NotificationsContainer from "../../containers/NotificationsContainer";
import NavigationBarContainer from "../../containers/NavigationBarContainer";

class App extends React.Component {

    constructor(props) {
        super(props);
        this.appContainerRef = React.createRef();
        this.onBeforeUnload = this.onBeforeUnload.bind(this);
        this.onUnload = this.onUnload.bind(this);
    }

    componentDidMount() {
        window.onunload = this.onUnload;
        window.onbeforeunload = this.onBeforeUnload;

        this.props.setPossibleVoices(window.speechSynthesis.getVoices());
        this.props.setSelectedVoiceByName(localStorageService.getSelectedVoiceName());
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = () => {
                this.props.setPossibleVoices(window.speechSynthesis.getVoices());
                if (this.props.selectedVoice === undefined) {
                    this.props.setSelectedVoiceByName(localStorageService.getSelectedVoiceName());
                }
            };
        }
        this.props.loginByToken(false);
    }

    onUnload(e) {
        if (this.props.selectedVoice) {
            localStorageService.setSelectedVoiceName(this.props.selectedVoice.name);
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
    }

    render() {
        return <div style={{height: "100%"}}>
            <NavigationBarContainer/>
            <div ref={this.appContainerRef}
                 style={{
                     position: "absolute",
                     top: 0,
                     left: 0,
                     right: 0,
                     bottom: 0,
                     paddingTop: 10,
                     marginTop: 40,
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
                    <Route path={NAVIGATION_ITEM.ABOUT.route} component={AboutContainer}/>
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
    userName: PropTypes.string,

    isLoggedIn: PropTypes.bool.isRequired,
    isLoggingIn: PropTypes.bool.isRequired,
    isLoggingOut: PropTypes.bool.isRequired,

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

    selectedVoice: PropTypes.object
};

export default App;