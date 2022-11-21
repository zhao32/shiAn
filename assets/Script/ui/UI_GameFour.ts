import { audioConfig, CurPlatform, GameMassage, GamePlatform, LevelConfig, showBool } from "../config/Config";
import { AudioMgr } from "../framework/AudioMgr";
import { E_GameData_Type, GameDataMgr } from "../framework/GameDataMgr";
import { NetWork } from "../framework/NetWork";
import { Observer } from "../framework/Observer";
import { UIManager } from "../framework/UIManager";
import UI_Tip from "./UI_Tip";



const {ccclass, property} = cc._decorator;

@ccclass
export default class UI_GameFour extends cc.Component {

    public static Instance: UI_GameFour = null;

    @property({
        type: cc.Node,
        tooltip: "提示Node",
    })
    private tipNode: cc.Node
    
    @property({
        type: cc.Node,
        tooltip: "显示Node",
    })
    private showNode: cc.Node[] = [];

    @property({
        type: cc.Label,
        tooltip: "时间Node",
    })
    private timeNode: cc.Label = null;

    @property({
        type: cc.Label,
        tooltip: "等级Node",
    })
    private levelNode: cc.Label = null;

    @property({
        type: cc.Label,
        tooltip: "等级Node",
    })
    private rightLabel: cc.Label = null;

    @property({
        type: cc.Label,
        tooltip: "等级Node",
    })
    private falseLabel: cc.Label = null;

    @property({
        type: cc.Node,
        tooltip: "菜篮子Node",
    })
    private basketNode: cc.Node = null;

    @property({
        type: cc.Node,
        tooltip: "对错Node",
    })
    private dcNode: cc.Node[] = [];


    private mcArr = [];

    private runingArr = [];

    private scoreNum:number = 0;

    private timerNum:number = 20;

    private downJSNum:number = 0;

    private romdomNum:number = 0;

    private winArr =[[],["3","6","8"],["1","2","3","5"],["1","4","5","6","7","8"],["9","4","6","7","8"],["1","4","5","6","2","11"]]

    private idArr=[];

    private pBool:boolean = false;

    rightNum:number = 0

    onLoad(){
        UI_GameFour.Instance = this;

        // Observer.on("collision",function(other:any,arr:any){
        //     this.pzShow(other,arr)
        // } ,this);
        Observer.on("collision",this.pzShow,this);

        Observer.on("gameover",this.gameOver,this);

        Observer.on("four",this.init,this)

        Observer.on("zq",this.zqShow,this)

        Observer.on("cw",this.cwShow,this)

        this.node.on(cc.Node.EventType.TOUCH_START,function(t){
            // console.log("触摸开始");
        },this)
        //监听
        this.node.on(cc.Node.EventType.TOUCH_MOVE,this.on_touch_move,this);
        //触摸抬起
        this.node.on(cc.Node.EventType.TOUCH_END,function(t){
        //    console.log("触摸内结束");
       },this);
       this.node.on(cc.Node.EventType.TOUCH_CANCEL,function(t){
        //    console.log("触摸外开始");
       },this);

       cc.systemEvent.setAccelerometerEnabled(true); //设置是否开启重力传感
       cc.systemEvent.on(cc.SystemEvent.EventType.DEVICEMOTION, this.onDeviceMotionEvent, this); //注册重力传感响应事件
    }

    onEnable(){
        this.init();
    }

    onDestroy(){
        Observer.off("collision");
        Observer.off("four");
        Observer.off("gameover");
        Observer.off("zq");
        Observer.off("cw");

        cc.systemEvent.off(cc.SystemEvent.EventType.DEVICEMOTION, this.onDeviceMotionEvent, this); //取消重力传感响应事件
    }

