import React from 'react'

class TileRow extends React.Component {

    render() {
        return <div style={{
            display: 'grid',
            gridGap: 0,
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))"
        }}>
            {this.props.children}
        </div>
    }
}

TileRow.propTypes = {};

export default TileRow