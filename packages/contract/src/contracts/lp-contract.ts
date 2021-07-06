import { IBatch, TExclude } from '../contract-types.ts';
import { contractHelper } from '../helpers/contract-helper.ts';
import { AbiParser, Big, TNetworkProvider } from '../../deps.ts';
import { ContractService } from '../services/contract-service.ts';
import { BaseContract } from './base-contract.ts';
import { erc20Abi, Erc20Contract } from './erc20-contract.ts';

type TContract = InstanceType<typeof LiquidPairContract>;
export type TLiquidPairContract = TExclude<TContract, typeof BaseContract>;

export const lpAbi = [
    'function factory() external view returns (address)',
    'function token0() external view returns (address)',
    'function token1() external view returns (address)',
    'function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)'
].concat(erc20Abi);

/**
 * uniswap v2 or pancake
 */
export class LiquidPairContract extends Erc20Contract {
    constructor(service: ContractService) {
        super(service);
    }

    protected async get<T>(
        method: TLiquidPairContract,
        args?: unknown[]
    ): Promise<T> {
        return await this._get<T>(method, args);
    }

    public async batch(batch: IBatch<TLiquidPairContract>[]) {
        return await this._batch(batch);
    }

    public async factory(): Promise<string> {
        return await this.get('factory');
    }

    public async token0(): Promise<string> {
        return await this.get('token0');
    }

    public async token1(): Promise<string> {
        return await this.get('token1');
    }

    public async getReserves(): Promise<Big[]> {
        return await this.get('getReserves');
    }

    public static async from(address: string, net: TNetworkProvider) {
        const abi = AbiParser.parseAbi(lpAbi);

        if (!contractHelper.isContractType(this.prototype, abi)) {
            throw new Error(`ABI does not match ${LiquidPairContract.name}`);
        }
        const contract = await ContractService.fromAbi(address, net, abi);

        return new LiquidPairContract(contract);
    }
}
