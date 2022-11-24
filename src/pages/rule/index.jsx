import React, { Component } from 'react'
import AppRootComponent from '../../App'
import StandardLayout from '../../layouts/StandardLayout'
import RuleService from '../../services/RuleServices'
import ComponentLoading from '../ComponentLoading'
import Loading from '../Loading'

export default class BetRule extends Component {
	constructor(props) {
		super(props)
		this.state = {
			rule: 'Thể lệ cuộc chơi....',
			loading: false,
		}
	}

	
	render() {
		return  (
			<StandardLayout>
				{this.state.loading ? <Loading /> : <p>{this.state.rule}</p>}
			</StandardLayout>
		)
	}
}
