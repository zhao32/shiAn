import { audioConfig, CurPlatform, GamePlatform } from "../config/Config";
import { AudioMgr } from "./AudioMgr";
import { E_GameData_Type, GameDataMgr } from "./GameDataMgr";
// import { NetWork } from "./NetWork";
import { ResourcesMgr } from "./ResourcesMgr";
import { UIManager } from "./UIManager";

const {ccclass, property} = cc._decorator;

export enum E_ClientState{
    /**无效 */
    Invalid = 0,
    /**预加载 */
    Init = 1,
    /**所有数据准备齐*/
    Ready = 2,
}
@ccclass
export default class GameClient extends cc.Component {

    /**单例 */
    public static Instance: GameClient = null;

    /**是否准备就绪 */
    public static isReady: boolean = false;

    /**流程状态引用计数*/
    private m_StateCount = 0;

    /**当前状态 */
    private curClientState: E_ClientState = E_ClientState.Invalid;

    onLoad(){
        GameClient.Instance = this;
        cc.game.addPersistRootNode(this.node);
        cc.game.setFrameRate(30);

        GameClient.isReady = false;
        
        UIManager.setRoot(this.node);
        UIManager.openUI("UI_Loading");
        
        this.setState(E_ClientState.Init);
    }

    

    private async init_1(){
        if(CurPlatform == GamePlatform.Local){
            console.log("运行环境  本地运行1");
            GameDataMgr.loadLocalData();
        }
        else{
            console.log("运行环境  非本地运行1");
            /**加载分包 */
            let subPackages = ["bundle_1", "bundle_2", "bundle_3"];
            this.SetStateCount(subPackages.length);
            this.SetStateCount(-1);
            GameDataMgr.loadLocalData();
        }
    }

    /**帧循环 */
    update(dt: number) {
        switch (this.curClientState) {
            case E_ClientState.Init:
                this.Update_Init();
                break;
            case E_ClientState.Ready:
                break;
        }
    }
    private Update_Init() {
        if (this.m_StateCount == 0)
            this.setState(E_ClientState.Ready);
    }

    /**设置计数器 */
    SetStateCount(count: number) {
        this.m_StateCount += count;
    };

    /**设置状态 */
    setState(state: E_ClientState){
        if(state == this.curClientState) return;
        this.curClientState = state;
        switch (state) {
            case E_ClientState.Invalid:
                break;
            case E_ClientState.Init:
                console.log("进入  Init");
                this.init();
                break;
            case E_ClientState.Ready:
                console.log("进入  Ready");
                this.ready();
                break;
            default:
                break;
        }
    }

    /**所有数据准备齐 */
    ready(){
        AudioMgr.playBGMusic(audioConfig.M_BGMusic);
        // // let token = GameDataMgr.getDataByType(E_GameData_Type.AppToken);
        // // if(token != null && token != "" && token != undefined){
        // UIManager.openUI("UI_Level");
        // }else{
            UIManager.openUI("UI_Login");
        // }
    }

    /**初始化 */
    private async init(){
        if(CurPlatform == GamePlatform.Local){
            console.log("运行环境  本地运行");
            GameDataMgr.loadLocalData();
        }
        else{
            console.log("运行环境  非本地运行");
            /**加载分包 */
            let subPackages = ["bundle_1", "bundle_2", "bundle_3"];
            this.SetStateCount(subPackages.length);
            for(let i = 0;i < subPackages.length;i++){
                await ResourcesMgr.loadSubpackage(subPackages[i])
                        .then(() => {
                            this.SetStateCount(-1);
                        })
            }
            this.SetStateCount(-1);
            GameDataMgr.loadLocalData();

            // ADManager.initAD();
            // NetWork.getCode();
        }
    }
}
