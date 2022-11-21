import { audioConfig, GameMassage, letNodeConfig, levelNodeConfig } from "../config/Config";
import { AudioMgr } from "../framework/AudioMgr";
import { E_GameData_Type, GameDataMgr } from "../framework/GameDataMgr";
import { NetWork } from "../framework/NetWork";
import { Observer } from "../framework/Observer";
import { ResourcesMgr } from "../framework/ResourcesMgr";
import { UIManager } from "../framework/UIManager";
import UI_Base from "../framework/UI_Base";
import GameUtil from "./GameUtil";
import UI_Tip from "./UI_Tip";


const {ccclass, property} = cc._decorator;

@ccclass
export default class UI_Level extends cc.Component {


    @property({
        type: cc.Node,
        tooltip: "关卡concont"
    })
    private content: cc.Node = null;

    @property({
        type: cc.Animation,
        tooltip: "云朵动画"
    })
    private yunAni: cc.Animation = null;

    @property({
        type: cc.Node,
        tooltip: "遮罩Node",
    })
    private maskNode: cc.Node = null;

    @property({
        type: cc.Node,
        tooltip: "个人中心Node",
    })
    private contreNode: cc.Node = null;



    private maxLevel:number = 32;

    // private levBoolArr = [false,false,false,false,false,false,false,false,false,false,
    //                     false,false,false,false,false,false,false,false,false,false,
    //                     false,false,false,false,false,false,false,false,false,false,
    //                     false,false,false,false,false]

    private levBoolArr = [true,true,true,true,true,true,true,true,true,true,
        true,true,true,true,true,true,true,true,true,true,
        true,true,true,true,true,true,true,true,true,true,
        true,true,true,true,true]

    onLoad () {
        this.init();
        Observer.on("levelShow",this.initShow,this);
        
    }
    onEnable(){
        
    }

    onDestroy(){
        Observer.off("levelShow");
    }

    init(){
        
        this.maskNode.x = 0;
        this.contreNode.active = false
        let levNum = GameDataMgr.getDataByType(E_GameData_Type.MaxlevelNum);
        console.log("TTTTTTTTT" + levNum);
        for (let a = 0; a < 32; a++) {
            let clB = "gqBtn" + (a+1);
            if(a<(levNum+1)){
                let spr = this.content.getChildByName(clB).getComponent(cc.Sprite);
                // let url = "ui_zi/gq" + (a+1);
                // ResourcesMgr.loadSpriteFrame(url, (frame)=>{
                    spr.spriteFrame = levelNodeConfig[a];
                // })
                // this.content.getChildByName(clB).on(cc.Node.EventType.TOUCH_START,this.levelBtnClick,this)
            }

            // let scaleDownAction = cc.scaleTo(0.1, 1.05 );
            // let scaleUpnAction = cc.scaleTo(0.1, 1 );

            // this.content.getChildByName(clB).stopAllActions();
            // // AudioManager.instance.playSound(EnumManager.AudioPath.click, false, 1)
            // this.content.getChildByName(clB).runAction(cc.sequence(scaleDownAction,scaleUpnAction));
            this.content.getChildByName(clB).on(cc.Node.EventType.TOUCH_START,this.levelBtnClick,this)
        }

        setTimeout(() => {
            this.yunAni.play("yun");
            this.maskNode.x = -800;
        }, 300);
    }

    //更新关卡数据
    initShow(){
        NetWork.getScoreMessage((res)=>{
            if(res){
                let lev = GameDataMgr.getDataByType(E_GameData_Type.MaxlevelNum);
                console.log(lev);
                if(lev<=31){
                    let clB = "gqBtn" + (lev+1);
                    let spr = this.content.getChildByName(clB).getComponent(cc.Sprite);
                    // let url = "ui_zi/gq" + levNum;
                    // ResourcesMgr.loadSpriteFrame(url, (frame)=>{
                    //     spr.spriteFrame = frame;
                    // })
                    spr.spriteFrame = levelNodeConfig[lev];
                }
            }
        })
    }

