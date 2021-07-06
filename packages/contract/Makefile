DENO := deno run --allow-net

deno:
	@test $${PKG? error ": variable PKG not set"}
	${DENO} ./tests/${PKG}.test.ts

erc20 factory lp vault uniswap-v3:
	@$(MAKE) -s PKG=$@ deno

all:
	@$(MAKE) -s erc20 factory lp vault