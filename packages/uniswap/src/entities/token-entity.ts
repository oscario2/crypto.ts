import { cutils, Erc20Contract } from '../../deps.ts';
import { EFeeAmount } from '../uniswap-types.ts';

export class TokenEntity {
    public constructor(
        public readonly address: string,
        public readonly name: string,
        public readonly decimals: number
    ) {}

    /**
     * generate pair address
     * @param fee
     * @param token1
     * @returns
     */
    getPairAddress(token1: TokenEntity, fee: EFeeAmount) {
        let tokenA = this.address;
        let tokenB = token1.address;

        // pooladdress.sol from peripher
        [tokenA, tokenB] =
            tokenA < tokenB ? [tokenA, tokenB] : [tokenB, tokenA];

        const FACTORY = '0x1f98431c8ad98523631ae4a59f267346ea31f984';
        const POOL_INIT_CODE_HASH =
            '0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54';

        const lpTokenAddress = cutils.keccak256(
            cutils.abiEncodePacked([
                0xff, // CREATE opcode
                FACTORY, // deployer (factory) address
                cutils.keccak256(cutils.abiEncode([tokenA, tokenB, fee])), // salt
                POOL_INIT_CODE_HASH // hash of the to-be-deployed contract's creation bytecode
            ])
        );
        // downcast uint256 to uint160 (20 bytes) to address
        return '0x' + lpTokenAddress.slice(-40);
    }

    //
    public static async from(address: string) {
        const erc20 = await Erc20Contract.from(address, 'erc20');

        const batch = (await erc20.batch([
            { method: 'name' },
            { method: 'decimals' }
        ])) as [string, number];

        return new TokenEntity(address, batch[0], batch[1]);
    }
}