    //返回按钮点击
    backBtnClick(){
        AudioMgr.playAudioEffect(audioConfig.WordClick);
        UIManager.closeUI("UI_Level");
    }

    //关卡点击
    private levNum:number = 0;
    private templvBool:boolean = false;
    private levelBtnClick(event){
        AudioMgr.playAudioEffect(audioConfig.WordClick);
        if(!this.templvBool){
            this.templvBool = true
            let self = this;
            self.levNum = GameDataMgr.getDataByType(E_GameData_Type.MaxlevelNum);
            console.log("关卡Q"+self.levNum);
            let propName =  event.target.name;
            console.log("名字"+propName);
            let thId = propName.substr(5);
            console.log("ID"+thId);
            let idNum = Number(thId-1);
            GameDataMgr.setDataByType(E_GameData_Type.ClickPassLv, idNum);
            // if(idNum<=self.levNum){
                this.levelPageShow(idNum)
            // }else{
            //     UI_Tip.Instance.showTip("当前关卡未解锁");
            // }
            setTimeout(() => {
                this.templvBool = false;
            }, 1000);
        }
        
        
    }

    //关卡界面显示
    private levelPageShow(num){
        console.log(num);
        if(num == 31){
            UIManager.openUI("UI_GameThree1");
        }else if(num == 30 ){
            let typeNum = Math.floor(Math.random()*5)+1;
            GameMassage.fourNum = typeNum;
            console.log(GameMassage.fourNum);
            let lvStr = "UI_Game4"+typeNum;
            UIManager.openUI(lvStr);
        }else if(num >= 20 && num < 30){
            UIManager.openUI("UI_GameTwo");
        }else if(num >= 10 && num < 20){
            let nu = num-10;
            // let str = "level" + nu;
            // UIManager.openUI(str);
            GameUtil.CURLEVEL = nu
            GameUtil.instance.loadPage()
        }else if(num >= 0 && num < 10){
            UIManager.openUI("PIPE");
        }
    }

    /**开始游戏点击*/
    private startGameBtnClick(){
        AudioMgr.playAudioEffect(audioConfig.WordClick);
        let levNum = Number(GameDataMgr.getDataByType(E_GameData_Type.MaxlevelNum));
        GameDataMgr.setDataByType(E_GameData_Type.ClickPassLv, levNum);
        this.levelPageShow(levNum)
        console.log("关卡" + levNum);
    }

    /**个人中心点击*/
    private PlayCentreBtnClick(){
        AudioMgr.playAudioEffect(audioConfig.WordClick);
        if(this.contreNode.active){
            this.contreNode.scale = 1;
            cc.tween(this.contreNode)
            .to(0.2, {scale: 0}, {easing: 'quadIn'})
            // .delay(0.1)
            .call(() =>{
                this.contreNode.active = false;
            })
            .start()
        }else{
            this.contreNode.active = true
            this.contreNode.scale = 0.1;
            cc.tween(this.contreNode)
            .to(0.2, {scale: 1}, {easing: 'quadIn'})
            // .delay(0.1)
            .call(() =>{
                
            })
            .start()
        }
    }

    /**个人资料点击*/
    private playMassageGameBtnClick(){
        AudioMgr.playAudioEffect(audioConfig.WordClick);
        UIManager.openUI("UI_PlayMissage");
    }
    
    /**排行点击*/
    private rankBtnClick(){
        AudioMgr.playAudioEffect(audioConfig.WordClick);
        NetWork.getRankMessage((res)=>{
            if(res){
                UIManager.openUI("UI_Rank");
            }
        })
        
    }

    /**积分兑换点击*/
    private scoreBtnClick(){
        AudioMgr.playAudioEffect(audioConfig.WordClick);
        NetWork.getScoreMessage((res)=>{
            if(res){
                NetWork.getGoodsMessage((res)=>{
                    if(res){
                        UIManager.openUI("UI_ScoreShop");
                    }
                })
            }
        });
    }

}
