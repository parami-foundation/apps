import type { Currency, Token } from '@uniswap/sdk-core';
import { CurrencyAmount, Price } from '@uniswap/sdk-core'
import { parseUnits } from '@ethersproject/units'
import JSBI from 'jsbi'
import type {
  FeeAmount
} from '@uniswap/v3-sdk/dist/';

import {
  priceToClosestTick,
  nearestUsableTick,
  TICK_SPACINGS,
  encodeSqrtRatioX96,
  TickMath,
} from '@uniswap/v3-sdk/dist/'
import Web3 from 'web3';

// try to parse a user entered amount for a given token
export function tryParseAmount<T extends Currency>(value?: string, currency?: T): CurrencyAmount<T> | undefined {
  if (!value || !currency) {
    return undefined
  }
  try {
    const typedValueParsed = parseUnits(value, currency.decimals).toString()
    if (typedValueParsed !== '0') {
      return CurrencyAmount.fromRawAmount(currency, JSBI.BigInt(typedValueParsed))
    }
  } catch (error) {
    // should fail if the user specifies too many decimal places of precision (or maybe exceed max uint?)
    console.debug(`Failed to parse input amount: "${value}"`, error)
  }
  // necessary for all paths to return a value
  return undefined
}

export function tryParseTick(
  baseToken?: Token,
  quoteToken?: Token,
  feeAmount?: FeeAmount,
  value?: string
): number | undefined {
  if (!baseToken || !quoteToken || !feeAmount || !value) {
    return undefined
  }

  // base token fixed at 1 unit, quote token amount based on typed input
  const amount = tryParseAmount(value, quoteToken)
  const amountOne = tryParseAmount('1', baseToken)

  if (!amount || !amountOne) return undefined

  // parse the typed value into a price
  const price = new Price(baseToken, quoteToken, amountOne.quotient, amount.quotient)

  let tick: number

  // check price is within min/max bounds, if outside return min/max
  const sqrtRatioX96 = encodeSqrtRatioX96(price.numerator, price.denominator)

  if (JSBI.greaterThanOrEqual(sqrtRatioX96, TickMath.MAX_SQRT_RATIO)) {
    tick = TickMath.MAX_TICK
  } else if (JSBI.lessThanOrEqual(sqrtRatioX96, TickMath.MIN_SQRT_RATIO)) {
    tick = TickMath.MIN_TICK
  } else {
    // this function is agnostic to the base, will always return the correct tick
    tick = priceToClosestTick(price)
  }

  return -nearestUsableTick(tick, TICK_SPACINGS[feeAmount])
}

export function getIncentiveId(incentiveKey) {
  const web3 = new Web3((window as any).ethereum);
  const encode = web3.eth.abi.encodeParameter(
    {
      IncentiveKey: {
        rewardToken: 'address',
        pool: 'address',
        startTime: 'uint256',
        endTime: 'uint256',
      },
    },
    incentiveKey
  );
  // @ts-ignore
  const incentiveId = web3.utils.soliditySha3(encode);
  console.log('getIncentiveId', encode, incentiveId)
  return incentiveId;
  //return ethers.utils.solidityKeccak256(['address', 'address', 'uint256', 'uint256'], [incentiveKey.rewardToken, incentiveKey.pool, incentiveKey.startTime, incentiveKey.endTime])
}
