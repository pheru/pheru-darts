import React from 'react'
import {Dropdown, FormControl, MenuItem} from "react-bootstrap";
import PropTypes from "prop-types";

class DropdownTextfield extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            icon: this.props.iconFactory ? this.props.iconFactory(this.props.value) : null
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.value !== prevProps.value
            || this.props.iconFactory !== prevProps.iconFactory
            || this.props.choices !== prevProps.choices) {
            this.setState({
                icon: this.props.iconFactory ? this.props.iconFactory(this.props.value) : null
            });
        }
    }

    render() {
        let showDropdownToggle = this.props.choices !== undefined && this.props.choices.length > 0;
        return <Dropdown id={this.props.id} style={{...this.props.style, display: 'inline-flex'}}>
            <div style={{position: 'absolute', top: 1, left: 3}}>
                {this.state.icon}
            </div>
            <FormControl type="text" value={this.props.value} placeholder={this.props.placeholder}
                         onChange={(e) => this.props.onInputChange(e.target.value)}
                         style={{
                             borderTopRightRadius: showDropdownToggle ? 0 : undefined,
                             borderBottomRightRadius: showDropdownToggle ? 0 : undefined,
                             textAlign: 'center'
                         }}
                         autoFocus={this.props.autoFocus}
            />
            <Dropdown.Toggle style={{borderLeftWidth: 0, display: showDropdownToggle ? "" : "none"}}/>
            <Dropdown.Menu style={{minWidth: 'calc(100% - 34px)', textAlign: 'center'}}>
                {this.props.choices.map((choice, i) =>
                    [<MenuItem key={"choice" + this.getTextForChoice(choice)}
                               style={{width: 'calc(100% - 1px)', margin: "auto"}}
                               onClick={() => this.props.onDropdownClick(choice)}>
                        {this.getTextForChoice(choice)}
                    </MenuItem>,
                        (this.props.dividerPositions && this.props.dividerPositions.includes(i)) && <MenuItem divider/>
                    ]
                )}
            </Dropdown.Menu>
        </Dropdown>
    }

    getTextForChoice(choice) {
        return this.props.dropdownPropertyName ? choice[this.props.dropdownPropertyName] : choice;
    }
}

DropdownTextfield.propTypes = {
    value: PropTypes.any,
    dropdownPropertyName: PropTypes.string,
    choices: PropTypes.array,
    iconFactory: PropTypes.func,
    onDropdownClick: PropTypes.func,
    onInputChange: PropTypes.func,
    placeholder: PropTypes.string,
    autoFocus: PropTypes.bool,
    dividerPositions: PropTypes.array
};

export default DropdownTextfield
