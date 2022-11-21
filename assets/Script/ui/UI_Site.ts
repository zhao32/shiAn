import { audioConfig, GameMassage } from "../config/Config";
import { AudioMgr } from "../framework/AudioMgr";
import { E_GameData_Type, GameDataMgr } from "../framework/GameDataMgr";
import { NetWork } from "../framework/NetWork";
import { Observer } from "../framework/Observer";
import { UIManager } from "../framework/UIManager";
import UI_Tip from "./UI_Tip";


const {ccclass, property} = cc._decorator;

@ccclass
export default class UI_Site extends cc.Component {


    // LIFE-CYCLE CALLBACKS:
    @property({
        type: cc.EditBox,
        tooltip: "name",
    })
    private nameTxt: cc.EditBox = null;

    @property({
        type: cc.EditBox,
        tooltip: "dianhua",
    })
    private iphonTxt: cc.EditBox = null;

    @property({
        type: cc.EditBox,
        tooltip: "dizhi",
    })
    private addTxt: cc.EditBox = null;

    @property({
        type: cc.EditBox,
        tooltip: "beizhu",
    })
    private bzTxt: cc.EditBox = null;

    onLoad () {}

    // start () {

    // }

    /**返回点击点击*/
    private backBtnClick(){
        UIManager.closeUI(this.node.name);
    }

    /**提交点击*/
    private cominBtnClick(){
        let a = this.nameTxt.string;
        let b = this.iphonTxt.string;
        let c = this.addTxt.string;
        let d = this.bzTxt.string;
        let clickNum =  GameDataMgr.getDataByType(E_GameData_Type.playerClick);
        NetWork.getAddressMessage(0,a,b,c,d,(res,msg)=>{
            // let aa = msg+"";
            if(res){
                // UI_Tip.Instance.showTip(aa);
                NetWork.buyGoodsMessage(clickNum,1,c,(res,msg)=>{
                    // let bb = msg+"";
                    if(res){
                        UI_Tip.Instance.showTip("兑换商品提交成功");
                        UIManager.closeUI(this.node.name);
                    }else{
                        UI_Tip.Instance.showTip("兑换商品提交成功");
                        Observer.emit("gold");
                    }
                })
                
            }else{
                // UI_Tip.Instance.showTip(aa);
            }
        })
        
    }

    /**音乐点击*/
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


    // update (dt) {}
}
