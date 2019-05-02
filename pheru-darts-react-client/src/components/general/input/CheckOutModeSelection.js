import React from 'react'
import PropTypes from "prop-types";
import {ALL_CHECKOUT_MODES} from "../../../constants/checkoutModes";
import KeyTextToggleButtonGroup from "./KeyTextToggleButtonGroup";

class CheckOutModeSelection extends React.Component {

    render() {
        return <KeyTextToggleButtonGroup {...this.props} options={ALL_CHECKOUT_MODES}/>
    }
}

CheckOutModeSelection.propTypes = {
    value: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array
    ]),
    onChange: PropTypes.func,
    borderRightZero: PropTypes.bool,
    multipleSelect: PropTypes.bool
};

export default CheckOutModeSelection