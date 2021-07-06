import { X2 } from 'https://raw.githubusercontent.com/oscario2/x2/v0.0.1/index.ts';
import { log } from '../deps.ts';
import { BeefyVaultContract } from '../index.ts';
import { lpHelper } from '../src/helpers/lp-helper.ts';
import { beefyHelper } from '../src/helpers/vaults/beefy-helper.ts';

// to debug, set "debug.javascript.usePreview" to false
const { describe, it, expect } = new X2('Contract');

await describe('Vault', () => {
    const wallet = '0x1dfa9ab8d653f39ba367feb4a0bb1ff33d0df055';
    let vault = {} as BeefyVaultContract;
    let lpTokensTotal = 0 as number;

    it('should load vault contract', async () => {
        const beefyBdoBusd = '0x0fa31301eaa9633b3e4f7df22f7543115759cf5a'; // beefy bdo/busd from pools.js
        vault = await BeefyVaultContract.from(beefyBdoBusd, 'bep20');
    });

    it('should get beefy vault balance', async () => {
        lpTokensTotal = await beefyHelper.getBalance(vault, wallet);
        expect(lpTokensTotal).moreThen(0);
    });

    it('should get routed vault lp USD value', async () => {
        // routed LP token which vault shifts around into strategies
        const token = await vault.token();
        const pool = await lpHelper.getPoolInfo(token, 'bep20');

        // our lp tokens share
        const sharePool = lpTokensTotal / pool.totalSupply;

        pool.tokens.forEach(({ usd, reserve }) => {
            const amount = reserve * sharePool;
            const price = amount * usd;
            log.info(`${amount / 1e18}t = $${price / 1e18}`);
        });
    });
}).run();