    /**初始化 */
    init(){
        cc.Tween.stopAll();
        this.dcNode[0].active = false;
        this.dcNode[1].active = false;
        this.idArr=[]
        this.runingArr = [];
        GameMassage.num = 0;
        this.rightNum = 0
        this.rightLabel.string = '0'
        this.falseLabel.string = '0'
        this.scoreNum = 0;
        this.pBool = false;
        this.romdomNum = GameMassage.fourNum;
        this.rodomArr(this.romdomNum);
        
        
        this.timerNum = 20;
        this.downNum = 0
        this.doNum = 0
        this.dNum = 2
        this.downNum = 0;
        this.downJSNum = 0;
        let cpLev = GameDataMgr.getDataByType(E_GameData_Type.ClickPassLv);
        let lv = cpLev +1;
        this.levelNode.string = "level" + lv;

        this.tipNode.active = true
        this.scheduleOnce(()=>{
            this.tipNode.active = false
        },5)

        this.scheduleOnce(()=>{
            this.schedule(this.downFunc,1);
        },3)


        for (let a = 0; a < this.showNode.length; a++) {
            this.showNode[a].active = true;
            this.showNode[a].opacity = 255;
            this.showNode[a].x= -300 + Math.floor(Math.random()*(700-this.showNode[a].width));
            this.showNode[a].y =  996;
        }

    }

    private rodomArr(num:number){
        switch (num) {
            case 1:
                this.mcArr = [0,1,2,3,4,5,6,7,8,9];
                break;
            case 2:
                this.mcArr = [0,1,2,3,4,5,6,7,8];
                break;
            case 3:
                this.mcArr = [0,1,2,3,4,5,6,7,8,9,10];
                break;
            case 4:
                this.mcArr = [0,1,2,3,4,5,6,7,8,9];
                break;
            case 5:
                this.mcArr = [0,1,2,3,4,5,6,7,8,9,10,11,12,13];
                break;
            default:
                break;
        }
        this.runingArr = this.randomArr(this.mcArr);
        // console.log(this.runingArr);
    }

    private on_touch_move(t){
        //定义一个n_pos变量存储当前触摸点的位置
        var n_pos=t.getLocation();
        // console.log(n_pos,n_pos.x,n_pos.y);
        var delta=t.getDelta();
        this.basketNode.x+=delta.x;
        // this.basketNode.y+=delta.y;
        if(this.basketNode.x <=-238){
            this.basketNode.x = -238;
        }
        if(this.basketNode.x >=238){
            this.basketNode.x = 238;
        }
    }

    //正确
    private zqShow(){
        this.dcNode[0].x = this.basketNode.x 
        this.dcNode[0].y = this.basketNode.y + 150

        console.log('----------------')
        this.dcNode[0].active = true;
        setTimeout(() => {
            this.dcNode[0].active = false;
        }, 1500);
        this.rightNum++
        this.rightLabel.string = String(this.rightNum)
    }

    //错误
    private cwShow(){
        this.dcNode[1].x = this.basketNode.x 
        this.dcNode[1].y = this.basketNode.y + 150

        this.dcNode[1].active = true;
        setTimeout(() => {
            this.dcNode[1].active = false;
        }, 1500);
    }

