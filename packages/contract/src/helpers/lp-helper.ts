import { Big, cutils, TNetworkProvider } from '../../deps.ts';
import { IPairInfo, IPairInfoToken } from '../contract-types.ts';
import { LiquidPairContract } from '../contracts/lp-contract.ts';
import { erc20Helper } from './erc20-helper.ts';

/**
 * uniswap v2 or pancake
 */
export class LiquidPairHelper {
    /**
     * v2 pool information
     * @param lp
     * @returns
     */
    public async getPoolInfo(
        address: string,
        net: TNetworkProvider
    ): Promise<IPairInfo> {
        const lp = await LiquidPairContract.from(address, net);

        const [tokenA, tokenB, decimals, supply, reserves] = (await lp.batch([
            { method: 'token0' },
            { method: 'token1' },
            { method: 'decimals' },
            { method: 'totalSupply' },
            { method: 'getReserves' }
        ])) as [string, string, number, Big, Big[]];

        const [token0, token1] =
            tokenA < tokenB ? [tokenA, tokenB] : [tokenB, tokenA];

        const totalSupply = supply.toDecimal(decimals);

        const reserve0 = reserves[0].toDecimal(decimals);
        const reserve1 = reserves[1].toDecimal(decimals);

        const ratio0 = reserve0 / reserve1;
        const ratio1 = reserve1 / reserve0;

        const [usd0, usd1] = await erc20Helper.getUsdValue(
            [token0, token1],
            net
        );

        const totalValueLocked = reserve0 * usd0 + reserve1 * usd1;
        const pricePerToken = totalValueLocked / totalSupply;

        const tokens: IPairInfoToken[] = [token0, token1].map((address, i) => {
            return {
                address,
                reserve: i ? reserve1 : reserve0,
                ratio: i ? ratio1 : ratio0,
                usd: i ? usd1 : usd0
            };
        });

        return {
            tokens,
            totalSupply,
            totalValueLocked,
            pricePerToken
        };
    }

    /**
     * calculate v2 LP address from two ERC20 tokens
     * @param tokenA
     * @param tokenB
     * @param factory address
     * @param creationCode hash of contract code including constructor
     * @returns
     */
    public getPairAddress(
        tokenA: string,
        tokenB: string,
        factory: string,
        creationCode: string
    ) {
        const [token0, token1] =
            tokenA < tokenB ? [tokenA, tokenB] : [tokenB, tokenA];

        const lpTokenAddress = cutils.keccak256(
            cutils.abiEncodePacked([
                0xff, // CREATE opcode
                factory, // deployer (factory) address
                cutils.keccak256(cutils.abiEncodePacked([token0, token1])), // salt
                creationCode // hash of the to-be-deployed contract's creation bytecode
            ])
        );

        // address is last 20 bytes
        return '0x' + lpTokenAddress.slice(-40);
    }

    /**
     *
     * @param network
     * @returns
     */
    public getCreationCode(
        network: 'uniswap' | 'pancake'
    ): [factory: string, creationCode: string] {
        switch (network) {
            case 'uniswap':
                return [
                    '0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f',
                    // https://uniswap.org/docs/v2/smart-contract-integration/getting-pair-addresses/
                    '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f'
                ];
            case 'pancake':
                return [
                    '0xbcfccbde45ce874adcb698cc183debcf17952812',
                    // factory > INIT_CODE_PAIR_HASH
                    '0xd0d4c4cd0848c93cb4fd1f498d7013ee6bfb25783ea21593d5834f5d250ece66'
                ];
        }
    }
}

export const lpHelper = new LiquidPairHelper();
