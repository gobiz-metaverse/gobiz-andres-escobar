import React from "react";
import {Link} from "react-router-dom";
import StandardLayout from "../../layouts/StandardLayout";
import MatchService from "../../services/bet/MatchService";
import ComponentLoading from "../ComponentLoading";
import PageNotFound from "../404";
import {Input, Button, message} from "antd";

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
            awayBet: 0
        }
    }

    componentDidMount() {
        MatchService.getMatch(this.props.match.params.id).then((response) => {
            if (response.status === 404 || !response.body.data) {
                this.setState({
                    loaded: true,
                    match: null
                })
            } else {
                this.setState({
                    loaded: true,
                    match: response.body.data
                }, () => {
                    this.loadOdds()
                })
            }
        })
    }

    loadOdds() {
        MatchService.getOdds(this.props.match.params.id).then((response) => {
            this.setState({
                loaded: true,
                odds: response.body.data
            })
        })
    }

    confirmBet =() => {
        if (this.state.homeBet > 100 || (this.state.drawBet > 100) || (this.state.awayBet > 100)) {
            message.error(`Số xu bet tối đa của vòng hiện tại là 100k, vui lòng nhập con số thấp hơn 100k`);
            return
        }

        let handleResponse = (response) => {
            if (response.status === 201)
                message.success('Đã bet thành công');
            else
                message.error('Không bet được, vui lòng kiểm tra lại thông tin bạn nhập')
        };

        if (this.state.homeBet > 0)
            MatchService.bet(this.state.match.id, '1x2', '1', this.state.homeBet*1000).then(handleResponse);
        if (this.state.drawBet > 0)
            MatchService.bet(this.state.match.id, '1x2', 'x', this.state.drawBet*1000).then(handleResponse);
        if (this.state.awayBet > 0)
            MatchService.bet(this.state.match.id, '1x2', '2', this.state.awayBet*1000).then(handleResponse);
    };

    render() {
        if (!this.state.loaded) {
            return <StandardLayout>
                <ComponentLoading/>
            </StandardLayout>
        }

        if (!this.state.match) {
            return <PageNotFound/>
        }

        let homeOdds = this.state.odds.find((odd) => {
            return odd.code === '1'
        });
        let awayOdds = this.state.odds.find((odd) => {
            return odd.code === '2'
        });
        let drawOdds = this.state.odds.find((odd) => {
            return odd.code === 'x'
        });

        // console.info(homeOdds, this.state.homeBet);

        return <StandardLayout>
            <Link to={'/'}>Trở về trang chủ</Link>
            <h1>{this.state.match.homeTeam.name} vs {this.state.match.awayTeam.name}</h1>

            Hướng dẫn chơi: bạn hãy điền số xu bạn muốn đặt (đơn vị tính nghìn VNĐ, tức là nếu bạn nhập 100 tương
            đương bạn muốn đặt 100k VNĐ).
            Sau đó click vào nút "Xác nhận kèo" để xác nhận tham gia.<br/>
            Bạn có thể đặt nhiều lần, với các tỉ lệ khác nhau miễn sao tổng số xu bạn tham gia một kèo nhỏ hơn giới
            hạn nên vui lòng chú ý lịch sử các lần đặt của mình.
            <table className={'table'} style={{maxWidth: '800px'}}>
                <tr>
                    <th></th>
                    <th>{this.state.match.homeTeam.name}</th>
                    <th>Hòa</th>
                    <th>{this.state.match.awayTeam.name}</th>
                </tr>
                <tr>
                    <th>Tỉ lệ hiện tại</th>
                    <td className={'text-right'}>{homeOdds ? homeOdds.ratio : null}</td>
                    <td className={'text-right'}>{drawOdds ? drawOdds.ratio : null}</td>
                    <td className={'text-right'}>{awayOdds ? awayOdds.ratio : null}</td>
                </tr>
                <tr>
                    <th>Số xu bạn muốn đặt<br/>(Đơn vị tính: nghìn VNĐ)</th>
                    <td><Input className={'text-right'} value={this.state.homeBet} onChange={(e) => {
                        this.setState({homeBet: e.target.value, drawBet: 0, awayBet: 0})
                    }}/></td>
                    <td><Input className={'text-right'} value={this.state.drawBet} onChange={(e) => {
                        this.setState({drawBet: e.target.value, homeBet: 0, awayBet: 0})
                    }}/></td>
                    <td><Input className={'text-right'} value={this.state.awayBet} onChange={(e) => {
                        this.setState({awayBet: e.target.value, drawBet: 0, homeBet: 0})
                    }}/></td>
                </tr>
                <tr>
                    <th>Số xu thắng</th>
                    <td className={'text-right'}>{homeOdds ? strip(homeOdds.ratio * this.state.homeBet * 1000) : null}</td>
                    <td className={'text-right'}>{drawOdds ? strip(drawOdds.ratio * this.state.drawBet * 1000) : null}</td>
                    <td className={'text-right'}>{awayOdds ? strip(awayOdds.ratio * this.state.awayBet * 1000) : null}</td>
                </tr>
                <tr>
                    <th>Số xu lãi khi thắng</th>
                    <td className={'text-right'}>{homeOdds ? strip((homeOdds.ratio - 1) * this.state.homeBet * 1000) : null}</td>
                    <td className={'text-right'}>{drawOdds ? strip((drawOdds.ratio - 1) * this.state.drawBet * 1000) : null}</td>
                    <td className={'text-right'}>{awayOdds ? strip((awayOdds.ratio - 1) * this.state.awayBet * 1000) : null}</td>
                </tr>
                <tr>
                    <td colSpan={4} className={'text-right'}>
                        <Button type={'primary'} onClick={this.confirmBet}>Xác nhận kèo</Button>
                    </td>
                </tr>
            </table>

            {this.state.match.currentScoreUrl ?
                <iframe src={this.state.match.currentScoreUrl} frameBorder='0' width='560' height='650'
                        allowFullScreen allow='autoplay; fullscreen' style={{width: '100%', overflow: 'hidden'}}
                        className='_scorebatEmbeddedPlayer_'></iframe> : null}
        </StandardLayout>
    }
}