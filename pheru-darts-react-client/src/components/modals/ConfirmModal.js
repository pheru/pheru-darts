import React from 'react'
import {Modal, Button} from "react-bootstrap";
import PropTypes from 'prop-types';

class ConfirmModal extends React.Component {

    render() {
        return <Modal show={this.props.show} onHide={this.props.onCancel}>
            <Modal.Body>
                <h4>{this.props.text}</h4>
            </Modal.Body>
            <Modal.Footer>
                <Button style={{width: 100}} bsStyle="primary"
                        onClick={this.props.onConfirm}>
                    Ja
                </Button>
                <Button style={{width: 100}} bsStyle='primary' onClick={this.props.onCancel}>Nein</Button>
            </Modal.Footer>
        </Modal>;
    }
}

ConfirmModal.propTypes = {
    show: PropTypes.bool.isRequired,
    text: PropTypes.string.isRequired,
    onCancel: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired
};

export default ConfirmModal;
