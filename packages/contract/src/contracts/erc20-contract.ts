import { AbiParser, Big, TNetworkProvider } from '../../deps.ts';
import { IBatch, TExclude } from '../contract-types.ts';
import { contractHelper } from '../helpers/contract-helper.ts';
import { ContractService } from '../services/contract-service.ts';
import { BaseContract } from './base-contract.ts';

type TContract = InstanceType<typeof Erc20Contract>;
export type TErc20Contract = TExclude<TContract, typeof BaseContract>;

export const erc20Abi = [
    'function name() returns (string)',
    'function decimals() returns (uint8)',
    'function balanceOf(address owner) returns (uint256)',
    'function totalSupply() returns (uint256)'
];

export class Erc20Contract extends BaseContract {
    constructor(service: ContractService) {
        super(service);
    }

    protected async get<T>(
        method: TErc20Contract,
        args?: unknown[]
    ): Promise<T> {
        return await this._get<T>(method, args);
    }

    public async batch(batch: IBatch<TErc20Contract>[]) {
        return await this._batch(batch);
    }

    public async name(): Promise<string> {
        return await this.get('name');
    }

    public async decimals(): Promise<number> {
        return await this.get('decimals');
    }

    public async balanceOf(address: string): Promise<Big> {
        return await this.get('balanceOf', [address]);
    }

    public async totalSupply(): Promise<Big> {
        return await this.get('totalSupply');
    }

    public static async from(address: string, net: TNetworkProvider) {
        const abi = AbiParser.parseAbi(erc20Abi);

        if (!contractHelper.isContractType(this.prototype, abi)) {
            throw new Error(`ABI does not match ${Erc20Contract.name}`);
        }
        const contract = await ContractService.fromAbi(address, net, abi);

        return new Erc20Contract(contract);
    }
}
