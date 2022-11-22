import React from "react";
import {Alert} from "antd";

class Logs extends React.Component {
    render() {
        return <div style={{margin: 10}}>
            {this.props.logs ? this.props.logs.reverse().map((log, index)=> {
                return <Alert message={ `${log.time}: ${log.message}`} type={log.type} key={index} style={{marginBottom: 5}}/>
            }): null}
        </div>
    }
}

export default Logs;