import { X2 } from 'https://raw.githubusercontent.com/oscario2/x2/v0.0.1/index.ts';
import { Big } from '../deps.ts';
import { Erc20Contract } from '../index.ts';
import { IBatch } from '../src/contract-types.ts';
import { TErc20Contract } from '../src/contracts/erc20-contract.ts';
import { EBscAddress, EBscToken } from '../src/enums/bsc-token.ts';
import { erc20Helper } from '../src/helpers/erc20-helper.ts';

// to debug, set "debug.javascript.usePreview" to false
const { describe, it, expect } = new X2('Contract');
const wallet = '0x1dfa9ab8d653f39ba367feb4a0bb1ff33d0df055';

await describe('Erc20', () => {
    const { CAKE: cake } = EBscToken;
    let erc20 = {} as Erc20Contract;

    it('should load contract', async () => {
        erc20 = await Erc20Contract.from(cake, 'bep20');
    });

    it('should get name', async () => {
        expect(await erc20.name()).toEqual('PancakeSwap Token');
    });

    it('should get bignumber', async () => {
        const totalSupply = await erc20.totalSupply();
        expect(totalSupply instanceof Big).toEqual(true);
    });

    it('should batch call', async () => {
        // has 'method' typings
        const [name, _supply, _balance] = (await erc20.batch([
            { method: 'name' },
            { method: 'totalSupply' },
            { method: 'balanceOf', args: [wallet] }
        ])) as [string, Big, Big];
        expect(name).toBe('PancakeSwap Token');
    });

    it('should get USD price', async () => {
        expect(await erc20Helper.getUsdValue(cake, 'bep20')).isNotEmpty();
    });

    it('should get wallet balance in 1 request', async () => {
        const tokens = Object.values(EBscToken);

        // balanceOf request for each token
        const batch = tokens.flatMap(to => {
            return {
                to,
                method: 'balanceOf',
                args: [wallet]
            } as IBatch<TErc20Contract>;
        });

        // returns as a list of bignumbers
        const balanceOf = (await erc20.batch(batch)) as Big[];

        //
        const result = [] as {
            address: string;
            name: string;
            balance: number;
        }[];

        // TODO: get BNB value @oscario2
        for (const it in balanceOf) {
            const address = tokens[it];
            const name = EBscAddress[address];
            const balance = balanceOf[it]; // TODO: include decimals in batch request @oscario2

            if (balance.toString() != '0') {
                result.push({
                    address,
                    name,
                    balance: balance.toDecimal(18)
                });
            }
        }

        // USD price of all our tokens
        const usd = await erc20Helper.getUsdValue(
            result.map(k => k.address),
            'bep20'
        );

        expect(result).isNotEmpty();

        // relative price
        for (const i in result) {
            const { name, balance } = result[i];
            console.log(name, balance, balance * usd[i]);
        }
    });
}).run();
