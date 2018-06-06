import React from 'react'
import {Modal, Button} from "react-bootstrap";

class ConfirmModal extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return <Modal show={this.props.show} onHide={this.props.onCancel}>
            <Modal.Body style={this.modalBodyStyle}>
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

ConfirmModal.propTypes = {};

export default ConfirmModal;