    /**碰撞显示 */
    private pzShow(){
        this.pBool = true; 
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

    /**循环下落 */
    private downNum:number = 0
    private doNum:number = 0
    private dNum:number = 10

    private downFunc(){
        this.downNum+=1;
        // console.log(this.downNum);
        // console.log(this.runingArr);
        let ad = 1 + (this.dNum * this.doNum);
        if(this.downNum == ad){
            this.tweenDownFunc(this.showNode[this.runingArr[this.doNum]]);
            
            this.doNum +=1;
        }
        if(this.doNum>=this.runingArr.length){
            this.unschedule(this.downFunc);
        }
    }

    private scoreShow(star:number){
        let le = GameDataMgr.getDataByType(E_GameData_Type.MaxlevelNum);
        let lv = GameDataMgr.getDataByType(E_GameData_Type.ClickPassLv);
        console.log("加星星：" + le);
        console.log("加星星：" + lv);
            if(lv<=le){
                GameDataMgr.addDataByType(E_GameData_Type.ClickPassLv,1,31);
                if(lv==le){
                    le+=1;
                    GameDataMgr.addDataByType(E_GameData_Type.MaxlevelNum,1,31);
                    NetWork.setScoreMessage(star,31,1,(res)=>{
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
        UIManager.openUI("UI_Win"); 
        // NetWork.setScoreMessage(star,31,1,(res)=>{
        //     if(res){
        //         console.log("加分成功");
        //     }
        // })
    }

    /**下落 */
    private tweenDownFunc(aNode:cc.Node){
        cc.tween(aNode)
        .to(8, {y: -500},{easing:"quartIn"})
        .delay(0.5)
        .call(() =>{
            aNode.opacity = 0;
            aNode.y = 996;
            this.downJSNum +=1
            // console.log(this.downJSNum);
            if(this.downJSNum == this.runingArr.length){
                this.unschedule(this.downFunc);
                if(GameMassage.num==1){
                    this.scoreNum = 2;
                    this.scoreShow(2);
                    GameDataMgr.setDataByType(E_GameData_Type.CurScoreNum,this.scoreNum);
                }else if(GameMassage.num==2){
                    this.scoreNum = 1;
                    this.scoreShow(1);
                    GameDataMgr.setDataByType(E_GameData_Type.CurScoreNum,this.scoreNum);
                }else if(GameMassage.num==0){
                    this.scoreNum = 3;
                    this.scoreShow(3);
                    GameDataMgr.setDataByType(E_GameData_Type.CurScoreNum,this.scoreNum);
                }else if(GameMassage.num>=3){
                    this.gameOver();
                }
            }
            if(this.pBool){
                this.pBool = false;
                return;
            }
            let propNum:any = aNode.name;
            let thId = propNum.substr(2);
            if(GameMassage.fourNum == 1){
                if(thId == "3" || thId == "6" || thId == "8"){
                    this.cwShow();
                    GameMassage.num += 1;
                    if(GameMassage.num>=3){
                        Observer.emit("gameover");
                        
                    }
                }
            }else if(GameMassage.fourNum == 2){
                if(thId == "1" || thId == "2" || thId == "3" || thId == "5"){
                    this.cwShow();
                    GameMassage.num += 1;
                    if(GameMassage.num>=3){
                        Observer.emit("gameover");
                        
                    }
                }
            }
            else if(GameMassage.fourNum == 3){
                if(thId == "1" || thId == "4" || thId == "5" || thId == "6" || thId == "7" || thId == "8"){
                    this.cwShow();
                    GameMassage.num += 1;
                    if(GameMassage.num>=3){
                        Observer.emit("gameover");
                        
                    }
                }
            }
            else if(GameMassage.fourNum == 4){
                if(thId == "4" || thId == "6" || thId == "7" || thId == "8" || thId == "9"){
                    this.cwShow();
                    GameMassage.num += 1;
                    if(GameMassage.num>=3){
                        Observer.emit("gameover");
                        
                    }
                }
            }else if(GameMassage.fourNum == 5){
                if(thId == "1" || thId == "4" || thId == "5" || thId == "6" || thId == "2" || thId == "11"){
                    this.cwShow();
                    GameMassage.num += 1;
                    if(GameMassage.num>=3){
                        Observer.emit("gameover");
                        
                    }
                }
            }
            this.falseLabel.string = GameMassage.num.toString()

        })
        .delay(1)
        .call(()=>{})

        .start()
    }

    /**游戏结束 */
    private gameOver(){
        this.unschedule(this.downFunc);
        cc.Tween.stopAll();
        UIManager.openUI("UI_Lose");
    }

    /**返回点击点击*/
    private backBtnClick(){
        UIManager.closeUI(this.node.name);
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

    //x,y,z方向的重力感应加速度
    onDeviceMotionEvent(event) {
        // cc.log("event name:", event.type, " acc x:", event.acc.x, " acc y:", event.acc.y, " acc z:", event.acc.z); //单位是g=9.8m/s^2
    }
}
