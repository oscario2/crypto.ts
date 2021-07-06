# Crypto.ts

[![crypto.ts](https://github.com/oscario2/crypto.ts/actions/workflows/main.yaml/badge.svg)](https://github.com/oscario2/crypto.ts/actions/workflows/main.yaml)

Umbrella package for handy crypto utilties. Made as a learning experience in `deno`

## Abi

Solidity parser and code identifier. More info and tests in [`packages/abi`](/packages/abi)

## Chainlink

Batch call USD price of N amount of ERC20 tokens through. More info and tests in [`packages/chainlink`](/packages/chainlink)

## Contract

Contract service and helpers for predefined contract templates with typescript typings for both direct or batch calls. Supports ERC20, LPs and Vaults. More info and tests in [`packages/contract`](/packages/contract)

## Gecko

Fetch the USD price of N amount of ERC20 tokens through the `gecko` API. More info and tests in [`packages/gecko`](/packages/gecko)

## Provider

Provider for blockchain RPC calls. More info and tests in [`packages/provider`](/packages/provider)

## Uniswap

Build a pool state identical to `info.uniswap.com` using batch RPC calls. More info and tests in [`packages/uniswap`](/packages/uniswap)
