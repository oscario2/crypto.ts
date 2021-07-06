export abstract class Entity {
    // using toString to allow implicit calls
    abstract toString(decimals?: number): string | number | bigint;
}
