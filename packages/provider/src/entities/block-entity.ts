import { cutils } from '../../deps.ts';
import { ErrorProvider } from '../provider-error.ts';
import { TDefaultBlock } from '../provider-types.ts';
import { Entity } from './entity.ts';

export class BlockEntity extends Entity {
    private constructor(private readonly value: string) {
        super();
    }

    /**
     * "0x*" to number or return e.g 'latest'
     * @returns
     */
    toString(): string | number {
        if (typeof this.value === 'number') {
            return parseInt(this.value, 16);
        }
        return this.value;
    }

    public static from(block?: TDefaultBlock): BlockEntity {
        if (!block) return new BlockEntity('latest');

        if (typeof block == 'number') {
            if (block < 0) {
                throw new ErrorProvider.InvalidType(block, 'negative number');
            }
            const hex = cutils.toHex(Math.round(block));
            return new BlockEntity(hex);
        }

        return new BlockEntity(block);
    }
}
