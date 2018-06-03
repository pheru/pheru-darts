import React from 'react'
import {ScaleLoader} from "react-spinners";
import {Alert, Button, FormControl, Glyphicon, Table, Well} from "react-bootstrap";

class Users extends React.Component {

    constructor(props) {
        super(props);
        this.initialState = {
            newUser: "",
            editId: -1,
            editValue: "",
            editInitialValue: ""
        };
        this.state = this.initialState;
        this.cancelEdit = this.cancelEdit.bind(this);
        this.handleEditChange = this.handleEditChange.bind(this);
        this.handleNewUserChange = this.handleNewUserChange.bind(this);
        this.onNewUserClicked = this.onNewUserClicked.bind(this);
    }

    edit(user) {
        this.setState({
            editId: user.id,
            editValue: user.name,
            editInitialValue: user.name
        })
    }

    cancelEdit() {
        this.setState(this.initialState);
    }

    handleEditChange(e) {
        this.setState({editValue: e.target.value});
    }

    handleNewUserChange(e) {
        this.setState({newUser: e.target.value});
    }

    onNewUserClicked() {
        this.props.addUser({name: this.state.newUser});
        this.setState({newUser: ""});
    }

    render() {
        return <div>
            {this.props.addingFailed &&
            <Alert style={{marginTop: -10, borderRadius: 0}} bsStyle="danger" onDismiss={this.handleAlertDismiss}>
                <h4>Spieler konnte nicht hinzugefügt werden!</h4>
                <p>{this.props.addingFailedMessage}</p>
            </Alert>
            }
            {this.props.isFetchingUsers
                ? <ScaleLoader height={25}/>
                : this.props.fetchAllUsersFailed
                    ? <h1 style={{textAlign: 'center'}}>Spielerverwaltung nicht verfügbar</h1>
                    : this.createUsersTable()
            }
        </div>
    }

    createUsersTable() {
        return <Well style={{marginLeft: 20, marginRight: 20}}>
            <Table responsive hover>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Aktion</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td/>
                    <td>
                        <FormControl type="text" placeholder="Neuer Spieler" disabled={this.props.isAdding}
                                     value={this.state.newUser} onChange={e => this.handleNewUserChange(e)}/>

                    </td>
                    <td>
                        <Button bsStyle='success' onClick={this.onNewUserClicked} disabled={this.props.isAdding}>
                            <Glyphicon glyph="plus"/>
                        </Button>
                    </td>
                </tr>
                {this.props.isAdding &&
                <tr>
                    <td/>
                    <td><ScaleLoader height={25}/></td>
                    <td/>
                </tr>
                }
                {this.props.users.map(user =>
                    <tr key={"user_row_" + user.id}>
                        <td>{user.id}</td>
                        <td>
                            {this.state.editId !== user.id &&
                            user.name
                            }
                            {this.state.editId === user.id &&
                            <FormControl type="text" value={this.state.editValue} onChange={this.handleEditChange}/>
                            }
                        </td>
                        <td>
                            {this.state.editId === user.id &&
                            <div>
                                <Button bsStyle='success' style={{marginRight: 5}}>
                                    <Glyphicon glyph="ok"/>
                                </Button>
                                <Button bsStyle='warning' onClick={this.cancelEdit}>
                                    <Glyphicon glyph="remove"/>
                                </Button>
                            </div>
                            }
                            {this.state.editId !== user.id &&
                            <div>
                                <Button bsStyle='primary' style={{marginRight: 5}} onClick={() => this.edit(user)}>
                                    <Glyphicon glyph="pencil"/>
                                </Button>
                                <Button bsStyle='danger'>
                                    <Glyphicon glyph="trash"/>
                                </Button>
                            </div>
                            }
                        </td>
                    </tr>
                )}
                </tbody>
            </Table>
        </Well>
            ;
    }

}

Users.propTypes = {};

export default Users;
