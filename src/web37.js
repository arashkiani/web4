'use strict'
import web3 from 'web3'

export default class Web37 extends web3 {
	constructor() {
		console.log('adasdasd')
		console.log('sadasdasd')
		super()
		this.interface = []

		this.error = {}
	}

	init(calls) {
		this.calls = calls
		console.log('true')
	}
	_findIndex() {}
	addInterface(input, _default) {
		this.interface.push(input)
	}
	getAccounts() {
		return web3.eth.getAccounts()
	}
	validate() {}
	compile() {
		console.log(this.calls)
		return this.a
	}
}

/*
function Web37() {
	//const { web3 } = this
	const data = { input: { from: '0' } }
}
// Validation
Web37.prototype.noError = () => {
	return true
}
// Contract
Web37.prototype.Contract = () => {
	return true
}
// Validation
console.log(Web37())
module.exports = Web37
*/
