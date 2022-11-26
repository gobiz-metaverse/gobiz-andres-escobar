import React from "react";
import StandardLayout from "../../layouts/StandardLayout";
import MatchService from "../../services/bet/MatchService";
import ComponentLoading from "../ComponentLoading";
import PageNotFound from "../404";
import {
  Button,
  message,
  Tag,
  PageHeader,
  Statistic,
  Card,
  Descriptions,
  Table,
  InputNumber,
  Row,
  Space,
  Typography,
} from "antd";
import moment from "moment";
import { convertNumberToCurrency } from "../../utils/common";
import { isEmpty } from "lodash";
import ReactCountryFlag from "react-country-flag";

function strip(number) {
  return parseFloat(parseFloat(number).toPrecision(7));
}

export default class Match extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
      match: null,
      odds: [],
      homeBet: 0,
      drawBet: 0,
      awayBet: 0,
      betting: false,
    };
  }

  componentDidMount() {
    MatchService.getMatch(this.props.match.params.id).then((response) => {
      if (response.status === 404 || !response.body.data) {
        this.setState({
          loaded: true,
          match: null,
        });
      } else {
        this.setState(
          {
            loaded: true,
            match: response.body.data,
          },
          () => {
            this.loadOdds();
          }
        );
      }
    });
  }

  loadOdds() {
    MatchService.getOdds(this.props.match.params.id).then((response) => {
      this.setState({
        loaded: true,
        odds: response.body.data,
      });
    });
  }

  loadBets() {
    //TODO: bao giờ có được thông tin user hiện tại thì mới có thể làm chỗ này
    MatchService.getBetsByMatchAndUser(this.state.match.code, 1);
  }

  confirmBet = () => {
    this.setState({
      betting: true,
    });
    if (
      this.state.homeBet > 100 ||
      this.state.drawBet > 100 ||
      this.state.awayBet > 100
    ) {
      message.error(
        `Số xu bet tối đa của vòng hiện tại là 100k, vui lòng nhập con số thấp hơn 100k`
      );
      return;
    }

    let handleResponse = (response) => {
      if (response.status === 201) message.success("Đã bet thành công");
      else
        message.error(
          "Không bet được, vui lòng kiểm tra lại thông tin bạn nhập"
        );
    };

    if (this.state.homeBet > 0)
      MatchService.bet(
        this.state.match.id,
        "1x2",
        "1",
        this.state.homeBet * 1000
      ).then(handleResponse);
    if (this.state.drawBet > 0)
      MatchService.bet(
        this.state.match.id,
        "1x2",
        "x",
        this.state.drawBet * 1000
      ).then(handleResponse);
    if (this.state.awayBet > 0)
      MatchService.bet(
        this.state.match.id,
        "1x2",
        "2",
        this.state.awayBet * 1000
      ).then(handleResponse);

    setTimeout(() => {
      this.setState({
        betting: false,
      });
    }, 5000);
  };

  render() {
    if (!this.state.loaded) {
      return (
        <StandardLayout>
          <ComponentLoading />
        </StandardLayout>
      );
    }

    if (!this.state.match) {
      return <PageNotFound />;
    }

    let homeOdds = this.state.odds.find((odd) => {
      return odd.code === "1";
    });
    let awayOdds = this.state.odds.find((odd) => {
      return odd.code === "2";
    });
    let drawOdds = this.state.odds.find((odd) => {
      return odd.code === "x";
    });
    const columns = [
      {
        title: "",
        dataIndex: "title",
        key: "title",
        width: "25%",
      },
      {
        title: this.state.match.homeTeam.name,
        dataIndex: "home",
        key: "home",
        width: "25%",
        render: (text, record) =>
          record.type === "input" ? (
            <InputNumber
              value={this.state.homeBet}
              controls={false}
              onChange={(e) => {
                this.setState({
                  homeBet: e,
                  drawBet: 0,
                  awayBet: 0,
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
              disabled={
                this.state.betting ||
                moment(this.state.match.startTime).isBefore(moment())
              }
            />
          ) : (
            convertNumberToCurrency(text)
          ),
      },
      {
        title: "Hòa",
        dataIndex: "fair",
        key: "fair",
        width: "25%",
        render: (text, record) =>
          record.type === "input" ? (
            <InputNumber
              value={this.state.drawBet}
              disabled={
                this.state.betting ||
                moment(this.state.match.startTime).isBefore(moment())
              }
              controls={false}
              onChange={(e) => {
                this.setState({
                  drawBet: e,
                  homeBet: 0,
                  awayBet: 0,
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
          ) : (
            convertNumberToCurrency(text)
          ),
      },
      {
        title: this.state.match.awayTeam.name,
        dataIndex: "away",
        key: "away",
        width: "25%",
        render: (text, record) =>
          record.type === "input" ? (
            <InputNumber
              value={this.state.awayBet}
              controls={false}
              onChange={(e) => {
                this.setState({
                  awayBet: e,
                  drawBet: 0,
                  homeBet: 0,
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
              disabled={
                this.state.betting ||
                moment(this.state.match.startTime).isBefore(moment())
              }
            />
          ) : (
            convertNumberToCurrency(text)
          ),
      },
    ];
    const dataSource = [
      {
        title: "Tỉ lệ hiện tại",
        home: homeOdds ? homeOdds.ratio : "",
        fair: drawOdds ? drawOdds.ratio : "",
        away: awayOdds ? awayOdds.ratio : "",
        type: "text",
      },
      {
        title: "Số xu bạn muốn đặt \n (Đơn vị tính: nghìn xu)",
        home: this.state.homeBet,
        fair: this.state.drawBet,
        away: this.state.awayBet,
        type: "input",
      },
      {
        title: "Số xu thắng",
        home: homeOdds ? strip(homeOdds.ratio * this.state.homeBet * 1000) : "",
        fair: drawOdds ? strip(drawOdds.ratio * this.state.drawBet * 1000) : "",
        away: awayOdds ? strip(awayOdds.ratio * this.state.awayBet * 1000) : "",
        type: "text",
      },
      {
        title: "Số xu lãi khi thắng",
        home: homeOdds
          ? strip((homeOdds.ratio - 1) * this.state.homeBet * 1000)
          : "",
        fair: drawOdds
          ? strip((drawOdds.ratio - 1) * this.state.drawBet * 1000)
          : "",
        away: awayOdds
          ? strip((awayOdds.ratio - 1) * this.state.awayBet * 1000)
          : "",
        type: "text",
      },
    ];
    return (
      <StandardLayout>
        <PageHeader
          ghost={false}
          onBack={() => window.history.back()}
          tags={
            <Tag
              color={
                moment(this.state.match.startTime).isBefore(moment())
                  ? "gray"
                  : "blue"
              }
            >
              {moment(this.state.match.startTime).isBefore(moment())
                ? "Đã diễn ra"
                : "Sắp diễn ra"}
            </Tag>
          }
          title={`${this.state.match.homeTeam.name} vs ${this.state.match.awayTeam.name}`}
          extra={[
            <Statistic.Countdown
              title="Countdown"
              format="D:H:m:s"
              value={moment(this.state.match.startTime)}
            />,
            <Statistic
              title="Số tiền thực nhận:"
              suffix="Xu"
              value={0}
              precision={2}
              valueStyle={{ color: "#3f8600" }}
            />,
          ]}
        />
        <Card
          title={
            <div className="flex justify-center items-center">
              <div className="flex justify-between items-center">
                <Space>
                  <ReactCountryFlag
                    className="emojiFlag"
                    countryCode={this.state.match.homeTeam.code}
                    style={{
                      fontSize: "24px",
                      lineHeight: "24px",
                    }}
                    aria-label={this.state.match.homeTeam.name}
                    svg
                  />
                  <Typography.Text strong>
                    {this.state.match.homeTeam.name}
                  </Typography.Text>
                </Space>
              </div>
              <Typography.Text className="mx-5">VS</Typography.Text>
              <div className="flex justify-between items-center">
                <Space>
                  <ReactCountryFlag
                    className="emojiFlag"
                    countryCode={this.state.match.awayTeam.code}
                    style={{
                      fontSize: "24px",
                      lineHeight: "24px",
                    }}
                    aria-label={this.state.match.awayTeam.name}
                    svg
                  />
                  <Typography.Text strong>
                    {this.state.match.awayTeam.name}
                  </Typography.Text>
                </Space>
              </div>
            </div>
          }
        >
          <Descriptions column={1} title="Hướng dẫn chơi">
            <Descriptions.Item label="">
              bạn hãy điền số xu bạn muốn đặt (đơn vị tính nghìn, tức là nếu bạn
              nhập 100 tương đương bạn muốn đặt 100k). Sau đó click vào nút "Xác
              nhận kèo" để xác nhận tham gia.
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
            dataSource={dataSource}
            scroll={false}
            columns={columns}
            loading={isEmpty(this.state.match)}
            pagination={false}
            footer={() => (
              <Row justify="end">
                <Button
                  type={"primary"}
                  loading={this.state.betting}
                  onClick={this.confirmBet}
                  disabled={
                    (!this.state.homeBet &&
                      !this.state.drawBet &&
                      !this.state.awayBet) ||
                    moment(this.state.match.startTime).isBefore(moment())
                  }
                >
                  Xác nhận kèo
                </Button>
              </Row>
            )}
          />
        </Card>
        <div className="mt-3">
          {this.state.match.currentScoreUrl ? (
            <iframe
              src={this.state.match.currentScoreUrl}
              frameBorder="0"
              width="560"
              height="650"
              allowFullScreen
              allow="autoplay; fullscreen"
              style={{ width: "100%", overflow: "hidden" }}
              className="_scorebatEmbeddedPlayer_"
            ></iframe>
          ) : null}
        </div>
      </StandardLayout>
    );
  }
}
