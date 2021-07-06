import { X2 } from 'https://raw.githubusercontent.com/oscario2/x2/v0.0.1/index.ts';
import { ProviderService } from '../index.ts';
import { ILogsRequest } from '../src/messages/logs-message.ts';
import { TNetworkProvider } from '../src/provider-types.ts';

// to debug, set "debug.javascript.usePreview" to false
const { describe, it, expect } = new X2('Provider');
const provider = ProviderService.from('bep20');

await describe('Network', () => {
    const getBlock = async (net: TNetworkProvider) => {
        const provider = ProviderService.from(net);
        const { transactions } = await provider.getBlock();
        expect(transactions.length).moreThen(0);
    };

    it('connects to ETH', () => {
        getBlock('erc20');
    });

    it('connects to BSC', () => {
        getBlock('bep20');
    });

    it('connects to MATIC', () => {
        getBlock('matic');
    });
}).run();

await describe('Data', () => {
    it('should get code of contract', async () => {
        const { value } = await provider.getCode(
            '0xe9e7cea3dedca5984780bafc599bd69add087d56'
        );
        expect(value.length).notZero();
    });
}).run();

await describe('Block', () => {
    it('gets latest block', async () => {
        const block = await provider.getBlock('latest');
        expect(block.transactions.length).moreThen(0);
    });

    it('gets number block', async () => {
        const block = await provider.getBlock(5964681);
        expect(block.number).toEqual(5964681);
    });

    it("can't be negative", () => {
        expect(async () => {
            await provider.getBlock(-500);
        }).toThrow(Error);
    });
}).run();

await describe('Logs', () => {
    const log: ILogsRequest = {
        fromBlock: 5964681,
        toBlock: 5964681,
        topics: [
            // Transfer(indexed from, indexed to, uint256 value)
            '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
            // wallet
            '0x1dfa9ab8d653f39ba367feb4a0bb1ff33d0df055',
            // beefy vault
            '0xfa31301eaa9633b3e4f7df22f7543115759cf5a'
        ],
        // pancake pair holding our LPs
        address: '0xc5b0d73a7c0e4eaf66babf7ee16a2096447f7ad6'
    };

    it('fetch logs by hash', async () => {
        const { logs } = await provider.getLogs(log);
        expect(logs).isNotEmpty();
    });

    it('fetch logs by signature', async () => {
        log.topics[0] = 'Transfer(address,address,uint256)';
        const { logs } = await provider.getLogs(log);
        expect(logs).isNotEmpty();
    });
}).run();
