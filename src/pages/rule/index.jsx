import React, { Component } from 'react'
import AppRootComponent from '../../App'
import StandardLayout from '../../layouts/StandardLayout'
import RuleService from '../../services/RuleServices'
import ComponentLoading from '../ComponentLoading'
import Loading from '../Loading'
import './rule.module.css'

export default class BetRule extends Component {
	constructor(props) {
		super(props)
		this.state = {
			rule: 'Thể lệ cuộc chơi....',
			loading: false,
		}
	}

	componentDidMount() {
		this.setState({ loading: true })
		RuleService.getRule()
			.then((res) => {
				if (res.status === 200) {
					this.setState({ rule: res.body.data })
				}
			})
			.finally(() => this.setState({ loading: false }))
	}
	render() {
		return  (
			<StandardLayout>
				{this.state.loading ? <Loading /> : <p>{this.state.rule}</p>}
			</StandardLayout>
		)
	}
}

