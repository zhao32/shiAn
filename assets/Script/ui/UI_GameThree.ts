import { audioConfig, CurPlatform, GamePlatform, LevelConfig, showBool } from "../config/Config";
import { E_GameData_Type, GameDataMgr } from "../framework/GameDataMgr";
import { NetWork } from "../framework/NetWork";
import { Observer } from "../framework/Observer";
import { UIManager } from "../framework/UIManager";
import UI_Tip from "./UI_Tip";



const {ccclass, property} = cc._decorator;

@ccclass
export default class UI_GameThree extends cc.Component {

    public static Instance: UI_GameThree = null;
    
    @property({
        type: cc.Node,
        tooltip: "显示Node",
    })
    private showNode: cc.Node[] = [];

    @property({
        type:cc.SpriteFrame,
        tooltip: "图标数组",
    })
    private iconArr: cc.SpriteFrame[] = [];

    @property({
        type: cc.Node,
        tooltip: "按钮Node",
    })
    private anNode: cc.Node[] = [];

    @property({
        type: cc.Label,
        tooltip: "时间Node",
    })
    private timeNode: cc.Label = null;

    @property({
        type: cc.Node,
        tooltip: "tiaoNode",
    })
    private tiaoNode: cc.Node[] = [];

    @property({
        type: cc.Node,
        tooltip: "tiNode",
    })
    private tiNode: cc.Node[] = [];

    private mcArr = [1,2,3,4,5,6,7,8,9,10,11,12];

    private runArr = [];

    private runingArr = [];

    private scoreNum:number = 0;

    private scoreBool:Boolean = false;

    private timerNum:number = 20;

    private speed:number = 10;

    private downArr = [false,false,false,false,false,false,false,false,false,false,false,false,]

    private one1:number = 0;
    private one2:number = 0;
    private one3:number = 0;

    private aabb:number = 11;

    onLoad(){
        UI_GameThree.Instance = this;

        Observer.on("three",this.init,this)
    }

    /**注册事件 */
    registerEvents(){
    }

    onEnable(){
        // this.playBgMusic();
        this.runArr = [];
        this.scoreNum = 0;
        this.init();
    }

    onDestroy(){
        Observer.off("three")
    }

    /**初始化 */
    init(){
        this.downNum = 0;
        this.doNum = 0;
        this.dNum = 2;
        this.mcArr = [1,2,3,4,5,6,7,8,9,10,11,12];

        this.runArr = [];

        this.runingArr = [];

        this.scoreNum = 0;

        this.scoreBool = false;

        this.timerNum = 20;
        this.aabb = 11;

        this.tiNode[0].active = false;
        this.tiNode[1].active = false;
        this.tiNode[2].active = false;
        this.one1 = 0;
        this.one2 = 0;
        this.one3 = 0;

        for (let b = 0; b < this.anNode.length; b++) {
            this.anNode[b].opacity = 0;
        }

        for (let a = 0; a < 12; a++) {
            this.showNode[a].active = true;
            this.showNode[a].opacity = 255;
            this.showNode[a].y = 846;
        }

        this.runingArr = this.randomArr(this.mcArr);
        console.log(this.runingArr);
        
        
        this.timerNum = 20;
        this.timeNode.string = this.timerNum + "s";
        // this.schedule(this.timerFunc,1);
        this.schedule(this.downFunc,1);
    }

    private iconShow(num:number){
        
    }

    

    
    /**清空数据 */
    destroyWords(){
        this.initData();
    }

    /**初始化数据 */
    initData(){
    }

    private randomArr(arr){
        var res=[];
        var len=arr.length;
        for(var i=0;i<len;++i){
            var index=Math.floor(Math.random()*arr.length);
            res.push(arr[index]);
            arr.splice(index,1);
        }
        return res;
    }

    /**按钮点击1 */
    private oneBtnClick(){
        this.tiaoNode[0].active =false
        setTimeout(() => {
            this.tiaoNode[0].active =true
        }, 200);
         if((this.showNode[0].y<=-509 && this.showNode[0].y>=-630)){
            this.ssNodeShow(this.showNode[0])
            this.nodeTweenMove(this.showNode[0],this.anNode[0]);
            this.sishow();
            return
         }
         if((this.showNode[4].y<=-509 && this.showNode[4].y>=-630)){
            this.ssNodeShow(this.showNode[4])
            this.nodeTweenMove(this.showNode[4],this.anNode[0]);
            this.sishow();
            return
         }
         if((this.showNode[8].y<=-509 && this.showNode[8].y>=-630)){
            this.ssNodeShow(this.showNode[8])
            this.nodeTweenMove(this.showNode[8],this.anNode[0]);
            this.sishow();
            return
         }
         this.tiNode[2].active = true;
            setTimeout(() => {
                this.tiNode[2].active = false;
            }, 600);
        this.one3 += 1;
        if(this.one3 >= 3){
            this.unschedule(this.downFunc);
            cc.Tween.stopAll();
            UIManager.openUI("UI_Lose");
        }
    }

