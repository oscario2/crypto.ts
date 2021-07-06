import { AbiParser, Big, TNetworkProvider } from '../../../deps.ts';
import { IBatch, TExclude } from '../../contract-types.ts';
import { contractHelper } from '../../helpers/contract-helper.ts';
import { ContractService } from '../../services/contract-service.ts';
import { BaseContract } from '../base-contract.ts';
import { erc20Abi, Erc20Contract } from '../erc20-contract.ts';

export const beefyAbi = [
    'function token() returns (address)',
    'function getPricePerFullShare() public view returns (uint256)'
].concat(erc20Abi);

type TContract = InstanceType<typeof BeefyVaultContract>;
export type TBeefyVault = TExclude<TContract, typeof BaseContract>;

export class BeefyVaultContract extends Erc20Contract {
    constructor(service: ContractService) {
        super(service);
    }

    protected async get<T>(method: TBeefyVault, args?: unknown[]): Promise<T> {
        return await this._get<T>(method, args);
    }

    public async batch(batch: IBatch<TBeefyVault>[]) {
        return await this._batch(batch);
    }

    public async token(): Promise<string> {
        return await this.get('token');
    }

    public async getPricePerFullShare(): Promise<Big> {
        return await this.get('getPricePerFullShare');
    }

    public static async from(address: string, net: TNetworkProvider) {
        const abi = AbiParser.parseAbi(beefyAbi);

        if (!contractHelper.isContractType(this.prototype, abi)) {
            throw new Error(`ABI does not match ${BeefyVaultContract.name}`);
        }
        const contract = await ContractService.fromAbi(address, net, abi);

        return new BeefyVaultContract(contract);
    }
}
