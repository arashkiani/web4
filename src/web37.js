/**
 * @jest-environment jsdom
 * @flow
 */
'use strict'

import web3 from 'web3'
import contractFile from './contract'

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
	abi: Array,
	address: ?string,
}

type AbiType = {
	constant: Boolean,
	input: Array,
	output: Array<AbiTypeOutput>,
	payable: Boolean,
	name: string,
	stateMutability: 'view' | 'nonpayable' | 'payable',
	type: 'function',
}

type AbiTypeOutput = {
	name: string,
	type: string,
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
	static executables: Array<object>

	constructor() {
		super()
		this.interfaces = []
		this.errors = []
		this.input = []
		this.executables = []
	}

	init(callProps: CallType) {
		this.call = callProps
	}

	addInterface(name: string, abi: AbiType, address: ?string) {
		const interfaceProps = { name, abi, address }
		this.interfaces.push(interfaceProps)
	}
	/*
	action
	parameters
	interfaceName
	from
	ampify
	amount
*/
	async execute(
		action: string,
		parameters: Array,
		interfaceName: string,
		from: ?string,
		ampify: ?number,
		amount: ?number
	) {
		const executables = Object.assign(this.executables)
		const index = this._findIndex(executables, interfaceName)
		if (index < 0) {
			return false
		}
		const instance = executables[index].methods[action].apply(null, parameters)
		console.log(executables[index].methods[action])
		const type = 'call' //'sendTransaction'
		const input = executables[index].input
		if (type !== 'call') {
			input.from = from
			input.gas = Math.round(
				(await instance.estimateGas(input)) * ampify || 1.25
			)
			input.data = await instance.encodeABI()
			if (amount) {
				input.amount = this._toWei(amount)
			}
		}

		return await instance[type].apply(null, input)
	}

	makeExecutable(interfaceName: string, input: InputType): boolean {
		const index = this._findIndex(this.interfaces, interfaceName)
		if (index < 0) {
			this.errors.push({ code: '0', msg: 'couldnt find the contract ...' })
			return false
		}
		const methods = new this.eth.Contract(
			this.interfaces[index].abi,
			input.to,
			input
		).methods
		this.executables.push({ name: interfaceName, methods, input })
		return true
	}
	_findActionType(executable) {
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
	}
	_findIndex(data, option) {
		return data.findIndex((o) => {
			return o.name === option
		})
	}
	_findPramsNumber() {}
	_findInputData() {}
	_findUserAddress() {}
	_getAccounts() {
		return web3.eth.getAccounts()
	}
	_toWei(input) {
		return !input || !Number(input)
			? 0
			: this.utils.toWei(typeof input === 'string' ? input : input.toString())
	}
	result() {
		console.log(this)
	}
}

const web37 = new Web37()
const { abi } = contractFile
web37.addInterface('test', abi)
web37.makeExecutable('test', {
	from: '0xcC6aADf0Db99295F02F85016968011Dbca742F1b',
})
/*
	action
	parameters
	interfaceName
	from
	ampify
	amount
*/
web37.execute('info', false, 'test')
web37.result()
