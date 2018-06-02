import React from 'react'
import {ScaleLoader} from "react-spinners";
import {Button, FormControl, Table, Well} from "react-bootstrap";

class Users extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return <div>
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
                    <td><FormControl type="text" placeholder="Neuer Spieler"/></td>
                    <td><Button bsStyle='success'>Neuer Spieler</Button></td>
                </tr>
                {this.props.users.map(user =>
                    <tr key={"user_row_" + user.id}>
                        <td>{user.id}</td>
                        <td>{user.name}</td>
                        <td><Button bsStyle='danger'>Löschen</Button></td>
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
