import React from 'react'
import {Modal, Button} from "react-bootstrap";

class ConfirmModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            show: props.show
        };
        this.handleHide = this.handleHide.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        return {show: props.show};
    }

    handleHide() {
        this.setState({show: false});
    }

    render() {
        return <Modal show={this.state.show} onHide={this.handleHide}>
            <Modal.Body style={this.modalBodyStyle}>
                <h4>{this.props.text}</h4>
            </Modal.Body>
            <Modal.Footer>
                <Button style={{width: 100}} bsStyle="primary"
                        onClick={() => {
                            this.props.onConfirm();
                            this.handleHide()
                        }}
                >Ja</Button>
                <Button style={{width: 100}} bsStyle='primary' onClick={this.handleHide}>Nein</Button>
            </Modal.Footer>
        </Modal>;
    }
}

ConfirmModal.propTypes = {};

export default ConfirmModal;
