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
		//const web3 = new Web3(Web3.givenProvider)
	}

	init(callProps: CallType) {
		this.call = callProps
	}
	/**
	 * @param  {string} name
	 * @param  {AbiType} abi
	 * @param  {?string} address
	 */
	addInterface(name: string, abi: AbiType, address: ?string) {
		const interfaceProps = { name, abi, address }
		this.interfaces.push(interfaceProps)
	}
	/**
	 * @param  {string} action
	 * @param  {Object|boolean} parameters
	 * @param  {string} interfaceName
	 * @param  {?string} from
	 * @param  {?number} ampify
	 * @param  {?number} amount
	 */
	async execute(
		action: string,
		parameters: Object | boolean,
		interfaceName: string,
		from: ?string,
		ampify: ?number,
		amount: ?number
	) {
		const executables = Object.assign(this.executables)
		const executableIndex = this._findIndex(executables, interfaceName)
		if (executableIndex < 0) {
			return false
		}

		const instance = executables[executableIndex].methods[action].apply(
			null,
			parameters || {}
		)

		const actionIndex = this._findIndex(
			executables[executableIndex].abi,
			action
		)
		const abiAction = executables[executableIndex].abi[actionIndex]
		const type = this._findActionType(abiAction.stateMutability)
		const input = executables[executableIndex].input
		if (type !== 'call') {
			input.from = from
			input.data = await instance.encodeABI()
			input.gas = Math.round(
				(await instance.estimateGas(input)) * ampify || 1.25
			)
			if (amount) {
				input.amount = this._toWei(amount)
			}
		}

		return await instance[type].apply(null, input)
	}
	/**
	 * @param  {string} interfaceName
	 * @param  {InputType} input
	 * @returns boolean
	 */
	generateExecutable(interfaceName: string, input: InputType): boolean {
		const index = this._findIndex(this.interfaces, interfaceName)
		if (index < 0) {
			this.errors.push({ code: '0', msg: 'couldnt find the contract ...' })
			return false
		}
		if (!input.to && this.interfaces[index].address) {
			input.to = this.interfaces[index].address
		}

		const methods = new this.eth.Contract(
			this.interfaces[index].abi,
			input.to,
			input
		).methods
		this.executables.push({
			name: interfaceName,
			methods,
			abi: this.interfaces[index].abi,
			input,
		})
		return true
	}
	/**
	 * @param  {'view'|'nonpayable'|'sendTransaction'} stateMutability
	 * @returns string
	 */
	_findActionType(
		stateMutability: 'view' | 'nonpayable' | 'sendTransaction'
	): string {
		console.log(stateMutability)
		if (!stateMutability || stateMutability === 'view') {
			return 'call'
		} else if (stateMutability === 'nonpayable') {
			return 'send'
		} else {
			return 'sendTransaction'
		}
	}
	/**
	 * @param  {object} data
	 * @param  {string} option
	 * @returns number
	 */
	_findIndex(data: object, option: string): number {
		return data.findIndex((o) => {
			return o.name === option
		})
	}
	_getAccounts() {
		return this.eth.getAccounts()
	}

	/**
	 * @param  {number|string} input
	 */
	_toWei(input: number | string) {
		return !input || !Number(input)
			? 0
			: this.utils.toWei(typeof input === 'string' ? input : input.toString())
	}

	/**
	 * @param  {number|string} input
	 * @param  {string='ether'} type
	 */
	_fromWei(input: number | string, type: string = 'ether') {
		return Number(web3.utils.fromWei(input || '0', type))
	}
	/**
	 * @param  {string} address
	 * @param  {string='ether'} type
	 */
	_getUserBalance(address: string, type: string = 'ether') {
		return this.fromWei(web3.eth.getBalance(address), type)
	}
	result() {
		console.log(this)
	}
}

const web37 = new Web37()
const { abi } = contractFile
web37.addInterface('test', abi)
web37.generateExecutable('test', {
	from: '0xcC6aADf0Db99295F02F85016968011Dbca742F1b',
})

web37.execute('info', false, 'test')
web37.result()
