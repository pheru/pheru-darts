import React from 'react'
import {ScaleLoader} from "react-spinners";

class Statistics extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return <div>
            {this.props.isFetchingUsers
                ? <ScaleLoader height={25}/>
                : this.props.fetchAllUsersFailed
                    ? <h1 style={{textAlign: 'center'}}>Statistiken nicht verfügbar</h1>
                    : <h1>Statistiken</h1>
            }
        </div>
    }

}

Statistics.propTypes = {};

export default Statistics;
