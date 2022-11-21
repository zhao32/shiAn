import { audioConfig, GameMassage } from "../config/Config";
import { AudioMgr } from "../framework/AudioMgr";
import { E_GameData_Type, GameDataMgr } from "../framework/GameDataMgr";
import { Observer } from "../framework/Observer";
import { UIManager } from "../framework/UIManager";
import UI_Base from "../framework/UI_Base";


const {ccclass, property} = cc._decorator;

@ccclass
export default class UI_Win extends cc.Component {


    onLoad () {
        // super.onLoad();
        this.node.zIndex = 5;
    }

    onEnable(){
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

    // private musicBool:boolean = true;
    private soundBtnClick(){
        AudioMgr.playAudioEffect(audioConfig.WordClick);
        if(GameMassage.musicBool){
            GameMassage.musicBool = false;
            // this.musicCloseBg.active = true;
            GameDataMgr.setDataByType(E_GameData_Type.IsHadAudio_BG, false);
            AudioMgr.pauseBGMusic();
        }else{
            GameMassage.musicBool = true;
            // this.musicCloseBg.active = false;
            GameDataMgr.setDataByType(E_GameData_Type.IsHadAudio_BG, true);
            AudioMgr.playBGMusic(audioConfig.M_BGMusic);
        }
    }

    /**重玩本关 */
    nextBtnClick(){
        UIManager.closeUI(this.node.name);
        let num = GameDataMgr.getDataByType(E_GameData_Type.ClickPassLv);
        console.log(num);
        if(num == 30){
            UIManager.closeUI(this.node.name);
            let lvStrB = "UI_Game4"+GameMassage.fourNum;
            UIManager.closeUI(lvStrB);
            let typeNum = Math.floor(Math.random()*5)+1;
            GameMassage.fourNum = typeNum;
            let lvStrA = "UI_Game4"+typeNum;
            UIManager.openUI(lvStrA);
        }else if(num >= 20 && num < 30){
            UIManager.closeUI(this.node.name);
            Observer.emit("bb");
            
        }else if(num ==31){
            UIManager.closeUI(this.node.name);
            Observer.emit("three")
        }
    }

    

    // update (dt) {}
}
