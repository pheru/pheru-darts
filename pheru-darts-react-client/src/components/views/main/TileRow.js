import React from 'react'
import PropTypes from 'prop-types';

class TileRow extends React.Component {

    render() {
        let columnsValue = "";
        for (let i = 0; i < this.props.columns.length; i++) {
            if (this.props.columns[i].fixedSize) {
                columnsValue += this.props.columns[i].width + "px";
            } else {
                columnsValue += "minmax(" + this.props.columns[i].width + "px, 1fr)";
            }
            columnsValue += " ";
        }
        return <div style={{
            display: 'grid',
            gridGap: this.props.gridGap ? this.props.gridGap + "px" : 0,
            gridTemplateColumns: "repeat(auto-fit, " + columnsValue + ")"
        }}>
            {this.props.children}
        </div>
    }
}

TileRow.propTypes = {
    gridGap: PropTypes.number,
    columns: PropTypes.array.isRequired
};

export default TileRow