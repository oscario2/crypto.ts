// deno-lint-ignore-file no-unused-vars
import { X2 } from 'https://raw.githubusercontent.com/oscario2/x2/v0.0.1/index.ts';
import { ELinkBsc, LinkService } from '../index.ts';

// to debug, set "debug.javascript.usePreview" to false
const { describe, it, expect, beforeEach } = new X2('ChainLink');

describe('Query contracts', () => {
    it('should get multiple USD values', async () => {
        const { ETH, CAKE } = ELinkBsc;

        // from chainlink
        const link = await LinkService.getUsdValue([ETH, CAKE], 'bep20');
        expect(Object.keys(link).length).notZero();
    });
}).run();
