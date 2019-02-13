import React from 'react'
import PropTypes from "prop-types";
import SpeechSettings from "./SpeechSettings";
import {NAVIGATION_ITEM} from "../../../constants/navigationItems";
import {Redirect, Route} from "react-router-dom";
import NavigationBar, {DropdownConfig, NavigationBarContainer} from "../../general/navigationbar/NavigationBar";
import NavigationBarItem from "../../general/navigationbar/NavigationBarItem";
import OnlyForLoggedInUsersContainer from "../../../containers/general/OnlyForLoggedInUsersContainer";
import UserSettingsContainer from "../../../containers/views/settings/UserSettingsContainer";
import PermissionSettingsContainer from "../../../containers/views/settings/PermissionSettingsContainer";
import {FaCogs} from "react-icons/fa";

class Settings extends React.Component {

    render() {
        let navigationBarItems = [
            this.props.isLoggedIn &&
            <NavigationBarItem key="settings_user_link" navigationItem={NAVIGATION_ITEM.SETTINGS_USER}/>,

            this.props.isLoggedIn &&
            <NavigationBarItem key="settings_permissions_link" navigationItem={NAVIGATION_ITEM.SETTINGS_PERMISSIONS}/>,

            <NavigationBarItem key="settings_speech_link" navigationItem={NAVIGATION_ITEM.SETTINGS_SPEECH}/>,
        ];
        let navigationBarDropdown = new DropdownConfig("settings_dropdown",
            <FaCogs/>, "Weitere Einstellungen");
        let navContainer = new NavigationBarContainer(navigationBarItems, navigationBarItems, navigationBarDropdown);
        return <div style={{textAlign: 'center'}}>
            <NavigationBar style={{top: 40, borderTop: "1px solid black", minHeight: 31}}
                           rightContainer={navContainer} alignCenter small/>
            <div style={{
                marginTop: 31,
                paddingTop: 10,
                paddingLeft: 20,
                paddingRight: 20,
                overflowY: "auto",
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0
            }}>
                <Route exact path={NAVIGATION_ITEM.SETTINGS.route} render={() => this.props.isLoggedIn
                    ? <Redirect to={NAVIGATION_ITEM.SETTINGS_USER.route}/>
                    : <Redirect to={NAVIGATION_ITEM.SETTINGS_SPEECH.route}/>}/>
                <Route path={NAVIGATION_ITEM.SETTINGS_SPEECH.route} render={() =>
                    <SpeechSettings style={{marginBottom: 5}}
                                    selectedVoice={this.props.selectedVoice}
                                    defaultVoice={this.props.defaultVoice}
                                    possibleVoices={this.props.possibleVoices}
                                    onSelectedVoiceChange={this.props.setSelectedVoiceByName}/>
                }
                />
                <Route path={NAVIGATION_ITEM.SETTINGS_USER.route} render={() =>
                    <OnlyForLoggedInUsersContainer
                        text="Benutzereinstellungen können nur von angemeldeten Benutzern angepasst werden">
                        <UserSettingsContainer/>
                    </OnlyForLoggedInUsersContainer>
                }
                />
                <Route path={NAVIGATION_ITEM.SETTINGS_PERMISSIONS.route} render={() =>
                    <OnlyForLoggedInUsersContainer
                        text="Berechtigungen können nur von angemeldeten Benutzern angepasst werden">
                        <PermissionSettingsContainer/>
                    </OnlyForLoggedInUsersContainer>
                }
                />
            </div>
        </div>
    }
}

Settings.propTypes = {
    isLoggedIn: PropTypes.bool.isRequired,

    possibleVoices: PropTypes.array.isRequired,
    selectedVoice: PropTypes.object,
    setSelectedVoiceByName: PropTypes.func.isRequired
};

export default Settings;