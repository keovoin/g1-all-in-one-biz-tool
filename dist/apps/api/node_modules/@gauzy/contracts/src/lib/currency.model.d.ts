import { IBaseEntityModel } from './base-entity.model';
export interface ICurrency extends IBaseEntityModel {
    isoCode: string;
    currency: string;
}
export declare const DEFAULT_CURRENCIES: {
    AFN: string;
    AFA: string;
    ALL: string;
    ALK: string;
    DZD: string;
    ADP: string;
    AOA: string;
    AOK: string;
    AON: string;
    AOR: string;
    ARA: string;
    ARS: string;
    ARM: string;
    ARP: string;
    ARL: string;
    AMD: string;
    AWG: string;
    AUD: string;
    ATS: string;
    AZN: string;
    AZM: string;
    BSD: string;
    BHD: string;
    BDT: string;
    BBD: string;
    BYN: string;
    BYB: string;
    BYR: string;
    BEF: string;
    BEC: string;
    BEL: string;
    BZD: string;
    BMD: string;
    BTN: string;
    BOB: string;
    BOL: string;
    BOV: string;
    BOP: string;
    BAM: string;
    BAD: string;
    BAN: string;
    BWP: string;
    BRC: string;
    BRZ: string;
    BRE: string;
    BRR: string;
    BRN: string;
    BRB: string;
    BRL: string;
    GBP: string;
    BND: string;
    BGL: string;
    BGN: string;
    BGO: string;
    BGM: string;
    BUK: string;
    BIF: string;
    XPF: string;
    KHR: string;
    CAD: string;
    CVE: string;
    KYD: string;
    XAF: string;
    CLE: string;
    CLP: string;
    CLF: string;
    CNX: string;
    CNY: string;
    COP: string;
    COU: string;
    KMF: string;
    CDF: string;
    CRC: string;
    HRD: string;
    HRK: string;
    CUC: string;
    CUP: string;
    CYP: string;
    CZK: string;
    CSK: string;
    DKK: string;
    DJF: string;
    DOP: string;
    NLG: string;
    XCD: string;
    DDM: string;
    ECS: string;
    ECV: string;
    EGP: string;
    GQE: string;
    ERN: string;
    EEK: string;
    ETB: string;
    EUR: string;
    XEU: string;
    FKP: string;
    FJD: string;
    FIM: string;
    FRF: string;
    XFO: string;
    XFU: string;
    GMD: string;
    GEK: string;
    GEL: string;
    DEM: string;
    GHS: string;
    GHC: string;
    GIP: string;
    GRD: string;
    GTQ: string;
    GWP: string;
    GNF: string;
    GNS: string;
    GYD: string;
    HTG: string;
    HNL: string;
    HKD: string;
    HUF: string;
    ISK: string;
    ISJ: string;
    INR: string;
    IDR: string;
    IRR: string;
    IQD: string;
    IEP: string;
    ILS: string;
    ILP: string;
    ILR: string;
    ITL: string;
    JMD: string;
    JPY: string;
    JOD: string;
    KZT: string;
    KES: string;
    KWD: string;
    KGS: string;
    LAK: string;
    LVL: string;
    LVR: string;
    LBP: string;
    LSL: string;
    LRD: string;
    LYD: string;
    LTL: string;
    LTT: string;
    LUL: string;
    LUC: string;
    LUF: string;
    MOP: string;
    MKD: string;
    MKN: string;
    MGA: string;
    MGF: string;
    MWK: string;
    MYR: string;
    MVR: string;
    MVP: string;
    MLF: string;
    MTL: string;
    MTP: string;
    MRO: string;
    MUR: string;
    MXV: string;
    MXN: string;
    MXP: string;
    MDC: string;
    MDL: string;
    MCF: string;
    MNT: string;
    MAD: string;
    MAF: string;
    MZE: string;
    MZN: string;
    MZM: string;
    MMK: string;
    NAD: string;
    NPR: string;
    ANG: string;
    TWD: string;
    NZD: string;
    NIO: string;
    NIC: string;
    NGN: string;
    KPW: string;
    NOK: string;
    OMR: string;
    PKR: string;
    PAB: string;
    PGK: string;
    PYG: string;
    PEI: string;
    PEN: string;
    PES: string;
    PHP: string;
    PLN: string;
    PLZ: string;
    PTE: string;
    GWE: string;
    QAR: string;
    XRE: string;
    RHD: string;
    RON: string;
    ROL: string;
    RUB: string;
    RUR: string;
    RWF: string;
    SVC: string;
    WST: string;
    SAR: string;
    RSD: string;
    CSD: string;
    SCR: string;
    SLL: string;
    SGD: string;
    SKK: string;
    SIT: string;
    SBD: string;
    SOS: string;
    ZAR: string;
    ZAL: string;
    KRH: string;
    KRW: string;
    KRO: string;
    SSP: string;
    SUR: string;
    ESP: string;
    ESA: string;
    ESB: string;
    LKR: string;
    SHP: string;
    SDD: string;
    SDG: string;
    SDP: string;
    SRD: string;
    SRG: string;
    SZL: string;
    SEK: string;
    CHF: string;
    SYP: string;
    STD: string;
    TJR: string;
    TJS: string;
    TZS: string;
    THB: string;
    TPE: string;
    TOP: string;
    TTD: string;
    TND: string;
    TRY: string;
    TRL: string;
    TMT: string;
    TMM: string;
    USD: string;
    USN: string;
    USS: string;
    UGX: string;
    UGS: string;
    UAH: string;
    UAK: string;
    AED: string;
    UYU: string;
    UYP: string;
    UYI: string;
    UZS: string;
    VUV: string;
    VEF: string;
    VEB: string;
    VND: string;
    VNN: string;
    CHE: string;
    CHW: string;
    XOF: string;
    YDD: string;
    YER: string;
    YUN: string;
    YUD: string;
    YUM: string;
    YUR: string;
    ZRN: string;
    ZRZ: string;
    ZMW: string;
    ZMK: string;
    ZWD: string;
    ZWR: string;
    ZWL: string;
};
export declare enum CurrenciesEnum {
    AFN = "AFN",
    AFA = "AFA",
    ALL = "ALL",
    ALK = "ALK",
    DZD = "DZD",
    ADP = "ADP",
    AOA = "AOA",
    AOK = "AOK",
    AON = "AON",
    AOR = "AOR",
    ARA = "ARA",
    ARS = "ARS",
    ARM = "ARM",
    ARP = "ARP",
    ARL = "ARL",
    AMD = "AMD",
    AWG = "AWG",
    AUD = "AUD",
    ATS = "ATS",
    AZN = "AZN",
    AZM = "AZM",
    BSD = "BSD",
    BHD = "BHD",
    BDT = "BDT",
    BBD = "BBD",
    BYN = "BYN",
    BYB = "BYB",
    BYR = "BYR",
    BEF = "BEF",
    BEC = "BEC",
    BEL = "BEL",
    BZD = "BZD",
    BMD = "BMD",
    BTN = "BTN",
    BOB = "BOB",
    BOL = "BOL",
    BOV = "BOV",
    BOP = "BOP",
    BAM = "BAM",
    BAD = "BAD",
    BAN = "BAN",
    BWP = "BWP",
    BRC = "BRC",
    BRZ = "BRZ",
    BRE = "BRE",
    BRR = "BRR",
    BRN = "BRN",
    BRB = "BRB",
    BRL = "BRL",
    GBP = "GBP",
    BND = "BND",
    BGL = "BGL",
    BGN = "BGN",
    BGO = "BGO",
    BGM = "BGM",
    BUK = "BUK",
    BIF = "BIF",
    XPF = "XPF",
    KHR = "KHR",
    CAD = "CAD",
    CVE = "CVE",
    KYD = "KYD",
    XAF = "XAF",
    CLE = "CLE",
    CLP = "CLP",
    CLF = "CLF",
    CNX = "CNX",
    CNY = "CNY",
    COP = "COP",
    COU = "COU",
    KMF = "KMF",
    CDF = "CDF",
    CRC = "CRC",
    HRD = "HRD",
    HRK = "HRK",
    CUC = "CUC",
    CUP = "CUP",
    CYP = "CYP",
    CZK = "CZK",
    CSK = "CSK",
    DKK = "DKK",
    DJF = "DJF",
    DOP = "DOP",
    NLG = "NLG",
    XCD = "XCD",
    DDM = "DDM",
    ECS = "ECS",
    ECV = "ECV",
    EGP = "EGP",
    GQE = "GQE",
    ERN = "ERN",
    EEK = "EEK",
    ETB = "ETB",
    EUR = "EUR",
    XEU = "XEU",
    FKP = "FKP",
    FJD = "FJD",
    FIM = "FIM",
    FRF = "FRF",
    XFO = "XFO",
    XFU = "XFU",
    GMD = "GMD",
    GEK = "GEK",
    GEL = "GEL",
    DEM = "DEM",
    GHS = "GHS",
    GHC = "GHC",
    GIP = "GIP",
    GRD = "GRD",
    GTQ = "GTQ",
    GWP = "GWP",
    GNF = "GNF",
    GNS = "GNS",
    GYD = "GYD",
    HTG = "HTG",
    HNL = "HNL",
    HKD = "HKD",
    HUF = "HUF",
    ISK = "ISK",
    ISJ = "ISJ",
    INR = "INR",
    IDR = "IDR",
    IRR = "IRR",
    IQD = "IQD",
    IEP = "IEP",
    ILS = "ILS",
    ILP = "ILP",
    ILR = "ILR",
    ITL = "ITL",
    JMD = "JMD",
    JPY = "JPY",
    JOD = "JOD",
    KZT = "KZT",
    KES = "KES",
    KWD = "KWD",
    KGS = "KGS",
    LAK = "LAK",
    LVL = "LVL",
    LVR = "LVR",
    LBP = "LBP",
    LSL = "LSL",
    LRD = "LRD",
    LYD = "LYD",
    LTL = "LTL",
    LTT = "LTT",
    LUL = "LUL",
    LUC = "LUC",
    LUF = "LUF",
    MOP = "MOP",
    MKD = "MKD",
    MKN = "MKN",
    MGA = "MGA",
    MGF = "MGF",
    MWK = "MWK",
    MYR = "MYR",
    MVR = "MVR",
    MVP = "MVP",
    MLF = "MLF",
    MTL = "MTL",
    MTP = "MTP",
    MRO = "MRO",
    MUR = "MUR",
    MXV = "MXV",
    MXN = "MXN",
    MXP = "MXP",
    MDC = "MDC",
    MDL = "MDL",
    MCF = "MCF",
    MNT = "MNT",
    MAD = "MAD",
    MAF = "MAF",
    MZE = "MZE",
    MZN = "MZN",
    MZM = "MZM",
    MMK = "MMK",
    NAD = "NAD",
    NPR = "NPR",
    ANG = "ANG",
    TWD = "TWD",
    NZD = "NZD",
    NIO = "NIO",
    NIC = "NIC",
    NGN = "NGN",
    KPW = "KPW",
    NOK = "NOK",
    OMR = "OMR",
    PKR = "PKR",
    PAB = "PAB",
    PGK = "PGK",
    PYG = "PYG",
    PEI = "PEI",
    PEN = "PEN",
    PES = "PES",
    PHP = "PHP",
    PLN = "PLN",
    PLZ = "PLZ",
    PTE = "PTE",
    GWE = "GWE",
    QAR = "QAR",
    XRE = "XRE",
    RHD = "RHD",
    RON = "RON",
    ROL = "ROL",
    RUB = "RUB",
    RUR = "RUR",
    RWF = "RWF",
    SVC = "SVC",
    WST = "WST",
    SAR = "SAR",
    RSD = "RSD",
    CSD = "CSD",
    SCR = "SCR",
    SLL = "SLL",
    SGD = "SGD",
    SKK = "SKK",
    SIT = "SIT",
    SBD = "SBD",
    SOS = "SOS",
    ZAR = "ZAR",
    ZAL = "ZAL",
    KRH = "KRH",
    KRW = "KRW",
    KRO = "KRO",
    SSP = "SSP",
    SUR = "SUR",
    ESP = "ESP",
    ESA = "ESA",
    ESB = "ESB",
    LKR = "LKR",
    SHP = "SHP",
    SDD = "SDD",
    SDG = "SDG",
    SDP = "SDP",
    SRD = "SRD",
    SRG = "SRG",
    SZL = "SZL",
    SEK = "SEK",
    CHF = "CHF",
    SYP = "SYP",
    STD = "STD",
    TJR = "TJR",
    TJS = "TJS",
    TZS = "TZS",
    THB = "THB",
    TPE = "TPE",
    TOP = "TOP",
    TTD = "TTD",
    TND = "TND",
    TRY = "TRY",
    TRL = "TRL",
    TMT = "TMT",
    TMM = "TMM",
    USD = "USD",
    USN = "USN",
    USS = "USS",
    UGX = "UGX",
    UGS = "UGS",
    UAH = "UAH",
    UAK = "UAK",
    AED = "AED",
    UYU = "UYU",
    UYP = "UYP",
    UYI = "UYI",
    UZS = "UZS",
    VUV = "VUV",
    VEF = "VEF",
    VEB = "VEB",
    VND = "VND",
    VNN = "VNN",
    CHE = "CHE",
    CHW = "CHW",
    XOF = "XOF",
    YDD = "YDD",
    YER = "YER",
    YUN = "YUN",
    YUD = "YUD",
    YUM = "YUM",
    YUR = "YUR",
    ZRN = "ZRN",
    ZRZ = "ZRZ",
    ZMW = "ZMW",
    ZMK = "ZMK",
    ZWD = "ZWD",
    ZWR = "ZWR",
    ZWL = "ZWL"
}
