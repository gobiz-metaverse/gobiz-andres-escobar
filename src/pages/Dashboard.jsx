import React from 'react';
import StandardLayout from '../layouts/StandardLayout'
import {Link} from "react-router-dom";
import logs from "./changelog/log.json"
import MatchService from "../services/bet/MatchService";
import {Table} from "antd";
import moment from "moment";

let columns = [
    {
        title: 'Thời gian đá',
        dataIndex: 'startTime',
        key: 'time',
        render: (text, record) => {
            return <span>{moment(record.startTime).format('HH:mm DD/MM/yyyy')}</span>
        },
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.startTime - b.startTime,
    },
    {
        title: 'Trận',
        key: 'match',
        render: (text, record) => {
            return <div>
                <span className={`fi fi-${record.homeTeam.flag}`}></span> <span>{record.homeTeam.name}</span>
                {" "} - {" "}
                <span className={`fi fi-${record.awayTeam.flag}`}></span> <span>{record.awayTeam.name}</span>
            </div>
        }
    },
    {
        title: 'Full time',
        key: 'match',
        render: (text, record) => {
            if (record.fullTimeHome && record.fullTimeAway)
                return <div><span>{record.fullTimeHome}</span> - <span>{record.fullTimeAway}</span></div>
        }
    },
    {
        title: 'Action',
        key: 'action',
        render: (text, record) => {
            return <Link to={`/matches/${record.id}`}>[Xem chi tiết]</Link>
        }
    }
];

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            matches: []
        }
    }

    componentDidMount() {
        // {rangeTime: 'TODAY'}
        MatchService.getMatches({}).then((response) => {
            if (response) {
                //TODO: sort matches

                this.setState({
                    matches: response.body.data
                })
            }
        })
    }

    render() {
        return <StandardLayout {...this.props} title={'Welcome to Olympus'}>
            <h1>Dashboard</h1>
            <section className="dashboard">
                <Table style={{minWidth: 400}} pagination={null} columns={columns} dataSource={this.state.matches}
                       rowKey={(record) => {
                           return record.code + record.time;
                       }}/>
            </section>
        </StandardLayout>
    }
}

export default Dashboard;