// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { audioConfig, GameMassage } from "../config/Config";
import { AudioMgr } from "../framework/AudioMgr";
import { E_GameData_Type, GameDataMgr } from "../framework/GameDataMgr";
import { NetWork } from "../framework/NetWork";
import { Observer } from "../framework/Observer";
import { UIManager } from "../framework/UIManager";
import GameUtil from "./GameUtil";
import UI_Tip from "./UI_Tip";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    btnNext: cc.Node = null;

    @property(cc.Node)
    star0: cc.Node = null;

    @property(cc.Node)
    star1: cc.Node = null;

    @property(cc.Node)
    star2: cc.Node = null;

    @property(cc.Label)
    scoreDisplay: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.zIndex = 6;
        // Observer.on("time",function(time:any){
        //     this.init(time);
        // },this);
    }

    start() {
        this.btnNext.on(cc.Node.EventType.TOUCH_END, () => {
            console.log('关闭胜利窗口')

            if (GameUtil.CURLEVEL == 9) {
                // alert('通关')
                this.node.destroy()
                cc.find("Canvas").getChildByName("level9").destroy()

                UIManager.openUI("UI_GameTwo");
                return
            }

            let str = "level" + GameUtil.CURLEVEL;
            cc.find("Canvas").getChildByName(str).destroy();
            
            GameUtil.CURLEVEL += 1
            console.log(GameUtil.CURLEVEL);
            GameUtil.instance.loadPage()
            this.node.destroy()
        }, this)
    }

    private scoreShow(star:number){
        console.log("加星星：" + star);
        let le = GameDataMgr.getDataByType(E_GameData_Type.MaxlevelNum);
        let lv = GameDataMgr.getDataByType(E_GameData_Type.ClickPassLv);
        console.log("加星星：" + le);
        console.log("加星星：" + lv);
            if(lv<=le){
                GameDataMgr.addDataByType(E_GameData_Type.ClickPassLv,1,31);
                if(lv==le){
                    le+=1;
                    GameDataMgr.addDataByType(E_GameData_Type.MaxlevelNum,1,31);
                    NetWork.setScoreMessage(star,le,1,(res)=>{
                        if(res){
                            console.log("加分成功");
                            UI_Tip.Instance.showTip("获得积分成功");
                            Observer.emit("levelShow");
                        }
                    })
                }else{
                    NetWork.setScoreMessage(star,le,1,(res)=>{
                        if(res){
                            console.log("加分成功");
                            UI_Tip.Instance.showTip("获得积分成功");
                        }
                    })
                }
            }
    }

    /**剩余时间 */
    init(time) {
        if (time >= 20) {
            this.star0.active = this.star1.active = this.star2.active = false
            this.scoreDisplay.string = '3'
            this.scoreShow(3);
        } else if (time >= 10 && time < 20) {
            this.star0.active = this.star1.active =  false
            this.scoreDisplay.string = '2'
            this.scoreShow(2);
        } else if (time > 0 && time < 10) {
            this.star0.active = this.star1.active =  false
            this.scoreDisplay.string = '1'
            this.scoreShow(1);
        // } else {
        //     this.star0.active =  false
        //     this.scoreDisplay.string = '1'
        // }
        }  
    }

    /**返回点击点击*/
    private backBtnClick(){
        AudioMgr.playAudioEffect(audioConfig.WordClick);
        // UIManager.closeUI(this.node.name);
        this.node.destroy()
        let aa = "level" + GameUtil.CURLEVEL
        cc.find("Canvas").getChildByName(aa).destroy()
        // UIManager.closeAllUI()
        // UIManager.closeUI("UI_Level");
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
