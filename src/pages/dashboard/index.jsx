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
  Button,
} from "antd";
import moment from "moment";
import MatchService from "../../services/bet/MatchService";
import ReactCountryFlag from "react-country-flag";
import "./styles.css";
import { first, groupBy, isEmpty, isEqual, reverse } from "lodash";
import { LocalStore } from "../../utils/LocalStore";
import { LOGIN_URL } from "../../services/bet/Consts";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      matches: [],
      query: {
        matchStartedFrom: moment()
          .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
          .toISOString(),
        matchStartedTo: moment()
          .set({ hour: 23, minute: 59, second: 59, millisecond: 59 })
          .toISOString(),
      },
      currentDate: moment()
    };
  }
  callMatch() {
    MatchService.getMatches({
      ...this.state.query,
    }).then((response) => {
      if (response) {
        //TODO: sort matches
        const currentData = !isEmpty(response.body.data)
          ? response.body.data.map((item) => ({
              ...item,
              date: moment(item.startTime).format("DDMMYYYY"),
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
        });
      }
    });
  }

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
    const { matches, query, currentDate } = this.state;
    return (
      <StandardLayout {...this.props} title={"Welcome to Olympus"}>
        <Row gutter={16}>
          <Col xs={24} sm={24} md={12} lg={16}>
            <List
              loading={isEmpty(matches)}
              dataSource={matches}
              renderItem={(item, index) => (
                <List.Item key={index}>
                  <Row className="w-full">
                    <Col span={24} className="border border-b-0 bg-gray-50 p-2">
                      <Typography.Text>{item.title}</Typography.Text>
                    </Col>
                    {item.children.map((iChild, iChildIndex) => (
                      <Col key={iChildIndex} xs={24} sm={24} md={24} lg={12}>
                        <Card
                          className={
                            iChild.started ? "bg-gray-50" : "cursor-pointer"
                          }
                          onClick={() => {
                            if (!iChild.started) {
                              if (
                                LocalStore.getInstance().read("bet_session")
                              ) {
                                this.props.history.push(
                                  `/matches/${iChild.id}`
                                );
                              } else {
                                window.location = LOGIN_URL;
                              }
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
                                  {iChild.matchTimeHome}
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
                                  {iChild.matchTimeAway}
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
                    ))}
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
                      .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
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
            {!isEmpty(matches) &&
              query.matchStartedFrom &&
              query.matchStartedTo && (
                <Button
                  type="primary"
                  onClick={() => {
                    this.setState({
                      currentDate: '',
                      query: {
                        matchStartedFrom: "",
                        matchStartedTo: "",
                      },
                    });
                  }}
                >
                  Xem tất cả trận đấu
                </Button>
              )}
          </Col>
        </Row>
      </StandardLayout>
    );
  }
}

export default Dashboard;
