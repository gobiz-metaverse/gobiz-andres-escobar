import React from "react";
import StandardLayout from "../../layouts/StandardLayout";
import { List, Card, Row, Col, Typography, Space, Calendar } from "antd";
import moment from "moment";
import MatchService from "../../services/bet/MatchService";
import ReactCountryFlag from "react-country-flag";
import "./styles.css";
import { first, groupBy, isEmpty, orderBy } from "lodash";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      matches: [],
    };
  }

  componentDidMount() {
    // {rangeTime: 'TODAY'}
    MatchService.getMatches({}).then((response) => {
      if (response) {
        //TODO: sort matches
        const currentData = !isEmpty(response.body.data)
          ? response.body.data.map((item) => ({
              ...item,
              date: moment(item.startTime).format("DDMMYYYY"),
              started: (moment(item.startTime)).isBefore(moment())
            }))
          : [];
        console.log('currentData', currentData)
        const groupDate = !isEmpty(currentData)
          ? groupBy(orderBy(currentData, ['startTime', 'asc']), "date")
          : [];
        const finalMatch = !isEmpty(groupDate)
          ? Object.values(groupDate).map((iMatch) => ({
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

  render() {
    const { matches } = this.state;
    console.log('matches', matches)
    return (
      <StandardLayout {...this.props} title={"Welcome to Olympus"}>
        <Row gutter={16}>
          <Col xs={24} sm={24} md={16} lg={18}>
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
                      <Col key={iChildIndex} xs={24} sm={24} md={12}>
                        <Card className={iChild.started ? 'bg-gray-50' : ''}>
                          <Typography.Text>Group {iChild.awayTeam.groupCode}</Typography.Text>
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
                                  />
                                  <Typography.Text>
                                    {iChild.homeTeam.name}
                                  </Typography.Text>
                                </Space>
                                <Typography.Text strong>{iChild.matchTimeHome}</Typography.Text>
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
                                  />
                                  <Typography.Text>
                                    {iChild.awayTeam.name}
                                  </Typography.Text>
                                </Space>
                                <Typography.Text strong>{iChild.matchTimeAway}</Typography.Text>
                              </div>
                            </Col>
                            <Col
                              span={8}
                              className="border-l flex flex-col items-center"
                            >
                              <p>
                                {iChild.startTime
                                  ? moment(iChild.startTime).format(
                                      "dddd, Do MMM"
                                    )
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
          <Col xs={24} sm={24} md={8} lg={6}>
            <Calendar fullscreen={false} headerRender={false} />
          </Col>
        </Row>
      </StandardLayout>
    );
  }
}

export default Dashboard;
