import { AbiParser, Big, TNetworkProvider } from '../../deps.ts';
import { IBatch, TExclude } from '../contract-types.ts';
import { contractHelper } from '../helpers/contract-helper.ts';
import { ContractService } from '../services/contract-service.ts';
import { BaseContract } from './base-contract.ts';

type TContract = InstanceType<typeof FactoryContract>;
export type TFactoryContract = TExclude<TContract, typeof BaseContract>;

export const factoryAbi = [
    'function allPairs(uint256) external view returns (address pair)',
    'function allPairsLength() external view returns (uint)'
];

export class FactoryContract extends BaseContract {
    constructor(service: ContractService) {
        super(service);
    }

    protected async get<T>(
        method: TFactoryContract,
        args?: unknown[]
    ): Promise<T> {
        return await this._get<T>(method, args);
    }

    public async batch(batch: IBatch<TFactoryContract>[]) {
        return await this._batch(batch);
    }

    public async allPairs(index: number): Promise<string> {
        return await this.get('allPairs', [index]);
    }

    public async allPairsLength(): Promise<Big> {
        return await this.get('allPairsLength');
    }

    public static async from(address: string, net: TNetworkProvider) {
        const abi = AbiParser.parseAbi(factoryAbi);

        if (!contractHelper.isContractType(this.prototype, abi)) {
            throw new Error(`ABI does not match ${FactoryContract.name}`);
        }
        const contract = await ContractService.fromAbi(address, net, abi);

        return new FactoryContract(contract);
    }
}