    /**按钮点击2 */
    private twoBtnClick(){
        this.tiaoNode[1].active =false
        setTimeout(() => {
            this.tiaoNode[1].active =true
        }, 200);
        if((this.showNode[1].y<=-509 && this.showNode[1].y>=-630) ){
            this.ssNodeShow(this.showNode[1])
            this.nodeTweenMove(this.showNode[1],this.anNode[1]);
            this.sishow();
            return
        }
        if((this.showNode[5].y<=-509 && this.showNode[5].y>=-630)){
            this.ssNodeShow(this.showNode[5])
            this.nodeTweenMove(this.showNode[5],this.anNode[1]);
            this.sishow();
            return
        }
        if((this.showNode[9].y<=-509 && this.showNode[9].y>=-630)){
            this.ssNodeShow(this.showNode[9])
            this.nodeTweenMove(this.showNode[9],this.anNode[1]);
            this.sishow();
            return
        }
        this.one3 += 1;
        this.tiNode[2].active = true;
            setTimeout(() => {
                this.tiNode[2].active = false;
            }, 600);
        if(this.one3 >= 3){
            this.unschedule(this.downFunc);
            cc.Tween.stopAll();
            UIManager.openUI("UI_Lose");
        }
    }

    /**按钮点击3 */
    private threeBtnClick(){
        this.tiaoNode[2].active =false
        setTimeout(() => {
            this.tiaoNode[2].active =true
        }, 200);
        if((this.showNode[2].y<=-509 && this.showNode[2].y>=-630) ){
            this.ssNodeShow(this.showNode[2])
            this.nodeTweenMove(this.showNode[2],this.anNode[2]);
            this.sishow();
            return
        }
        if((this.showNode[6].y<=-509 && this.showNode[6].y>=-630)){
            this.ssNodeShow(this.showNode[6])
            this.nodeTweenMove(this.showNode[6],this.anNode[2]);
            this.sishow();
            return
        }
        if((this.showNode[10].y<=-509 && this.showNode[10].y>=-630)){
            this.ssNodeShow(this.showNode[10])
            this.nodeTweenMove(this.showNode[10],this.anNode[2]);
            this.sishow();
            return
        }
        this.one3 += 1;
        this.tiNode[2].active = true;
            setTimeout(() => {
                this.tiNode[2].active = false;
            }, 600);
        if(this.one3 >= 3){
            this.unschedule(this.downFunc);
            cc.Tween.stopAll();
            UIManager.openUI("UI_Lose");
        }
    }

    /**按钮点击4 */
    private fourBtnClick(){
        this.tiaoNode[3].active =false
        setTimeout(() => {
            this.tiaoNode[3].active =true
        }, 200);
        if((this.showNode[3].y<=-509 && this.showNode[3].y>=-630)){
            this.ssNodeShow(this.showNode[3])
            this.nodeTweenMove(this.showNode[3],this.anNode[3]);
            this.sishow();
            return
        }
        if((this.showNode[7].y<=-509 && this.showNode[7].y>=-630)){
            this.ssNodeShow(this.showNode[7])
            this.nodeTweenMove(this.showNode[7],this.anNode[3]);
            this.sishow();
            return
        }
        if((this.showNode[11].y<=-509 && this.showNode[11].y>=-630)){
            this.ssNodeShow(this.showNode[11])
            this.nodeTweenMove(this.showNode[11],this.anNode[3]);
            this.sishow();
            return
        }
        this.one3 += 1;
        this.tiNode[2].active = true;
            setTimeout(() => {
                this.tiNode[2].active = false;
            }, 600);
        if(this.one3 >= 3){
            this.unschedule(this.downFunc);
            cc.Tween.stopAll();
            UIManager.openUI("UI_Lose");
        }

    }

    private scoreShow(star:number){
        NetWork.setScoreMessage(star,31,1,(res)=>{
            if(res){
                console.log("加分成功");
            }
        })
    }

