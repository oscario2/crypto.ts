// info.uniswap.com

// breakpoint on 'ticksProcessed' in tickData.ts; tick arrays in 'closures'
var ticks = [258360, 258300];
var state = I.concat(T)
    .concat(L)
    .map(({ tickIdx, liquidityActive, price0, price1 }) => {
        if (~ticks.indexOf(tickIdx)) {
            return {
                price0,
                price1,
                liquidity: liquidityActive.toString(),
                tickIdx: tickIdx.toString()
            };
        }
    })
    .filter(k => k);
console.log(JSON.stringify(state, null, 3));

// conditonal breakpoint 'h == 1234' in 'CurrencyAmount.fromRawAmount' in pool.ts
var state = {
    tickA: h,
    tickB: this.tickCurrent,
    outputAmount: c.toString(),
    outputPlus: Number(c) * -1,
    liquidityB: f.toString(),
    sqrtRatioA: l.toString(),
    sqrtRatioB: this.sqrtRatioX96.toString()
};
console.log(JSON.stringify(state, null, 3));
