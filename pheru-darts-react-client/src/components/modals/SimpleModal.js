import React from 'react'
import {Button, Modal} from "react-bootstrap";
import PropTypes from 'prop-types';
import KeyUtil from "../../util/KeyUtil";
import {FaExclamationCircle, FaInfoCircle, FaQuestionCircle, FaTimesCircle} from "react-icons/fa";

export const TYPE_INFORMATION = "TYPE_INFORMATION";
export const TYPE_WARNING = "TYPE_WARNING";
export const TYPE_ERROR = "TYPE_ERROR";
export const TYPE_CONFIRMATION = "TYPE_CONFIRMATION";

class SimpleModal extends React.Component {

    constructor(props) {
        super(props);
        let appearance = this.props.item.modalType !== undefined ?
            this.getAppearanceByModalType(this.props.item.modalType)
            : this.getAppearanceByModalType(TYPE_INFORMATION);
        this.state = {
            appearance: appearance
        };
    }


    componentDidUpdate(prevProps) {
        if (prevProps.item.modalType !== this.props.item.modalType
            && this.props.item.modalType !== undefined) {
            let appearance = this.getAppearanceByModalType(this.props.item.modalType);
            this.setState({
                appearance: appearance
            });
        }
    }

    render() {
        return <Modal show={this.props.show} onKeyDown={(target) => {
            if (this.props.item.modalType === TYPE_INFORMATION
                || this.props.item.modalType === TYPE_WARNING
                || this.props.item.modalType === TYPE_ERROR) {
                KeyUtil.ifEnterKey(this.props.hide)(target);
            }
            KeyUtil.ifEscKey(this.props.hide)(target);
        }}>
            <Modal.Body style={{paddingTop: 0, paddingBottom: 0}}>
                <h3>
                    {this.state.appearance.icon}
                    <strong> {this.props.item.title}</strong>
                </h3>
                <h4>{this.props.item.message}</h4>
            </Modal.Body>
            <Modal.Footer>
                <Button style={{width: 100}} variant={this.state.appearance.variant}
                        onClick={() => {
                            if (this.props.item.onConfirm) {
                                this.props.item.onConfirm();
                            }
                            this.props.hide();
                        }}>
                    {this.props.item.modalType === TYPE_CONFIRMATION ? "Ja" : "OK"}
                </Button>
                {this.props.item.modalType === TYPE_CONFIRMATION &&
                <Button style={{width: 100}} variant={this.state.appearance.variant}
                        onClick={() => {
                            if (this.props.item.onCancel) {
                                this.props.item.onCancel();
                            }
                            this.props.hide();
                        }}>
                    Nein
                </Button>}
            </Modal.Footer>
        </Modal>;
    }

    getAppearanceByModalType(modalType) {
        switch (modalType) {
            case TYPE_ERROR:
                return {
                    icon: <FaTimesCircle style={{color: "#d9534f"}}/>,
                    variant: "danger"
                };
            case TYPE_WARNING:
                return {
                    icon: <FaExclamationCircle style={{color: "#f0ad4e"}}/>,
                    variant: "warning"
                };
            case TYPE_INFORMATION:
                return {
                    icon: <FaInfoCircle style={{color: "#5bc0de"}}/>,
                    variant: "info"
                };
            case TYPE_CONFIRMATION:
                return {
                    icon: <FaQuestionCircle style={{color: "#337ab7"}}/>,
                    variant: "primary"
                };
            default:
                return null;
        }
    }
}

SimpleModal.propTypes = {
    show: PropTypes.bool.isRequired,
    item: PropTypes.object.isRequired,
    hide: PropTypes.func.isRequired,
};

export default SimpleModal;