import { contractAddresses, pairs } from './constants'

// abi
import ERC20Abi from './abi/ERC20.json'
import WETHAbi from './abi/WETH.json'
import MasterAbi from './abi/Ad3StakeManager.json'
import ERC721Abi from './abi/ERC721-ABI.json'

export default class Contracts {
  constructor (provider, networkId, web3, options) {
    this.web3 = web3

    this.defaultConfirmations = options.defaultConfirmations
    this.autoGasMultiplier = options.autoGasMultiplier || 1.5
    this.confirmationType = options.confirmationType
    this.defaultGas = options.defaultGas
    this.defaultGasPrice = options.defaultGasPrice

    this.weth = new this.web3.eth.Contract(WETHAbi)
    this.ad3 = new this.web3.eth.Contract(ERC20Abi)
    this.master = new this.web3.eth.Contract(MasterAbi)
    this.usdt = new this.web3.eth.Contract(ERC20Abi)
    this.usdc = new this.web3.eth.Contract(ERC20Abi)

    this.pools = pairs.map((pool) =>
      Object.assign(pool, {
        lpAddress: pool.lpAddresses[networkId],
        tokenAddress: pool.tokenAddresses[networkId],
        coinAddress: pool.coinAddresses[networkId],
        poolAddress: pool.poolAddresses[networkId],
        lpContract: new this.web3.eth.Contract(ERC721Abi), // uniswap v3
        tokenContract: new this.web3.eth.Contract(ERC20Abi),
      })
    )

    this.setProvider(provider, networkId)
    this.setDefaultAccount(this.web3.eth.defaultAccount)
  }

  setProvider (provider, networkId) {
    const setProvider = (contract, address) => {
      contract.setProvider(provider)

      if (address) {
        contract.options.address = address
      } else {
        console.error('Contract address not found in network', networkId)
      }
    }

    setProvider(this.weth, contractAddresses.weth[networkId])
    setProvider(this.ad3, contractAddresses.ad3[networkId])
    setProvider(this.master, contractAddresses.master[networkId])
    setProvider(this.usdt, contractAddresses.usdt[networkId])
    setProvider(this.usdc, contractAddresses.usdc[networkId])

    this.pools.forEach(({ lpContract, lpAddress, tokenContract, tokenAddress }) => {
      setProvider(lpContract, lpAddress, true)
      setProvider(tokenContract, tokenAddress, true)
    })
  }

  setDefaultAccount (account) {
    this.ad3.options.from = account
    this.master.options.from = account
  }
}
