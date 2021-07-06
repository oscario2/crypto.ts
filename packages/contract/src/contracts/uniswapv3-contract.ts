// deno-lint-ignore-file no-explicit-any
import { AbiParser, Big, TNetworkProvider } from '../../deps.ts';
import { IBatch, TExclude } from '../contract-types.ts';
import { contractHelper } from '../helpers/contract-helper.ts';
import { ContractService } from '../services/contract-service.ts';
import { BaseContract } from './base-contract.ts';

export class IUniswapSlot0 {
    sqrtPriceX96!: Big;
    tick!: number;
    observationIndex!: number;
    observationCardinality!: number;
    feeProtocol!: number;
    unlocked!: boolean;

    constructor(slot0: unknown[]) {
        Object.getOwnPropertyNames(this).forEach((k, i) => {
            (this as any)[k] = slot0[i];
        });
    }
}

export class IUniswapTick {
    liquidityGross!: Big;
    liquidityNet!: Big;
    feeGrowthOutside0X128!: Big;
    feeGrowthOutside1X128!: Big;
    tickCumulativeOutside!: Big;
    secondsPerLiquidityOutsideX128!: Big;
    secondsOutside!: number;
    initialized!: boolean;

    constructor(ticks: unknown[]) {
        Object.getOwnPropertyNames(this).forEach((k, i) => {
            (this as any)[k] = ticks[i];
        });
    }
}

type TContract = InstanceType<typeof UniswapV3Contract>;
export type TUniswapV3Contract = TExclude<TContract, typeof BaseContract>;

export const factoryAbi = [
    'function factory() external view returns (address)',
    'function fee() external view returns (uint24)',
    'function liquidity() external view returns (uint128)',
    'function slot0() external view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint8 feeProtocol, bool unlocked)',
    'function tickSpacing() external view returns (int24)',
    'function ticks(int24 tick) external view returns (uint128 liquidityGross, int128 liquidityNet, uint256 feeGrowthOutside0X128, uint256 feeGrowthOutside1X128, int56 tickCumulativeOutside, uint160 secondsPerLiquidityOutsideX128, uint32 secondsOutside, bool initialized)',
    'function token0() external view returns (address)',
    'function token1() external view returns (address)'
];

export class UniswapV3Contract extends BaseContract {
    constructor(service: ContractService) {
        super(service);
    }

    protected async get<T>(
        method: TUniswapV3Contract,
        args?: unknown[]
    ): Promise<T> {
        return await this._get<T>(method, args);
    }

    public async batch(batch: IBatch<TUniswapV3Contract>[]) {
        return await this._batch(batch);
    }

    public async factory(): Promise<string> {
        return await this.get('factory');
    }

    public async fee(): Promise<number> {
        return await this.get('fee');
    }

    public async liquidity(): Promise<Big> {
        return await this.get('liquidity');
    }

    public async slot0(): Promise<IUniswapSlot0> {
        return new IUniswapSlot0(await this.get('slot0'));
    }

    public async tickSpacing(): Promise<Big> {
        return await this.get('tickSpacing');
    }

    public async ticks(n: number): Promise<IUniswapTick> {
        return new IUniswapTick(await this.get('ticks', [n]));
    }

    public async token0(): Promise<string> {
        return await this.get('token0');
    }

    public async token1(): Promise<string> {
        return await this.get('token1');
    }

    public static async from(address: string, net: TNetworkProvider) {
        const abi = AbiParser.parseAbi(factoryAbi);

        if (!contractHelper.isContractType(this.prototype, abi)) {
            throw new Error(`ABI does not match ${UniswapV3Contract.name}`);
        }
        const contract = await ContractService.fromAbi(address, net, abi);

        return new UniswapV3Contract(contract);
    }
}
