import React from 'react'
import {Button, Glyphicon, Modal} from "react-bootstrap";
import PropTypes from 'prop-types';
import {ifEnterKey, ifEscKey} from "../../util/functionUtil";

class ErrorModal extends React.Component {

    render() {
        return <Modal show={this.props.show} onKeyDown={(target) => {
            ifEnterKey(this.props.hide)(target);
            ifEscKey(this.props.hide)(target);
        }}>
            <Modal.Body style={{paddingTop: 0, paddingBottom: 0}}>
                <h3><Glyphicon glyph="alert" style={{color: "#d9534f"}}/> <strong>{this.props.error.title}</strong></h3>
                <h4>{this.props.error.text}</h4>
            </Modal.Body>
            <Modal.Footer>
                <Button style={{width: 100}} bsStyle="danger"
                        onClick={this.props.hide}>
                    OK
                </Button>
            </Modal.Footer>
        </Modal>;
    }
}

ErrorModal.propTypes = {
    show: PropTypes.bool.isRequired,
    error: PropTypes.object.isRequired,
    hide: PropTypes.func.isRequired,
};

export default ErrorModal;