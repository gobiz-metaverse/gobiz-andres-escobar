import React from "react";
import StandardLayout from "../../layouts/StandardLayout";
import MatchService from "../../services/bet/MatchService";
import ComponentLoading from "../ComponentLoading";
import PageNotFound from "../404";
import { LocalStore } from "../../utils/LocalStore";
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

const MAX_BET = 200;

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
      bets: [],
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
            this.loadBets();
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
    let user = LocalStore.getInstance().read("user");
    MatchService.getBetsByMatchAndUser(
      this.state.match.code,
      user.preferred_username
    ).then((response) => {
      this.setState({
        bets: response.body.data,
      });
    });
  }

    confirmBet = () => {
        this.setState({
            betting: true,
        });

        let homeOdds = this.state.odds.find((odd) => {
            return odd.code === "1";
        });
        let awayOdds = this.state.odds.find((odd) => {
            return odd.code === "2";
        });
        let drawOdds = this.state.odds.find((odd) => {
            return odd.code === "x";
        });

        if (
            this.state.homeBet > MAX_BET ||
            this.state.drawBet > MAX_BET ||
            this.state.awayBet > MAX_BET
        ) {
            message.error(
                `Số xu bet tối đa của vòng hiện tại là ${MAX_BET}k, vui lòng nhập con số thấp hơn ${MAX_BET}k`
            );
            return;
        }

        let handleResponse = (response) => {
            if (response.status === 201) {
                message.success("Đã bet thành công");
                this.setState({
                    homeBet: 0,
                    drawBet: 0,
                    awayBet: 0
                }, () => {
                    this.loadBets()
                })
            } else
                message.error(
                    "Không bet được: " + response.body.message
                );
        };

        if (this.state.homeBet > 0)
            MatchService.bet(
                this.state.match.id,
                "1x2",
                "1",
                this.state.homeBet * 1000,
                homeOdds.ratio
            ).then(handleResponse);
        if (this.state.drawBet > 0)
            MatchService.bet(
                this.state.match.id,
                "1x2",
                "x",
                this.state.drawBet * 1000,
                drawOdds.ratio
            ).then(handleResponse);
        if (this.state.awayBet > 0)
            MatchService.bet(
                this.state.match.id,
                "1x2",
                "2",
                this.state.awayBet * 1000,
                awayOdds.ratio
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
        width: '20%',
      },
      {
        title: () => {
          return (
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
              <Typography.Text>{this.state.match.homeTeam.name}</Typography.Text>
            </Space>
          );
        },
        dataIndex: "home",
        key: "home",
        width:'22%',
        align: "right",
        render: (text, record) =>
          record.type === "input" ? (
            <InputNumber
              max={MAX_BET}
              value={this.state.homeBet}
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
                moment(this.state.match.startTime).isBefore(moment()) || this.state.odds.length === 0
              }
            />
          ) : (
            convertNumberToCurrency(text)
          ),
      },
      {
        title: "Hòa",
        width: '21%',
        dataIndex: "fair",
        key: "fair",
        align: "right",
        hidden: this.state.match.type,
        render: (text, record) =>
          record.type === "input" ? (
            <InputNumber
              max={MAX_BET}
              value={this.state.drawBet}
              disabled={
                this.state.betting ||
                moment(this.state.match.startTime).isBefore(moment())
              }
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
        title: () => {
          return (
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
              <Typography.Text>{this.state.match.awayTeam.name}</Typography.Text>
            </Space>
          );
        },
        dataIndex: "away",
        key: "away",
        width: '22%',
        align: "right",
        render: (text, record) =>
          record.type === "input" ? (
            <InputNumber
              max={MAX_BET}
              value={this.state.awayBet}
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
    ].filter(item => !item.hidden);
    const dataSource = [
      {
        title: "Tỉ lệ",
        home: homeOdds ? homeOdds.ratio : "",
        fair: drawOdds ? drawOdds.ratio : "",
        away: awayOdds ? awayOdds.ratio : "",
        type: "text",
      },
      {
        title: "Đã đặt",
        home: this.state.bets
          .filter((b) => b.code === "1")
          .reduce((prev, curr) => {
            return prev + curr.money;
          }, 0),
        fair: this.state.bets
          .filter((b) => b.code === "x")
          .reduce((prev, curr) => {
            return prev + curr.money;
          }, 0),
        away: this.state.bets
          .filter((b) => b.code === "2")
          .reduce((prev, curr) => {
            return prev + curr.money;
          }, 0),
        type: "text",
      },
      {
        title: "Đặt (K)",
        home: this.state.homeBet,
        fair: this.state.drawBet,
        away: this.state.awayBet,
        type: "input",
      },
      {
        title: "Thắng",
        home: homeOdds ? strip(homeOdds.ratio * this.state.homeBet * 1000) : "",
        fair: drawOdds ? strip(drawOdds.ratio * this.state.drawBet * 1000) : "",
        away: awayOdds ? strip(awayOdds.ratio * this.state.awayBet * 1000) : "",
        type: "text",
      },
      {
        title: "Lãi",
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
      {
        title: "Nhận",
        home: homeOdds
          ? strip((homeOdds.ratio - 1) * this.state.homeBet * 900)
          : "",
        fair: drawOdds
          ? strip((drawOdds.ratio - 1) * this.state.drawBet * 900)
          : "",
        away: awayOdds
          ? strip((awayOdds.ratio - 1) * this.state.awayBet * 900)
          : "",
        type: "text",
      },
    ];

    const betColumns = [
      {
        title: "Thời gian",
        key: "createdAt",
        dataIndex: "createdAt",
        render: (text, record) => {
          return moment(record.createdAt).format("HH:mm:ss DD/MM/yyyy");
        },
      },
      {
        title: "Kèo",
        key: "code",
        dataIndex: "code",
        render: (text, record) => {
          switch (text) {
            case "1":
              return this.state.match.homeTeam.name;
            case "2":
              return this.state.match.awayTeam.name;
            case "x":
              return "Hòa";
          }
        },
      },
      {
        title: "Số tiền",
        key: "money",
        dataIndex: "money",
        render: (text, record) => {
          return convertNumberToCurrency(record.money);
        },
      },
      {
        title: "Tỉ lệ",
        key: "ratio",
        dataIndex: "ratio",
      },
      {
        title: "Trạng thái",
        key: "status",
        dataIndex: "status",
      },
      {
        title: "Lãi/Lỗ thực nhận",
        key: "outcome",
        dataIndex: "outcome",
        align: "right",
        render: (text, record) => {
          if (record.status === "WIN") {
            return convertNumberToCurrency((record.prize - record.money) * 0.9);
          }
          if (record.status === "LOSE") {
            return convertNumberToCurrency(-record.money);
          }
        },
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
              value={this.state.bets.reduce((prev, curr) => {
                if (curr.status === "WIN") {
                  return prev + (curr.prize - curr.money) * 0.9;
                }
                if (curr.status === "LOSE") {
                  return prev - curr.money;
                }
                return prev;
              }, 0)}
              precision={0}
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
              Bạn hãy điền số xu bạn muốn đặt (đơn vị tính nghìn, tức là nếu bạn
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
          <Typography.Title level={5} className='my-3'>Chi tiết kèo đã đặt</Typography.Title>
          <Table
            dataSource={this.state.bets}
            scroll={{
              x: 300,
            }}
            columns={betColumns}
            pagination={false}
            rowKey={"id"}
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
