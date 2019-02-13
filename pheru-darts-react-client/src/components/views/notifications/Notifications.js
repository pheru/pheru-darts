import React from 'react'
import PropTypes from "prop-types";
import StackLoader from "../../general/loaders/StackLoader";
import {Badge, Button, Table, Card} from "react-bootstrap";
import DateUtil from "../../../util/DateUtil";
import OnlyForLoggedInUsersContainer from "../../../containers/general/OnlyForLoggedInUsersContainer";
import DocumentUtil from "../../../util/DocumentUtil";
import {FaCheck, FaSyncAlt} from "react-icons/fa";

class Notifications extends React.Component {

    componentDidMount() {
        DocumentUtil.setTitlePrefix("Mitteilungen");
    }

    render() {
        return <OnlyForLoggedInUsersContainer
            text="Mitteilungen können nur von angemeldeten Benutzern eingesehen werden">
            <Card body style={{paddingBottom: 0, textAlign: "center"}}>
                <Button variant="primary" style={{marginRight: 5}}
                        onClick={this.props.fetchNotifications}
                        disabled={this.props.isFetchingNotifications}>
                    <FaSyncAlt/> Neu Laden
                </Button>
                <Button variant="primary"
                        onClick={() => this.props.markAsRead(this.props.unreadNotifications.map(
                            (notification) => notification.id
                        ))}
                        disabled={this.props.isFetchingNotifications || this.props.unreadNotifications.length === 0}>
                    <FaCheck/> Alle als gelesen markieren
                </Button>
                <Table hover style={{textAlign: "initial"}}>
                    <thead>
                    <tr>
                        <th style={{whiteSpace: 'normal', width: 100}}>Zeitpunkt</th>
                        <th style={{whiteSpace: 'normal'}}>Mitteilung</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.props.notifications.map(notification =>
                        <tr key={"notification_row_" + notification.id}>
                            <td style={{
                                whiteSpace: 'normal',
                                width: 100,
                                verticalAlign: "middle",
                                textAlign: "center"
                            }}>
                                {DateUtil.toDate(new Date(notification.timestamp), {
                                    replaceToday: true, replaceYesterday: true
                                })}
                                <br/>
                                {DateUtil.toTime(new Date(notification.timestamp))}
                                <br/>
                                {!notification.read &&
                                <Badge style={{backgroundColor: "#337ab7"}}>Neu</Badge>
                                }
                            </td>
                            <td style={{verticalAlign: "middle"}}>
                                {notification.message}
                            </td>
                        </tr>
                    )}
                    {this.props.notifications.length === 0 &&
                    <tr>
                        <td style={{whiteSpace: 'normal', width: 100}}/>
                        <td>Keine Mitteilungen vorhanden</td>
                    </tr>
                    }
                    </tbody>
                </Table>
                {this.props.isFetchingNotifications && <StackLoader label="Lade Mitteilungen..."/>}
            </Card>
        </OnlyForLoggedInUsersContainer>
    }
}

Notifications.propTypes = {
    isLoggedIn: PropTypes.bool.isRequired,
    isLoggingIn: PropTypes.bool.isRequired,
    fetchNotifications: PropTypes.func.isRequired,
    markAsRead: PropTypes.func.isRequired,
    isFetchingNotifications: PropTypes.bool.isRequired,
    notifications: PropTypes.array.isRequired,
    showLogin: PropTypes.func.isRequired,
};

export default Notifications