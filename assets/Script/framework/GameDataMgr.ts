// import { E_ItemType } from "../ui/UI_Item";
import { levelNodeConfig } from "../config/Config";
import { ResourcesMgr } from "./ResourcesMgr";
import { TimeTool } from "./TimeTool";

export enum E_GameData_Type{
    Invalid = 0,
    /**当前点击关卡 */
    ClickPassLv = 1,
    /**token */
    AppToken = 2,
    /**当前关游戏积分 */
    CurScoreNum = 3,
    /**全部积分 */
    AllScoreNum = 4,
    /**当前最高关卡 */
    MaxlevelNum = 5,
    /**玩家ID */
    playerID = 6,
    /**玩家点击的物品 */
    playerClick = 7,
    
    
    /**背景音乐 是否 */
    IsHadAudio_BG = 220,
    /**音效 是否 */
    IsHadAudio_Eff = 230,
}

export const GameDataMgr = new class{
    /**游戏数据 */
    private m_mapGameData: Map<E_GameData_Type,any> = new Map();

    /**获取数据 */
    public getDataByType(eType: E_GameData_Type){
        if(this.m_mapGameData.has(eType)){
            return this.m_mapGameData.get(eType);
        }
    }
    /**设置数据 */
    public setDataByType(eType: E_GameData_Type, vaule){
        this.m_mapGameData.set(eType,vaule);
        let str = this.mapToJson(this.m_mapGameData);
        localStorage.setItem("GameData", str);
    }
    /**叠加数据 */
    public addDataByType(eType: E_GameData_Type, vaule: any, max?: any){
        let v = vaule;
        if(this.m_mapGameData.has(eType)){
            v = this.m_mapGameData.get(eType) + vaule;
        }
        if(max){
            v = Math.min(v,max);
        }
        
        this.m_mapGameData.set(eType, v);
        let str = this.mapToJson(this.m_mapGameData);
        localStorage.setItem("GameData", str);
    }
    /**减少数据 */
    public subDataByType(eType: E_GameData_Type, vaule: any, min?: any){
        let v = vaule;
        if(this.m_mapGameData.has(eType)){
            v = this.m_mapGameData.get(eType) - vaule;
        }
        if(min){
            v = Math.max(v,min);
        }
        
        this.m_mapGameData.set(eType, v);
        let str = this.mapToJson(this.m_mapGameData);
        localStorage.setItem("GameData", str);
    }

    /**加载本地数据 */
    public async loadLocalData(){
        let strData = localStorage.getItem("GameData");
        if(strData && strData.length > 0){
            this.m_mapGameData = this.jsonToMap(strData);
            this.setDataByType(E_GameData_Type.IsHadAudio_BG, true);
            this.setDataByType(E_GameData_Type.IsHadAudio_Eff, true);
            this.setDataByType(E_GameData_Type.MaxlevelNum, 31);
        }
        else{
            /**初始化数据 */
            this.setDataByType(E_GameData_Type.ClickPassLv, 0);
            this.setDataByType(E_GameData_Type.AppToken, "");
            this.setDataByType(E_GameData_Type.CurScoreNum, 1);
            this.setDataByType(E_GameData_Type.AllScoreNum, 1);
            this.setDataByType(E_GameData_Type.MaxlevelNum, 31);
            this.setDataByType(E_GameData_Type.playerID, "");
            this.setDataByType(E_GameData_Type.playerClick, 0);

            this.setDataByType(E_GameData_Type.IsHadAudio_BG, true);
            this.setDataByType(E_GameData_Type.IsHadAudio_Eff, true);
        }
        
    }
    /**map转为json */
    private mapToJson(m:Map<any, any>){
        let obj = Object.create(null);
        m.forEach((v, k)=>{
            obj["" + k] = v;
        })
        return JSON.stringify(obj);
    }
    /**json转为map */
    private jsonToMap(jsonStr){
        let str = JSON.parse(jsonStr);
        let strMap = new Map();
        for(let k of Object.keys(str)){
            strMap.set(Number(k),str[k]);
        }
        return strMap;
    }
}