    private sishow(){
        // this.aabb -=1;
        this.aabb-=1;
        console.log(this.aabb);
        if(this.aabb<=0){
            this.aabb = 0;
            this.unschedule(this.downFunc);
            if(this.one1>=7){
                this.scoreNum = 3;
                this.scoreShow(3);
                GameDataMgr.setDataByType(E_GameData_Type.CurScoreNum,this.scoreNum);
                
            }else if(this.one1<7 && this.one1>=4){
                this.scoreNum = 2;
                this.scoreShow(2);
                GameDataMgr.setDataByType(E_GameData_Type.CurScoreNum,this.scoreNum);
            }else if(this.one1<4){
                this.scoreNum = 1;
                this.scoreShow(1);
                GameDataMgr.setDataByType(E_GameData_Type.CurScoreNum,this.scoreNum);
            }
            let lev = GameDataMgr.getDataByType(E_GameData_Type.MaxlevelNum);
            let lec = GameDataMgr.getDataByType(E_GameData_Type.ClickPassLv);
            if(lec <= lev){
                GameDataMgr.addDataByType(E_GameData_Type.ClickPassLv,1,32);
                
            }else{
                let a:number = 1;
                GameDataMgr.addDataByType(E_GameData_Type.ClickPassLv,a);
            }
            UIManager.openUI("UI_Win");
        }
    }

    private ssNodeShow(aa:cc.Node){
        if(aa.y<=-555 && this.showNode[3].y>=-572){
            this.one1 += 1;
            this.tiNode[0].active = true;
            setTimeout(() => {
                this.tiNode[0].active = false;
            }, 600);
        }else if((aa.y<=-521 ) || (aa.y>=-621 )){
            this.one2 += 1;
            this.tiNode[1].active = true;
            setTimeout(() => {
                this.tiNode[1].active = false;
            }, 600);
        }
        
    }

    private nodeTweenMove(cm:cc.Node,cn:cc.Node){
        cc.Tween.stopAllByTarget(cm);
        cm.y = 846;
        cc.tween(cn)
        .to(0.3, {opacity: 255}, {easing: 'quadIn'})
        .call(() =>{
            cn.opacity = 0;
            this.scoreNum+=1;
            // UI_Tip.Instance.showTip("好棒");
        })
        .start()
    }

    /**计时开始 */
    // private timerFunc(){
    //     this.timerNum -=1;
    //     this.timeNode.string = this.timerNum + "s" ;
    //     if(this.timerNum<=0){
    //         // this.unschedule(this.timerFunc);
    //         this.unschedule(this.downFunc);
    //     }
    // }

    /**循环下落 */
    private downNum:number = 0
    private doNum:number = 0
    private dNum:number = 2
    private downFunc(){
        // this.timerNum --;
        // this.timeNode.string = this.timerNum + "s" ;
        this.downNum++;
        let ad = 1 + (this.dNum * this.doNum);
        if(this.downNum == ad){
            this.tweenDownFunc(this.showNode[this.runingArr[this.doNum]]);
            
            // var act_2 = cc.moveTo(1,cc.v2(0,-650))
            // this.showNode[this.runingArr[this.doNum]].runAction(act_2);
            this.doNum +=1;
            console.log(this.doNum);
        }
        if(this.doNum>=12){
            this.unschedule(this.downFunc);
        }
    }

    /**下落 */
    private tweenDownFunc(aNode:cc.Node){
        cc.tween(aNode)
        .to(5, {y: -630})
        .call(() =>{
            aNode.opacity = 0;
            aNode.y = 846;
            this.tiNode[2].active = true;
            setTimeout(() => {
                this.tiNode[2].active = false;
            }, 600);
            this.aabb-=1;
            console.log(this.aabb);
            if(this.aabb <= 0){
                this.aabb = 0;
                this.unschedule(this.downFunc);
                if(this.one1>=7){
                    this.scoreNum = 3;
                    this.scoreShow(3);
                    GameDataMgr.setDataByType(E_GameData_Type.CurScoreNum,this.scoreNum);
                    
                }else if(this.one1<7 && this.one1>=4){
                    this.scoreNum = 2;
                    this.scoreShow(2);
                    GameDataMgr.setDataByType(E_GameData_Type.CurScoreNum,this.scoreNum);
                }else if(this.one1<4){
                    this.scoreNum = 1;
                    this.scoreShow(1);
                    GameDataMgr.setDataByType(E_GameData_Type.CurScoreNum,this.scoreNum);
                }
                let lev = GameDataMgr.getDataByType(E_GameData_Type.MaxlevelNum);
                let lec = GameDataMgr.getDataByType(E_GameData_Type.ClickPassLv);
                if(lec <= lev){
                    GameDataMgr.addDataByType(E_GameData_Type.ClickPassLv,1,32);
                }
                UIManager.openUI("UI_Win");
            }
        })
        .start()
    }
}
