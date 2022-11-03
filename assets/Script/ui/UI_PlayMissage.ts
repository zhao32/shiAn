import { audioConfig, GameMassage } from "../config/Config";
import { AudioMgr } from "../framework/AudioMgr";
import { E_GameData_Type, GameDataMgr } from "../framework/GameDataMgr";
import { UIManager } from "../framework/UIManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UI_PlayMissage extends cc.Component {


    // LIFE-CYCLE CALLBACKS:

    @property({
        type: cc.Label,
        tooltip: "名字 "
    })
    private nameTxt: cc.Label = null;


    @property({
        type: cc.Label,
        tooltip: "ID "
    })
    private idTxt: cc.Label = null;


    @property({
        type: cc.Label,
        tooltip: "地址 "
    })
    private addTxt: cc.Label = null;

    onLoad () {}

    onEnable(){
        this.nameTxt.string = GameMassage.name;
        this.idTxt.string = "ID：" +  GameMassage.cusid;
        this.addTxt.string = GameMassage.add;
    }

    // update (dt) {}

    /**返回点击点击*/
    private backBtnClick(){
        AudioMgr.playAudioEffect(audioConfig.WordClick);
        UIManager.closeUI(this.node.name);
    }

    /**音乐点击*/
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
}
