import { Big } from '../../../deps.ts';
import { BeefyVaultContract } from '../../contracts/vaults/beefy-contract.ts';

export class BeefyHelper {
    /**
     * balanceOf LP tokens in beefy strategy
     * @param vault
     * @param wallet
     * @returns
     */
    public async getBalance(vault: BeefyVaultContract, wallet: string) {
        const [strategyTotal, sharesBalance, decimals] = (await vault.batch([
            { method: 'getPricePerFullShare' },
            { method: 'balanceOf', args: [wallet] },
            { method: 'decimals' }
        ])) as [Big, Big, number];
        const mod = 10 ** decimals;

        const lpTokensTotal =
            (sharesBalance.toNumber() * strategyTotal.toNumber()) / mod;

        return lpTokensTotal;
    }
}

export const beefyHelper = new BeefyHelper();
