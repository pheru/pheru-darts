import React from 'react'
import {Button, Glyphicon, Modal} from "react-bootstrap";
import PropTypes from 'prop-types';
import {ifEnterKey, ifEscKey} from "../../util/functionUtil";

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
            ifEnterKey(this.props.hide)(target);
            ifEscKey(this.props.hide)(target);
        }}>
            <Modal.Body style={{paddingTop: 0, paddingBottom: 0}}>
                <h3>
                    <Glyphicon glyph={this.state.appearance.glyph}
                               style={{color: this.state.appearance.color}}/>
                    <strong> {this.props.item.title}</strong>
                </h3>
                <h4>{this.props.item.message}</h4>
            </Modal.Body>
            <Modal.Footer>
                <Button style={{width: 100}} bsStyle={this.state.appearance.bsStyle}
                        onClick={() => {
                            if (this.props.item.onConfirm) {
                                this.props.item.onConfirm();
                            }
                            this.props.hide();
                        }}>
                    {this.props.item.modalType === TYPE_CONFIRMATION ? "Ja" : "OK"}
                </Button>
                {this.props.item.modalType === TYPE_CONFIRMATION &&
                <Button style={{width: 100}} bsStyle={this.state.appearance.bsStyle}
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
                    glyph: "remove-sign",
                    color: "#d9534f",
                    bsStyle: "danger"
                };
            case TYPE_WARNING:
                return {
                    glyph: "alert",
                    color: "#f0ad4e",
                    bsStyle: "warning"
                };
            case TYPE_INFORMATION:
                return {
                    glyph: "info-sign",
                    color: "#5bc0de",
                    bsStyle: "info"
                };
            case TYPE_CONFIRMATION:
                return {
                    glyph: "question-sign",
                    color: "#337ab7",
                    bsStyle: "primary"
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