DENO := deno run --allow-net

define package
$(shell node -p "require('./package.json').$(1)")
endef

# docker
DTAG := $(call package,version)
DIMG := crypto:${DTAG}

# runtime
run:
	@$(MAKE) -s -C ./packages/${PKG} all

abi chainlink contract provider uniswap:
	@$(MAKE) -s PKG=$@ run

all:
	@$(MAKE) -s abi chainlink contract provider uniswap

# docker
docker-build:
	@docker image inspect ${DIMG} > /dev/null 2>&1 || docker build -t ${DIMG} .

docker-remove:
	@docker rmi -f ${DIMG}

docker-run:
	@docker run -it --network host --init ${DIMG}

docker:
	@echo ${DIMG}
	@$(MAKE) docker-build docker-run