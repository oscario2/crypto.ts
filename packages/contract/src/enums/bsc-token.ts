/*
// https://bsctokenlists.org/
var out = []
var alpha = obj.tokens.sort((a, b) => a.symbol.localeCompare(b.symbol))
alpha.map(({ symbol, address}) => out.push(`${symbol} = '${address.toLowerCase()}'`));
copy(out.join(',\n'))
*/

export enum EBscToken {
    ADA = '0x3ee2200efb3400fabb9aacf31297cbdd1d435d47',
    ALICE = '0xac51066d7bec65dc4589368da368b212745d63e8',
    ALPACA = '0x8f0528ce5ef7b51152a59745befdd91d97091d2f',
    ALPHA = '0xa1faa113cbe53436df28ff0aee54275c13b40975',
    ANKR = '0xf307910a4c7bbc79691fd374889b36d8531b08e3',
    anyMTLX = '0x5921dee8556c4593eefcfad3ca5e2f618606483b',
    ASR = '0x80d5f92c2c8c682070c95495313ddb680b267320',
    ATM = '0x25e9d05365c867e59c1904e7463af9f312296f9e',
    ATOM = '0x0eb3a705fc54725037cc9e008bdede697f62f335',
    AUTO = '0xa184088a740c695e156f91f5cc086a06bb78b827',
    BAKE = '0xe02df9e3e622debdd69fb838bb799e3f168902c5',
    bALBT = '0x72faa679e1008ad8382959ff48e392042a8b06f7',
    BAND = '0xad6caeb32cd2c308980a548bd0bc5aa4306c6c18',
    BAT = '0x101d82428437127bf1608f699cd651e6abf9766e',
    BCH = '0x8ff795a6f4d97e7887c79bea79aba5cc76444adf',
    BDO = '0x190b589cf9fb8ddeabbfeae36a813ffb2a702454',
    Beer = '0xbb8db5e17bbe9c90da8e3445e335b82d7cc53575',
    BEL = '0x8443f091997f06a61670b735ed92734f5628692f',
    BELT = '0xe0e514c71282b6f4e823703a39374cf58dc3ea4f',
    BETH = '0x250632378e573c6be1ac2f97fcdf00515d0aa91b',
    BFI = '0x81859801b01764d4f0fa5e64729f5a6c3b91435b',
    BIFI = '0xca3f508b8e4dd382ee878a314789373d80a5190a',
    BLK = '0x63870a18b6e42b01ef1ad8a2302ef50b7132054f',
    bMXX = '0x4131b87f74415190425ccd873048c708f8005823',
    bOPEN = '0xf35262a9d427f96d2437379ef090db986eae5d42',
    BOR = '0x92d7756c60dcfd4c689290e8a9f4d263b3b32241',
    bROOBEE = '0xe64f5cb844946c1f102bd25bbd87a5ab4ae89fbe',
    BRY = '0xf859bf77cbe8699013d6dbc7c2b926aaf307f830',
    BSCX = '0x5ac52ee5b2a633895292ff6d8a89bb9190451587',
    BTCB = '0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c',
    BTCST = '0x78650b139471520656b9e7aa7a5e9276814a38e9',
    BUNNY = '0xc9849e6fdb743d08faee3e34dd2d1bc69ea11a51',
    BURGER = '0xae9269f27437f0fcbc232d39ec814844a51d6b8f',
    BUSD = '0xe9e7cea3dedca5984780bafc599bd69add087d56',
    BUX = '0x211ffbe424b90e25a15531ca322adf1559779e45',
    CAKE = '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
    CAN = '0x007ea5c0ea75a8df45d288a4debdd5bb633f9e56',
    COMP = '0x52ce071bd9b1c4b00a0b92d298c512478cad67e8',
    COS = '0x96dd399f9c3afda1f194182f71600f1b65946501',
    CREAM = '0xd4cb328a82bdf5f03eb737f37fa6b370aef3e888',
    CTK = '0xa8c2b8eec3d368c0253ad3dae65a5f2bbb89c929',
    DAI = '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3',
    DANGO = '0x0957c57c9eb7744850dcc95db5a06ed4a246236e',
    DEGO = '0x3fda9383a84c05ec8f7630fe10adf1fac13241cc',
    DEXE = '0x039cb485212f996a9dbb85a9a75d898f94d38da6',
    DICE = '0x748ad98b14c814b28812eb42ad219c8672909879',
    DITTO = '0x233d91a0713155003fc4dce0afa871b508b3b715',
    DODO = '0x67ee3cb086f8a16f34bee3ca72fad36f7db929e2',
    DOT = '0x7083609fce4d1d8dc0c979aab8c869ea2c873402',
    EGLD = '0xbf7c81fff98bbe61b40ed186e4afd6ddd01337fe',
    EOS = '0x56b6fb708fc5732dec1afc8d8556423a2edccbd6',
    ETH = '0x2170ed0880ac9a755fd29b2688956bd959f933f8',
    FIL = '0x0d8ce2a99bb6e3b7db580ed848240e4a0f9ae153',
    FOR = '0x658a109c5900bc6d2357c87549b651670e5b0539',
    FRIES = '0x393b312c01048b3ed2720bf1b090084c09e408a1',
    FRONT = '0x928e55dab735aa8260af3cedada18b5f70c72f1b',
    FUEL = '0x2090c8295769791ab7a3cf1cc6e0aa19f35e441a',
    HARD = '0xf79037f6f6be66832de4e7516be52826bc3cbcc4',
    Helmet = '0x948d2a81086a075b3130bac19e4c6dee1d2e3fe8',
    HGET = '0xc7d8d35eba58a0935ff2d5a33df105dd9f071731',
    INJ = '0xa2b726b1145a4773f68593cf171187d8ebe4d495',
    IOTX = '0x9678e42cebeb63f23197d726b29b1cb20d0064e5',
    JNTR = '0x3c037c4c2296f280bb318d725d0b454b76c199b9',
    JUV = '0xc40c9a843e1c6d01b7578284a9028854f6683b1b',
    KAVA = '0x5f88ab06e8dfe89df127b2430bba4af600866035',
    KUN = '0x1a2fb0af670d0234c2857fad35b789f8cb725584',
    LINA = '0x762539b45a1dcce3d36d080f74d1aed37844b878',
    LINK = '0xf8a0bf9cf54bb92f17374d9e9a321e6a111a51bd',
    LIT = '0xb59490ab09a0f526cc7305822ac65f2ab12f9723',
    LTC = '0x4338665cbb7b2485a8855a139b75d5e34ab0db94',
    LTO = '0x857b222fc79e1cbbf8ca5f78cb133d1b7cf34bbd',
    lUSD = '0x23e8a70534308a4aaf76fb8c32ec13d17a3bd89e',
    mAMZN = '0x3947b992dc0147d2d89df0392213781b04b25075',
    MATH = '0xf218184af829cf2b0019f8e6f0b2423498a36983',
    mGOOGL = '0x62d71b23bf15218c7d2d7e48dbbd9e9c650b173f',
    mNFLX = '0xa04f060077d90fe2647b61e4da4ad1f97d6649dc',
    mTSLA = '0xf215a127a196e3988c09d052e16bcfd365cd7aa3',
    NAR = '0xa1303e6199b319a891b79685f0537d289af1fc83',
    NULS = '0x8cd6e29d3686d24d3c2018cee54621ea0f89313b',
    NVT = '0xf0e406c49c63abf358030a299c0e00118c4c6ba5',
    NYA = '0xbfa0841f7a90c4ce6643f651756ee340991f99d5',
    OG = '0xf05e45ad22150677a017fbd94b84fbb63dc9b44c',
    ONT = '0xfd7b3a77848f1c2d67e05e54d78d174a0c850335',
    PROM = '0xaf53d56ff99f1322515e54fdde93ff8b3b7dafd5',
    PSG = '0xbc5609612b7c44bef426de600b5fd1379db2ecf1',
    QUSD = '0xb8c540d00dd0bf76ea12e4b4b95efc90804f924e',
    RAMP = '0x8519ea49c997f50ceffa444d240fb655e89248aa',
    REEF = '0xf21768ccbc73ea5b6fd3c687208a7c2def2d966e',
    renBTC = '0xfce146bf3146100cfe5db4129cf6c82b0ef4ad8c',
    renDOGE = '0xc3fed6eb39178a541d274e6fc748d48f0ca01cc3',
    renZEC = '0x695fd30af473f2960e81dc9ba7cb67679d35edb7',
    sBDO = '0x0d9319565be7f53cefe84ad201be3f40feae2740',
    SFP = '0xd41fdb03ba84762dd66a0af1a6c8540ff1ba5dfb',
    SPART = '0xe4ae305ebe1abe663f261bc00534067c80ad677c',
    STAX = '0x0da6ed8b13214ff28e9ca979dd37439e8a88f6c4',
    STM = '0x90df11a8cce420675e73922419e3f4f3fe13cccb',
    SUSHI = '0x947950bcc74888a40ffa2593c5798f11fc9124c4',
    SWGb = '0xe40255c5d7fa7ceec5120408c78c787cecb4cfdb',
    SWINGBY = '0x71de20e0c4616e7fcbfdd3f875d568492cbe4739',
    SXP = '0x47bead2563dcbf3bf2c9407fea4dc236faba485a',
    TEN = '0xdff8cb622790b7f92686c722b02cab55592f152c',
    TPT = '0xeca41281c24451168a37211f0bc2b8645af45092',
    TWT = '0x4b0f1812e5df2a09796481ff14017e6005508003',
    TXL = '0x1ffd0b47127fdd4097e54521c9e2c7f0d66aafc5',
    UNFI = '0x728c5bac3c3e370e372fc4671f9ef6916b814d8b',
    UNI = '0xbf5140a22578168fd562dccf235e5d43a02ce9b1',
    USDC = '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
    USDT = '0x55d398326f99059ff775485246999027b3197955',
    USDX = '0x1203355742e76875154c0d13eb81dcd7711dc7d9',
    UST = '0x23396cf899ca06c4472205fc903bdb4de249d6fc',
    VAI = '0x4bd17003473389a42daf6a0a729f6fdb328bbbd7',
    WATCH = '0x7a9f28eb62c791422aa23ceae1da9c847cbec9b0',
    WBNB = '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
    wSOTE = '0x541e619858737031a1244a5d0cd47e5ef480342c',
    xMARK = '0x26a5dfab467d4f58fb266648cae769503cec9580',
    XRP = '0x1d2f0da169ceb9fc7b3144628db156f3f6c60dbe',
    XTZ = '0x16939ef78684453bfdfb47825f8a5f714f12623a',
    XVS = '0xcf6bb5389c92bdda8a3747ddb454cb7a64626c63',
    YFI = '0x88f1a5ae2a3bf98aeaf342d26b30a79438c9142e',
    YFII = '0x7f70642d88cf1c4a3a7abb072b53b929b653eda5',
    ZEC = '0x1ba42e5193dfa8b03d15dd1b86a3113bbbef8eeb',
    ZEE = '0x44754455564474a89358b2c2265883df993b12f0'
}

export const EBscAddress = Object.fromEntries(
    Object.entries(EBscToken).map(k => k.reverse())
) as Record<string, string>;