/**
 * @jest-environment jsdom
 * @flow
 */
'use strict'

import web3 from 'web3'

type CallType = {
	from: string,
	to: string,
	type: ?string,
	interface: string,
	action: string,
	amount: ?number,
}

type InterfaceType = {
	name: string,
	abi: Object,
	address: ?string,
}

type ErrorType = {
	code: number,
	msg: string,
}

type InputType = {
	from: ?string,
	to: string,
	data: ?string,
	gas: ?number,
}

export default class Web37 extends web3 {
	static interfaces: Array<InterfaceType>
	static errors: Array<ErrorType>
	static input: Array<InputType>

	constructor() {
		super()
	}

	init(callProps: CallType) {
		this.call = callProps
	}

	addInterface(interfaceProps: InterfaceProps) {
		this.interfaces.push(interfaceProps)
	}
	setContract(
		action: string,
		interfaceId: number,
		parameters: any,
		input: InputType
	) {
		const contract = new web3.eth.Contract(
			this.interfaces[interfaceId],
			input.to,
			input
		)
		const executable = contract.methods[action].apply(null, parameters)
		this._findInputGas(executable)
		this._findActionType(executable)
		/*
			if (this.call.type !== 'call') {
				input.data = await executable.encodeABI()
				
				if (this.call.amount) {
					input.amount = this.call.amount
				}
			}
		*/
	}
	_findActionType(executable) {
		console.log(executable)
		/*
		if (this.call.contractInterface[this.call.index].payable) {
			this.call.type = 'sendTransaction'
		} else if (
			this.call.contractInterface[this.call.index].stateMutability ===
			'nonpayable'
		) {
			this.call.type = 'send'
		} else {
			this.type = 'call'
		}
		*/
	}
	async _findInputGas(executable: any, ampify: ?number) {
		this.input.gas = Math.round(
			(await executable.estimateGas(this.input)) * ampify || 1.25
		)
	}
	_findInterfaceIndex() {}
	_findPramsNumber() {}
	_findInputData() {}
	_findUserAddress() {}
	_getAccounts() {
		return web3.eth.getAccounts()
	}
}
