import React from "react";
import StandardLayout from "../../layouts/StandardLayout";
import {
    List,
    Card,
    Row,
    Col,
    Typography,
    Space,
    Calendar,
    Descriptions,
} from "antd";
import moment from "moment";
import MatchService from "../../services/bet/MatchService";
import ReactCountryFlag from "react-country-flag";
import "./styles.css";
import {first, groupBy, isEmpty, isEqual, reverse} from "lodash";
import {LocalStore} from "../../utils/LocalStore";
import {LOGIN_URL} from "../../services/bet/Consts";

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            matches: [],
            query: {
                matchStartedFrom: '',
                matchStartedTo: '',
            },
            currentDate: '',
            bets: []
        };
    }

    callMatch() {
        MatchService.getMatches({
            ...this.state.query,
        }).then((response) => {
            if (response) {
                //TODO: sort matches
                const currentData = !isEmpty(response) && !isEmpty(response.body) && !isEmpty(response.body.data)
                    ? response.body.data.filter((item) => item.type !== 'OUTRIGHTS').map((item) => ({
                        ...item,
                        date: moment(item.startTime).format("YYYYMMDD"),
                        started: moment(item.startTime).isBefore(moment()),
                    }))
                    : [];
                const groupDate = !isEmpty(currentData)
                    ? groupBy(currentData, "date")
                    : [];

                const newLatest = !isEmpty(groupDate) ? Object.values(groupDate) : [];
                const finalMatch = !isEmpty(newLatest)
                    ? reverse(newLatest).map((iMatch) => ({
                        title: !isEmpty(first(iMatch))
                            ? `Group State - ${moment(first(iMatch).startTime).calendar(
                                null,
                                {
                                    lastDay: "[Yesterday]",
                                    sameDay: "[Today]",
                                    nextDay: "[Tomorrow]",
                                    lastWeek: "dddd",
                                    nextWeek: "dddd",
                                    sameElse: "L",
                                }
                            )}`
                            : "",
                        children: iMatch,
                    }))
                    : [];
                this.setState({
                    matches: finalMatch,
                }, () => {
                    this.loadBets()
                });
            }
        });
    }

    loadBets = () => {
        let user = LocalStore.getInstance().read('user');
        if (user)
            MatchService.getBetsByUser(user.preferred_username).then((response) => {
                if (response.status === 200)
                    this.setState({
                        bets: response.body.data
                    })
            })
    };

    componentDidMount() {
        // {rangeTime: 'TODAY'}
        this.callMatch();
    }

    componentDidUpdate(prevProps, prevState) {
        if (!isEqual(prevState.query, this.state.query)) {
            this.callMatch();
        }
    }

    render() {
        const {matches, currentDate} = this.state;
        return (
            <StandardLayout {...this.props} title={"Welcome to Fifa World Cup"}>
                <Row gutter={16}>
                    <Col xs={24} sm={24} md={12} lg={16}>
                        <h4>Vui cùng WORLD CUP 2022</h4>
                        <h4>TRĂM TRÁI BANH - TRIỆU CẢM XÚC ^^</h4>
                        <Descriptions column={1} title="Giới thiệu">
                            <Descriptions.Item label="Đây là gì?">
                                Ten ! Ten ! Ten ! Tèn
                                Chúng ta đã trải qua 1 tuần ăn ngủ cùng WC, cảm xúc lên xuống thay màu xanh - đỏ liên
                                tục
                                Hòa chung không khí với Thế giới, 4 năm mới chứng kiến 1 lần ^^
                                Worl Cup đưa chúng ta xích lại gần nhau hơn bên những trận cầu Đỉnh cao [Wow]
                                Hiện ACE bet thủ đã bắt đầu vào kèo có kinh nghiệm, chấp cũng sâu sâu hơn, BTC xin nhắc
                                lại một số
                                thông tin cho các bet thủ mới và làm rõ hơn game VUI CÙNG WORL CUP được hỗ trợ và dẫn
                                đường bởi
                                Idol NI SUN KI
                            </Descriptions.Item>
                            <Descriptions.Item label="Chơi như thế nào?">
                                Truy cập wc.100trieu.net -> Đăng nhập bằng email công ty
                            </Descriptions.Item>
                            <Descriptions.Item label="Chơi được gì?">
                                <h4>VỚI MỖI KÈO BẠN THAM GIA</h4>
                                - Nếu bạn thắng: bạn nhận 90% số tiền thắng được, BTC giữ 10% cho quỹ liên hoan cuối
                                chương trình<br/>
                                - Nếu bạn thua: bạn tặng BTC số tiền bạn cược, BTC tự động donate 20% số đó cho quỹ liên
                                hoan
                            </Descriptions.Item>
                            <Descriptions.Item label="BUỔI XEM CHUNG">
                                BTC sẽ ghim các trận cầu đỉnh cao khuyến khích các bạn tổ chức xem chung, sẵn sàng tài
                                trợ cafe 50k/bạn/nhóm 10 người<br/>
                                Riêng trận CHUNG KẾT tổ chức buổi xem chung cùng buổi Trao thưởng - Tri ân VĐV UpRace
                                2022 vào ngày 18.12.2022, sẽ được thông báo chi tiết sớm nhất.<br/>
                                Hãy join và tận hưởng cảm xúc BET trận hôm nay luôn thôi !
                            </Descriptions.Item>
                            <Descriptions.Item label="Tỉ lệ kèo">
                                Bạn có thể đặt nhiều lần, với các tỉ lệ khác nhau miễn sao tổng số
                                xu bạn tham gia một kèo nhỏ hơn giới hạn. Nhà cái sẽ cập nhật kèo vào khoảng 12:00-13:00
                                và 17:00 đến 18:00
                                hàng ngày tùy điều kiện thực tế.
                            </Descriptions.Item>
                        </Descriptions>
                        <List
                            loading={isEmpty(matches)}
                            dataSource={matches}
                            renderItem={(item, index) => (
                                <List.Item key={index}>
                                    <Row className="w-full">
                                        <Col span={24} className="border border-b-0 bg-gray-50 p-2">
                                            <Typography.Text>{item.title}</Typography.Text>
                                        </Col>
                                        {item.children.map((iChild, iChildIndex) => {
                                                let totalHome = this.state.bets.filter(b => b.matchId === iChild.id && b.code === '1').reduce((prev, curr) => {
                                                    return prev + curr.money
                                                }, 0);

                                                let totalAway = this.state.bets.filter(b => b.matchId === iChild.id && b.code === '2').reduce((prev, curr) => {
                                                    return prev + curr.money
                                                }, 0);

                                                let totalDraw = this.state.bets.filter(b => b.matchId === iChild.id && b.code === 'x').reduce((prev, curr) => {
                                                    return prev + curr.money
                                                }, 0);

                                                return (
                                                    <Col key={iChildIndex} xs={24} sm={24} md={24} lg={12}>
                                                        <Card
                                                            className={
                                                                iChild.started ? "bg-gray-50 cursor-pointer" : "cursor-pointer"
                                                            }
                                                            onClick={() => {
                                                                if (
                                                                    LocalStore.getInstance().read("bet_session")
                                                                ) {
                                                                    this.props.history.push(
                                                                        `/matches/${iChild.id}`
                                                                    );
                                                                } else {
                                                                    window.location = LOGIN_URL;
                                                                }
                                                            }}
                                                        >
                                                            <Typography.Text>
                                                                Group {iChild.awayTeam.groupCode}
                                                            </Typography.Text>
                                                            <Row gutter={15}>
                                                                <Col span={16}>
                                                                    <div className="flex justify-between items-center">
                                                                        <Space>
                                                                            <ReactCountryFlag
                                                                                className="emojiFlag"
                                                                                countryCode={iChild.homeTeam.code}
                                                                                style={{
                                                                                    fontSize: "24px",
                                                                                    lineHeight: "24px",
                                                                                }}
                                                                                aria-label={iChild.homeTeam.name}
                                                                                svg
                                                                            />
                                                                            <Typography.Text>
                                                                                {iChild.homeTeam.name}
                                                                            </Typography.Text>
                                                                        </Space>
                                                                        <Typography.Text strong>
                                                                            {iChild.matchTimeHome !== null ? iChild.matchTimeHome : totalHome > 0 ? `(${totalHome / 1000}K)` : ''}
                                                                        </Typography.Text>
                                                                    </div>
                                                                    <div className="flex justify-between items-center">
                                                                        <Space> </Space>
                                                                        <Typography.Text strong>
                                                                            {iChild.matchTimeAway !== null ? '' : totalDraw > 0 ? `(${totalDraw / 1000}K)` : ''}
                                                                        </Typography.Text>
                                                                    </div>
                                                                    <div className="flex justify-between items-center">
                                                                        <Space>
                                                                            <ReactCountryFlag
                                                                                className="emojiFlag"
                                                                                countryCode={iChild.awayTeam.code}
                                                                                style={{
                                                                                    fontSize: "24px",
                                                                                    lineHeight: "24px",
                                                                                }}
                                                                                aria-label={iChild.awayTeam.name}
                                                                                svg
                                                                            />
                                                                            <Typography.Text>
                                                                                {iChild.awayTeam.name}
                                                                            </Typography.Text>
                                                                        </Space>
                                                                        <Typography.Text strong>
                                                                            {iChild.matchTimeAway !== null ? iChild.matchTimeAway : totalAway > 0 ? `(${totalAway / 1000}K)` : ''}
                                                                        </Typography.Text>
                                                                    </div>
                                                                </Col>
                                                                <Col
                                                                    span={8}
                                                                    className="border-l flex flex-col items-center"
                                                                >
                                                                    <p>
                                                                        {iChild.startTime
                                                                            ? moment(iChild.startTime).format("DD/MM")
                                                                            : ""}
                                                                    </p>
                                                                    <p>
                                                                        {iChild.startTime
                                                                            ? moment(iChild.startTime).format("HH:mm")
                                                                            : ""}
                                                                    </p>
                                                                </Col>
                                                            </Row>
                                                        </Card>
                                                    </Col>
                                                )
                                            }
                                        )}
                                    </Row>
                                </List.Item>
                            )}
                        />
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={8}>
                        <Calendar
                            fullscreen={false}
                            headerRender={false}
                            value={currentDate}
                            onChange={(value) => {
                                console.log("value", value);
                                this.setState({
                                    currentDate: value,
                                    query: {
                                        matchStartedFrom: moment(value)
                                            .set({hour: 0, minute: 0, second: 0, millisecond: 0})
                                            .toISOString(),
                                        matchStartedTo: moment(value)
                                            .set({
                                                hour: 23,
                                                minute: 59,
                                                second: 59,
                                                millisecond: 59,
                                            })
                                            .toISOString(),
                                    },
                                });
                            }}
                        />
                    </Col>
                </Row>
            </StandardLayout>
        );
    }
}

export default Dashboard;
