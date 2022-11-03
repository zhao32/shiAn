import { audioConfig, GameMassage } from "../config/Config";
import { AudioMgr } from "../framework/AudioMgr";
import { E_GameData_Type, GameDataMgr } from "../framework/GameDataMgr";
import { Observer } from "../framework/Observer";
import { UIManager } from "../framework/UIManager";
import UI_Base from "../framework/UI_Base";
import UI_Tip from "./UI_Tip";


const {ccclass, property} = cc._decorator;

@ccclass
export default class UI_Win extends cc.Component {

    @property({
        type:cc.Label,
        tooltip: "积分",
    })
    private jfTxt:cc.Label = null;

    @property({
        type:cc.Node,
        tooltip: "星星",
    })
    private xxNode1:cc.Node = null;

    @property({
        type:cc.Node,
        tooltip: "星星",
    })
    private xxNode2:cc.Node = null;

    @property({
        type:cc.Node,
        tooltip: "星星",
    })
    private xxNode3:cc.Node = null;

    onLoad () {
        // super.onLoad();
        this.node.zIndex = 5;
    }

    onEnable(){
        // super.onEnable();
        
        this.xxNode1.active = false;
        this.xxNode2.active = false;
        this.xxNode3.active = false;
        let aNum = GameDataMgr.getDataByType(E_GameData_Type.CurScoreNum);
        this.jfTxt.string = aNum + ""
        if(aNum==1){
            this.xxNode2.active = true;
            this.xxNode3.active = true;
        }else if(aNum==2){
            this.xxNode3.active = true;
        }else if(aNum==3){
            // this.xxNode3.active = true;
        }
    }

    /**关闭点击 */
    backBtnClick(){
        AudioMgr.playAudioEffect(audioConfig.WordClick);
        UIManager.closeUI(this.node.name);
        let lvStr = "UI_Game4"+GameMassage.fourNum;
        UIManager.closeUI(lvStr);
        UIManager.closeUI("UI_GameThree1");
        UIManager.closeUI("UI_GameTwo");
        UIManager.openUI("UI_Level");
    }

    private musicBool:boolean = true;
    private soundBtnClick(){
        AudioMgr.playAudioEffect(audioConfig.WordClick);
        if(this.musicBool){
            this.musicBool = false;
            // this.musicCloseBg.active = true;
            GameDataMgr.setDataByType(E_GameData_Type.IsHadAudio_BG, false);
            AudioMgr.pauseBGMusic();
        }else{
            this.musicBool = true;
            // this.musicCloseBg.active = false;
            GameDataMgr.setDataByType(E_GameData_Type.IsHadAudio_BG, true);
            AudioMgr.playBGMusic(audioConfig.M_BGMusic);
        }
    }

    /**下一关点击 */
    nextBtnClick(){
        AudioMgr.playAudioEffect(audioConfig.WordClick);
        let num = GameDataMgr.getDataByType(E_GameData_Type.ClickPassLv);
        console.log(num);
        if(num == 30){
            let typeNum = Math.floor(Math.random()*5)+1;
            GameMassage.fourNum = typeNum;
            let lvStr = "UI_Game4"+typeNum;
            UIManager.closeUI(this.node.name);
            UIManager.closeUI("UI_GameTwo");
            UIManager.openUI(lvStr);
        }else if(num == 31){
            console.log("32关")
            UIManager.closeUI(this.node.name);
            let lvStr = "UI_Game4"+GameMassage.fourNum;
            UIManager.closeUI(lvStr);
            UIManager.openUI("UI_GameThree");
        }else if(num >= 20 && num < 30){
            UIManager.closeUI(this.node.name);
            UIManager.openUI("UI_GameTwo");
            Observer.emit("bb");
        }else if(num >=32){
            UIManager.closeUI(this.node.name);
            UIManager.closeUI("UI_GameThree1");
            UIManager.openUI("UI_Level");
            UI_Tip.Instance.showTip("恭喜你已经通关");
        }
    }

    

    // update (dt) {}
}
