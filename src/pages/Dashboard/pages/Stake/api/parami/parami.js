import Web3 from 'web3'

import { contractAddresses } from './constants'

import Contracts from './contract'

export default class Parami {
  constructor (provider, networkId, options) {
    this.web3 = new Web3(provider)

    if (options.defaultAccount) {
      this.web3.eth.defaultAccount = options.defaultAccount
    }

    this.contracts = new Contracts(provider, networkId, this.web3, options)

    this.wethAddress = contractAddresses.weth[networkId]
    this.ad3Address = contractAddresses.ad3[networkId]
    this.masterAddress = contractAddresses.master[networkId]
  }

  setProvider (provider, networkId) {
    this.web3.setProvider(provider)
    this.contracts.setProvider(provider, networkId)
    this.operation.setNetworkId(networkId)
  }

  setDefaultAccount (account) {
    this.web3.eth.defaultAccount = account
    this.contracts.setDefaultAccount(account)
  }

  getDefaultAccount () {
    return this.web3.eth.defaultAccount
  }

  loadAccount (account) {
    const newAccount = this.web3.eth.accounts.wallet.add(account.privateKey)

    if (!newAccount || (account.address && account.address.toLowerCase() !== newAccount.address.toLowerCase())) {
      throw new Error(`Loaded account address mismatch.
        Expected ${account.address}, got ${newAccount ? newAccount.address : null}`)
    }
  }
}
