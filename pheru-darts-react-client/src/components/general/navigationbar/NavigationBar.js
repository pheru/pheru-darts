import React from 'react'
import PropTypes from "prop-types";
import NavigationBarDropdown from "./NavigationBarDropdown";
import {Dropdown} from "react-bootstrap";

class NavigationBarContainer {
    constructor(unmergedItems, mergedItems, dropdownConfig) {
        if (unmergedItems.length !== mergedItems.length) {
            throw new Error("merged and unmerged items must have equal length");
        }
        this.unmergedItems = unmergedItems;
        this.mergedItems = mergedItems;
        this.dropdownConfig = dropdownConfig;
    }
}

class DropdownConfig {
    constructor(id, icon, text, showCaret = true) {
        this.id = id;
        this.icon = icon;
        this.text = text;
        this.showCaret = showCaret;
    }
}

class NavigationBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            lastWidth: -1,
            mergeCount: 0
        };
        this.bar = React.createRef();
        this.resetMergeCount = this.resetMergeCount.bind(this);
        this.maxMergeCount = this.maxMergeCount.bind(this);
        this.shouldMerge = this.shouldMerge.bind(this);
    }

    componentDidMount() {
        window.addEventListener("resize", this.resetMergeCount);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        let fixedChanged = this.props.fixedItems !== undefined &&
            this.props.fixedItems.filter(this.notFalse).length !== prevProps.fixedItems.filter(this.notFalse).length;
        let leftMergedChanged = this.props.leftContainer !== undefined &&
            this.props.leftContainer.mergedItems.filter(this.notFalse).length !== prevProps.leftContainer.mergedItems.filter(this.notFalse).length;
        let leftUnmergedChanged = this.props.leftContainer !== undefined &&
            this.props.leftContainer.unmergedItems.filter(this.notFalse).length !== prevProps.leftContainer.unmergedItems.filter(this.notFalse).length;
        let rightMergedChanged = this.props.rightContainer !== undefined &&
            this.props.rightContainer.mergedItems.filter(this.notFalse).length !== prevProps.rightContainer.mergedItems.filter(this.notFalse).length;
        let rightUnmergedChanged = this.props.rightContainer !== undefined &&
            this.props.rightContainer.unmergedItems.filter(this.notFalse).length !== prevProps.rightContainer.unmergedItems.filter(this.notFalse).length;
        if (fixedChanged
            || leftMergedChanged || leftUnmergedChanged
            || rightMergedChanged || rightUnmergedChanged) {
            this.resetMergeCount()
        } else if (this.shouldMerge() && this.state.mergeCount < this.maxMergeCount()) {
            let prevCount = this.state.mergeCount;
            this.setState({mergeCount: prevCount + 1});
        }
    }

    notFalse(element){
        return element !== false;
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.resetMergeCount);
    }

    shouldMerge() {
        if (!this.bar || !this.bar.current) {
            return false;
        }
        return this.bar.current.offsetWidth < this.bar.current.scrollWidth;
    }

    maxMergeCount() {
        let count = 0;
        if (this.props.leftContainer) {
            count += this.props.leftContainer.unmergedItems.length;
        }
        if (this.props.rightContainer) {
            count += this.props.rightContainer.unmergedItems.length;
        }
        if (this.props.singleDropdown) {
            count += 1;
        }
        return count;
    }

    resetMergeCount(e) {
        if(e === undefined){
            this.setState({mergeCount: 0});
        } else if (e.target.innerWidth !== this.state.lastWidth) {
            // Nur bei Änderungen an der Breite, nicht bei der Höhe
            this.setState({mergeCount: 0, lastWidth: e.target.innerWidth});
        }
    }

    render() {
        let allUnmergedRightLinks = this.props.rightContainer ? this.props.rightContainer.unmergedItems : [];
        let allMergedRightLinks = this.props.rightContainer ? this.props.rightContainer.mergedItems : [];
        let mergedRightLinks = [];
        let unmergedRightLinks = [];

        let allUnmergedLeftLinks = this.props.leftContainer ? this.props.leftContainer.unmergedItems : [];
        let allMergedLeftLinks = this.props.leftContainer ? this.props.leftContainer.mergedItems : [];
        let mergedLeftLinks = [];
        let unmergedLeftLinks = [];

        let singleDropdownLinks = [];

        if (this.state.mergeCount === this.maxMergeCount() && this.props.singleDropdown) {
            singleDropdownLinks = allMergedLeftLinks.concat(<Dropdown.Divider/>).concat(allMergedRightLinks);
        } else {
            let mergeRightLengthDiff = allUnmergedRightLinks.length - this.state.mergeCount;
            let rightSliceIndex = mergeRightLengthDiff >= 0 ? mergeRightLengthDiff : 0;
            mergedRightLinks = allMergedRightLinks.slice(rightSliceIndex, allUnmergedRightLinks.length);
            unmergedRightLinks = allUnmergedRightLinks.slice(0, rightSliceIndex);

            let mergeLeftLengthDiff = this.state.mergeCount - allUnmergedRightLinks.length;
            let leftSliceIndex = mergeLeftLengthDiff >= 0 ? mergeLeftLengthDiff : 0;
            mergedLeftLinks = allMergedLeftLinks.slice(0, leftSliceIndex);
            unmergedLeftLinks = allUnmergedLeftLinks.slice(leftSliceIndex, allUnmergedLeftLinks.length);
        }
        let style = {...this.props.style};
        if (this.props.alignCenter) {
            style.justifyContent = "center";
        }
        return <div ref={this.bar} className={"navigation-bar" + (this.props.small ? " navigation-bar-small" : "")} style={style}>
            <div className="navigation-bar-container">
                {this.props.fixedItems}
                {mergedLeftLinks.length > 0 &&
                <NavigationBarDropdown id={this.props.leftContainer.dropdownConfig.id} items={mergedLeftLinks}
                                       icon={this.props.leftContainer.dropdownConfig.icon}
                                       text={this.props.leftContainer.dropdownConfig.text}
                                       withCaret={this.props.leftContainer.dropdownConfig.showCaret}/>}
                {unmergedLeftLinks}
            </div>

            <div className="navigation-bar-container navigation-bar-container-right">
                {unmergedRightLinks}
                {mergedRightLinks.length > 0 &&
                <NavigationBarDropdown id={this.props.rightContainer.dropdownConfig.id} items={mergedRightLinks}
                                       icon={this.props.rightContainer.dropdownConfig.icon}
                                       text={this.props.rightContainer.dropdownConfig.text}
                                       withCaret={this.props.rightContainer.dropdownConfig.showCaret}
                                       right/>}
                {singleDropdownLinks.length > 0 &&
                <NavigationBarDropdown id={this.props.singleDropdown.id} items={singleDropdownLinks}
                                       icon={this.props.singleDropdown.icon}
                                       text={this.props.singleDropdown.text}
                                       withCaret={this.props.singleDropdown.showCaret}
                                       fullWidth/>}
            </div>
        </div>
    }
}

NavigationBar.propTypes = {
    fixedItems: PropTypes.array,
    leftContainer: PropTypes.instanceOf(NavigationBarContainer),
    rightContainer: PropTypes.instanceOf(NavigationBarContainer),
    singleDropdown: PropTypes.instanceOf(DropdownConfig),
    alignCenter: PropTypes.bool,
    small: PropTypes.bool
};

export default NavigationBar;
export {NavigationBarContainer, DropdownConfig}