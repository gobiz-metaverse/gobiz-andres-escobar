import React from "react";
import StandardLayout from "../../layouts/StandardLayout";
import MatchService from "../../services/bet/MatchService";
import {groupBy} from "lodash";
import {
    Table, InputNumber, Descriptions, Card, message, Space
} from "antd";
import moment from "moment/moment";
import ReactCountryFlag from "react-country-flag";
import {LocalStore} from "../../utils/LocalStore";
import {convertNumberToCurrency} from "../../utils/common";

export default class Champion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            betting: false,
            odds: [],
            betOn: '',
            bet: 0,
            bets: []
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
            }, () => {
                this.loadBets()
            }
        )
    };

    confirmBet = () => {
        this.setState({
            betting: true,
        });

        let handleResponse = (response) => {
            if (response.status === 201) {
                message.success("Đã bet thành công");
                this.setState({
                    betOn: '',
                    bet: 0
                }, () => {
                    this.loadBets()
                })
            } else
                message.error(
                    "Không bet được: " + response.body.message
                );
        };

        MatchService.bet(
            22,
            "OUTRIGHTS",
            this.state.betOn,
            this.state.bet * 1000,
            this.state.odds.find(o=>o.code === this.state.betOn)
        ).then(handleResponse);
    };

    loadBets = () => {
        let user = LocalStore.getInstance().read('user');
        MatchService.getBetsByMatchAndUser('CHAMPION', user.preferred_username).then((response) => {
            this.setState({
                bets: response.body.data
            })
        })
    };

    render() {
        const Outrights = [
            {
                title: 'Đội',
                key: 'code',
                dataIndex: 'code',
                render: (text, record) => {
                    return <><Space><ReactCountryFlag
                        className="emojiFlag"
                        countryCode={record.code}
                        style={{
                            fontSize: "24px",
                            lineHeight: "24px",
                        }}
                        svg
                    /></Space><Space>{record.code}</Space></>
                }
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
                dataIndex: 'bet',
                align: 'right',
                render: (text, record) => {
                    return convertNumberToCurrency(
                        this.state.bets.filter(b => b.code === record.code).reduce((prev, curr) => prev + curr.money, 0))
                }
            },
            {
                title: 'Bet thêm',
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

        const betColumns = [
            {
                title: 'Thời gian',
                key: 'createdAt',
                dataIndex: "createdAt",
                render: (text, record) => {
                    return moment(record.createdAt).format('HH:mm:ss DD/MM/yyyy')
                }
            },
            {
                title: 'Kèo',
                key: 'code',
                dataIndex: "code",
                render: (text, record) => {
                    return <><ReactCountryFlag
                        className="emojiFlag"
                        countryCode={record.code}
                        style={{
                            fontSize: "24px",
                            lineHeight: "24px",
                        }}
                        svg
                    />{record.code}</>
                }
            },
            {
                title: 'Số tiền',
                key: 'money',
                dataIndex: "money",
                render: (text, record) => {
                    return convertNumberToCurrency(record.money)
                }
            },
            {
                title: 'Tỉ lệ',
                key: 'ratio',
                dataIndex: "ratio"
            },
            {
                title: 'Trạng thái',
                key: 'status',
                dataIndex: "status"
            },
            {
                title: 'Lãi/Lỗ thực nhận',
                key: 'outcome',
                dataIndex: "outcome",
                align: 'right',
                render: (text, record) => {
                    if (record.status === 'WIN') {
                        return convertNumberToCurrency((record.prize - record.money) * 0.9)
                    }
                    if (record.status === 'LOSE') {
                        return convertNumberToCurrency(-record.money)
                    }
                }
            },
        ];
        return <StandardLayout {...this.props} title={"Welcome to Fifa World Cup"}>
            <Card>
                <Descriptions column={1} title="Hướng dẫn chơi">
                    <Descriptions.Item label="">
                        Nhập số xu muốn đặt cho đội bạn đoán vô địch (đơn vị là nghìn, chỉ cần nhập 100 tương đương
                        100K), sau đó ấn Enter để xác nhận
                    </Descriptions.Item>
                    <Descriptions.Item label="">
                        Bạn có thể đặt nhiều lần, với các tỉ lệ khác nhau miễn sao tổng số
                        xu bạn tham gia một kèo nhỏ hơn giới hạn nên vui lòng chú ý lịch
                        sử các lần đặt của mình.
                    </Descriptions.Item>
                    <Descriptions.Item label="">
                        Việc bạn tham gia chơi trò chơi này mục đích chính là để đóng góp
                        cho quỹ liên hoan xem World Cup, vui lòng giữ tinh thần vui vẻ là
                        chính.
                    </Descriptions.Item>
                </Descriptions>
                <Table
                    dataSource={this.state.odds}
                    columns={Outrights}
                    pagination={false}
                />

                <Descriptions column={1} title="Chi tiết kèo đã đặt">

                </Descriptions>

                <Table
                    dataSource={this.state.bets}
                    scroll={{
                        x: 300
                    }}
                    columns={betColumns}
                    pagination={false}
                    rowKey={'id'}
                />
            </Card>
        </StandardLayout>
    }
}