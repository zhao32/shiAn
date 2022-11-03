/**运行环境 */
export enum GamePlatform{
    /**本地测试环境 */
    Local = 0,
    /**开发测试环境 */
    Normal = 1,
};
/**当前运行环境 */
export const CurPlatform = GamePlatform.Local;
/**接口地址 */
export const ApiUrl = {
    // appUrl: "http://qmapp.vip.hnhxzkj.com,//测试地址
    appUrl: "https://qmapp.vip.hnhxzkj.com",//正式地址
};

/**关卡配置表 */
export const LevelConfig = {
    /**最大关卡 */
    RealMaxLv: 110,
}

/**控制显示*/
export var showBool = {
    /**是否显示 */
    showBool: false,
    /**是否显示 */
    showBoom: false,
}


/**就近判断数组 */
export const recordShopConfig = []

/**关卡配置表 */
export const sprShopElseConfig = [
    { gqID: 1, name: "", type:"", buytype:"2", buyprice:"1000", url: "ui_fight/sp/L1" },
    { gqID: 2, name: "", type:"", buytype:"2", buyprice:"1000",url: "ui_fight/sp/L2" },
    { gqID: 3, name: "", type:"", buytype:"1", buyprice:"1000",url: "ui_fight/sp/L3" },
    { gqID: 4, name: "", type:"", buytype:"2", buyprice:"1000",url: "ui_fight/sp/L4" },
    { gqID: 5, name: "", type:"", buytype:"2", buyprice:"1000",url: "ui_fight/sp/L5" },
    { gqID: 6, name: "", type:"", buytype:"2", buyprice:"1000",url: "ui_fight/sp/L6"},
    { gqID: 7, name: "", type:"", buytype:"1", buyprice:"1000",url: "ui_fight/sp/L7" },
    { gqID: 8, name: "", type:"", buytype:"2", buyprice:"1000",url: "ui_fight/sp/L8" },
    { gqID: 9, name: "", type:"", buytype:"2", buyprice:"1000",url: "ui_fight/sp/L9" },
    { gqID: 10, name: "", type:"", buytype:"2", buyprice:"1000",url: "ui_fight/sp/L10"},
    { gqID: 11, name: "", type:"", buytype:"2", buyprice:"1000", url: "ui_fight/sp/L11" },
    { gqID: 12, name: "", type:"", buytype:"1", buyprice:"1000",url: "ui_fight/sp/L12" },
    { gqID: 13, name: "", type:"", buytype:"1", buyprice:"1000",url: "ui_fight/sp/L13" },
    { gqID: 14, name: "", type:"", buytype:"1", buyprice:"1000",url: "ui_fight/sp/L14" },
    { gqID: 15, name: "", type:"", buytype:"2", buyprice:"1000",url: "ui_fight/sp/L15" },
    { gqID: 16, name: "", type:"", buytype:"2", buyprice:"1000",url: "ui_fight/sp/L16"},
    { gqID: 17, name: "", type:"", buytype:"2", buyprice:"1000",url: "ui_fight/sp/L17" },
    { gqID: 18, name: "", type:"", buytype:"2", buyprice:"1000",url: "ui_fight/sp/L18" },
    { gqID: 19, name: "", type:"", buytype:"2", buyprice:"1000",url: "ui_fight/sp/L19" },
    { gqID: 20, name: "", type:"", buytype:"2", buyprice:"1000",url: "ui_fight/sp/L20"},
    { gqID: 21, name: "", type:"", buytype:"2", buyprice:"1000", url: "ui_fight/sp/L21" },
    { gqID: 22, name: "", type:"", buytype:"1", buyprice:"1000",url: "ui_fight/sp/L22" },
    { gqID: 23, name: "", type:"", buytype:"1", buyprice:"1000",url: "ui_fight/sp/L23" },
    { gqID: 24, name: "", type:"", buytype:"1", buyprice:"1000",url: "ui_fight/sp/L24" },
    { gqID: 25, name: "", type:"", buytype:"2", buyprice:"1000",url: "ui_fight/sp/L25" },
    { gqID: 26, name: "", type:"", buytype:"2", buyprice:"1000",url: "ui_fight/sp/L26"},
    { gqID: 27, name: "", type:"", buytype:"2", buyprice:"1000",url: "ui_fight/sp/L27" },
    { gqID: 28, name: "", type:"", buytype:"2", buyprice:"1000",url: "ui_fight/sp/L28" },
    { gqID: 29, name: "", type:"", buytype:"2", buyprice:"1000",url: "ui_fight/sp/L29" },
    { gqID: 30, name: "", type:"", buytype:"2", buyprice:"1000",url: "ui_fight/sp/L30"},
    { gqID: 31, name: "", type:"", buytype:"2", buyprice:"1000", url: "ui_fight/sp/L31" },
    { gqID: 32, name: "", type:"", buytype:"1", buyprice:"1000",url: "ui_fight/sp/L32" },
];

/**保存选择商品ID */
export const goodsIdConfig = [
    0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0
]

/**保存商品 */
export const GoodsConfig = [
]

/**保存排行榜 */
export const RankConfig = [

]

/**Node */
export const letNodeConfig = [
    
]


/**num */
export let GameMassage = {
    /**num */
    num : 0,
    name:"",
    cusid:"",
    add:"",
    isLevel:false,
    fourNum : 1,
}

/**Node */
export const levelNodeConfig = [
    
]

/**音效配置表 */
export const audioConfig = {
    /**主页面背景音乐 */
    M_BGMusic: "audio/M_BGMusic",
    /**字点击音效 */
    WordClick: "audio/Click3",
    /**主页面背景音乐 */
    cwSound: "audio/cw",
    /**字点击音效 */
    zqSound: "audio/zq",
    /**点击音效 */
    yxSound1: "audio/Click1",
    /**点击音效 */
    yxSound2: "audio/Click2",
    /**点击音效 */
    yxSound3: "audio/Click3",
    /**点击音效 */
    yxSound4: "audio/Click4",

}