import React from "react";
import StandardLayout from "../../layouts/StandardLayout";
import MatchService from "../../services/bet/MatchService";
import {groupBy} from "lodash";
import {
    Table, InputNumber
} from "antd";
import moment from "moment/moment";

export default class Champion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            odds: [],
            betOn: '',
            bet: 0
        }
    }

    componentDidMount() {
        MatchService.getOdds(22).then((response) => {
            //xử lý lại odds tẹo
            this.sortOdds(response.body.data);
        })
    }

    sortOdds = (data) => {
        let groupByCode = groupBy(data, 'code');

        let result = [];

        for (let code in groupByCode) {
            result.push(groupByCode[code][0]);
        }

        this.setState({
                odds: result
            }
        )
    };

    confirmBet = () => {

    };

    render() {
        const Outrights = [
            {
                title: 'Đội',
                key: 'code',
                dataIndex: 'code'
            },
            {
                title: 'Tỉ lệ',
                key: 'ratio',
                dataIndex: 'ratio',
                align: 'right'
            },
            {
                title: 'Đã vào',
                key: 'bet',
                dataIndex: 'bet'
            },
            {
                title: 'Giờ sẽ vào',
                key: 'money',
                dataIndex: 'money',
                render: (text, record) => {
                    return <InputNumber
                        max={200}
                        value={record.code === this.state.betOn ? this.state.bet : 0}
                        onChange={(e) => {
                            this.setState({
                                betOn: record.code,
                                bet: e
                            });
                        }}
                        formatter={(value) =>
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        parser={(value) =>
                            value
                                ? parseFloat(
                                    value.toString().replace(/[-&/\\#,+()$~%'":*?<>{}]/g, "")
                                ).toFixed(2)
                                : 0
                        }
                        onPressEnter={() => this.confirmBet()}
                    />
                }
            }
        ];

        return <StandardLayout {...this.props} title={"Welcome to Fifa World Cup"}>
            <Table
                dataSource={this.state.odds}
                columns={Outrights}
            />
        </StandardLayout>
    }
}