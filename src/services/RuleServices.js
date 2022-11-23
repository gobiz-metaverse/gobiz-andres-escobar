import BetClient from './BetClient'
import { LocalStore } from '../utils/LocalStore'
import { handleResponse } from './bet/utils'
import { BET_BASE_URL } from './bet/Consts'

export default class RuleService {
	static getRule(query) {
		let bet_session = LocalStore.getInstance().read('bet_session')

		return BetClient.requestPromise(
			{
				endpoint: BET_BASE_URL + `/rule`,
			},
			`NAAnDS8J1-nbKm-Il9oUoW46wZ4tbeiEOsIBJQwegoQ.Hb_GGYUnxr94OJhuwVbKoBjR4-ZafBpo5MeT7jmCnMg
        `,
			handleResponse
		)
	}
}
