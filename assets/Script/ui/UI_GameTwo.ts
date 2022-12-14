import { audioConfig, CurPlatform, GameMassage, GamePlatform, LevelConfig, showBool } from "../config/Config";
import { AudioMgr } from "../framework/AudioMgr";
import { E_GameData_Type, GameDataMgr } from "../framework/GameDataMgr";
import { NetWork } from "../framework/NetWork";
import { Observer } from "../framework/Observer";
import { UIManager } from "../framework/UIManager";
import UI_Tip from "./UI_Tip";



const { ccclass, property } = cc._decorator;

@ccclass
export default class UI_GameTwo extends cc.Component {

    public static Instance: UI_GameTwo = null;

    @property({
        type: cc.Node,
        tooltip: "显示Node",
    })
    private concentNode: cc.Node = null;

    @property({
        type: cc.SpriteFrame,
        tooltip: "图标数组",
    })
    private iconArr: cc.SpriteFrame[] = [];

    @property({
        type: cc.Node,
        tooltip: "问号Node",
    })
    private cyBtnNode: cc.Node[] = [];

    @property({
        type: cc.Label,
        tooltip: "倒计时文本",
    })
    private timeNode: cc.Label = null;

    @property({
        type: cc.Label,
        tooltip: "关卡文本",
    })
    private levelTxt: cc.Label = null;

    @property({
        type: cc.Node,
        tooltip: "提示Node",
    })
    private tsNode: cc.Node = null;

    @property({
        type: cc.Sprite,
        tooltip: "提示信息",
    })
    private tsMassageNode: cc.Sprite = null;

    @property({
        type: cc.SpriteFrame,
        tooltip: "提示Node数组",
    })
    private tsArrNode: cc.SpriteFrame[] = [];

    @property(cc.Sprite) timeImg:cc.Sprite = null;  //时间进度条

    private mcArr = [1, 1, 2, 2, 3, 3, 4, 4, 5];

    private frrArr = [];

    private clickNum: number = 0;

    private tempNum: number = 0;

    private timeNumNum: number = 60;

    private scoreNum: number = 0;

    private alpv: number = 0;

    private clBoolArr = [false, false, false, false, false, false, false, false, false, false, false, false,]

    maxTime
    onLoad() {
        UI_GameTwo.Instance = this;
        this.clickNum = 0;

        this.registerEvents();
    }

    /**注册事件 */
    registerEvents() {
        Observer.on("bb", this.init, this);
    }

    onEnable() {
        this.clickNum = 0;
        this.init();
    }

    onDestroy() {
        Observer.off("bb");

    }

    

    /**初始化 */
    init() {
        this.tsNode.active = false;
        this.mcArr = [1, 1, 2, 2, 3, 3, 4, 4, 5];
        this.frrArr = [];
        let cpLev = GameDataMgr.getDataByType(E_GameData_Type.ClickPassLv);
        console.log("多久：" + cpLev);
        this.alpv = cpLev - 20;
        // this.timeNumNum = 60 - ((alpv-1)*3)
        this.timeNumNum = 60 - ((this.alpv - 1) * 3)
        this.maxTime = this.timeNumNum
        this.tghBool = false;
        this.duiNum = 0;
        this.clickNum = 0;

        this.levelTxt.string = "Level" + (cpLev + 1);

        this.frrArr = this.randomArr(this.mcArr);
        console.log(this.frrArr);
        for (let a = 1; a < 10; a++) {
            let str = "a" + a;
            let con = this.concentNode.getChildByName(str).getChildByName("mc").getComponent(cc.Sprite);
            // con.spriteFrame = this.iconShow(frr[a]);
            con.spriteFrame = this.iconArr[this.frrArr[a - 1] - 1];
            // let yName = "yu" + a;
            this.cyBtnNode[a - 1].active = false;
            this.cyBtnNode[a - 1].opacity = 0;
            this.cyBtnNode[a - 1].scale = 1
            // this.cyBtnNode[a - 1].getComponent(cc.Animation).play('fanzhuan')
            this.clBoolArr[a] = false;
            setTimeout(() => {
                this.cyBtnNode[a - 1].active = true;
                this.cyBtnNode[a - 1].opacity = 255;
                this.cyBtnNode[a - 1].getComponent(cc.Animation).play('fahui')

            }, 2000);
        }

        this.timeNode.string = this.timeNumNum + "";
        this.schedule(this.timeFun, 0.1);
    }

    private randomArr(arr) {
        var res = [];
        var len = arr.length;
        for (var i = 0; i < len; ++i) {
            var index = Math.floor(Math.random() * arr.length);
            res.push(arr[index]);
            arr.splice(index, 1);
        }
        return res;
    }

    /**点击 */
    private tghBool: boolean = false;
    private duiNum: number = 0;
    whbtnClick(event) {
        AudioMgr.playAudioEffect(audioConfig.WordClick);

        let propName = event.target.name;
        console.log("名字" + propName);
        let thId = propName.substr(2);
        console.log("ID" + thId);
        if (!this.tghBool) {
            if (!this.clBoolArr[thId]) {
                // this.cyBtnNode[thId-1].opacity = 0;
                let ani = this.cyBtnNode[thId - 1].getComponent(cc.Animation)
                ani.play()
                AudioMgr.playAudioEffect(audioConfig.fanpai);


                this.scheduleOnce(() => {
                    this.clickNum += 1;
                    if (this.clickNum == 1) {
                        this.tempNum = thId;
                        this.clBoolArr[thId] = true;
                    }
                    if (this.clickNum >= 2) {
                        this.tghBool = true;
                        this.clickNum = 0;

                        if (this.frrArr[this.tempNum - 1] == this.frrArr[thId - 1]) {
                            this.clBoolArr[thId] = true;
                            this.duiNum += 1;
                            this.fpWin(this.duiNum);
                            console.log('------------正确--------')
                            this.tghBool = false;
                            AudioMgr.playAudioEffect(audioConfig.clickRight);

                        } else {
                            this.clBoolArr[thId] = false;
                            this.clBoolArr[this.tempNum] = false;

                            this.cyBtnNode[thId - 1].getComponent(cc.Animation).play('fahui')
                            this.cyBtnNode[this.tempNum - 1].getComponent(cc.Animation).play('fahui')
                            this.scheduleOnce(() => {
                                this.tghBool = false;
                            }, 0.5)
                            AudioMgr.playAudioEffect(audioConfig.clickFalse);

                            console.log('------------错误--------')
                        }
                    }
                }, 1)

                //   ani.on(cc.Animation.EventType.FINISHED, () => {

                //     this.clickNum+=1;
                //     if(this.clickNum == 1){
                //         this.tempNum = thId; 
                //         this.clBoolArr[thId] = true;
                //     }
                //     if(this.clickNum >=2){
                //         this.tghBool = true;
                //         this.clickNum = 0;

                //         if(this.frrArr[this.tempNum-1] == this.frrArr[thId-1]){
                //             this.clBoolArr[thId] = true;
                //             this.duiNum+=1;
                //             this.fpWin(this.duiNum);
                //             console.log('------------正确--------')


                //         }else{
                //             this.clBoolArr[thId] = false;
                //             this.clBoolArr[this.tempNum] = false;
                //             // cc.tween(this.cyBtnNode[thId-1])
                //             // .to(0.3, {scale: 1}, {easing: 'quadIn'})
                //             // .start()
                //             // cc.tween(this.cyBtnNode[this.tempNum-1])
                //             // .to(0.3, {scale: 1}, {easing: 'quadIn'})
                //             // .start()
                //             this.cyBtnNode[thId-1].getComponent(cc.Animation).play('fahui')
                //             this.cyBtnNode[this.tempNum-1].getComponent(cc.Animation).play('fahui')


                //             console.log('------------错误--------')

                //         }
                //         ani.off(cc.Animation.EventType.FINISHED)
                //         this.tghBool = false;
                //         // cc.tween(this.cyBtnNode[thId-1])
                //         // .to(0.1, {opacity: 0}, {easing: 'quadIn'})
                //         // // cc.tween(this.cyBtnNode[thId-1])
                //         // // .to(0.1, {scaleX: 0}, {easing: 'quadIn'})
                //         // // .call(()=>{
                //         // //     this.cyBtnNode[thId-1].getComponent(cc.Sprite).spriteFrame = this.iconArr[this.frrArr[thId]];
                //         // // })
                //         // // .to(0.1, {scaleX: 1}, {easing: 'quadIn'})
                //         // .call(()=>{
                //         //     if(this.frrArr[this.tempNum-1] == this.frrArr[thId-1]){
                //         //         this.clBoolArr[thId] = true;
                //         //         this.duiNum+=1;
                //         //         this.fpWin(this.duiNum);
                //         //         console.log('------------正确--------')
                //         //     }else{
                //         //         this.clBoolArr[thId] = false;
                //         //         this.clBoolArr[this.tempNum] = false;
                //         //         cc.tween(this.cyBtnNode[thId-1])
                //         //         .to(0.3, {opacity: 255}, {easing: 'quadIn'})
                //         //         .start()
                //         //         cc.tween(this.cyBtnNode[this.tempNum-1])
                //         //         .to(0.3, {opacity: 255}, {easing: 'quadIn'})
                //         //         .start()
                //         //         console.log('------------错误--------')

                //         //     }
                //         //     this.tghBool = false;
                //         // })
                //         // .start()
                //     }
                //     }, this)

            }
        }//false
    }

    /**时间监听 */
    private timeFun() {
        this.timeNumNum-=0.1;
        // this.timeNode.string = this.timeNumNum + "";
        // if (this.timeNumNum <= 0) {
        //     this.unschedule(this.timeFun);
        //     UIManager.openUI("UI_Lose");
        // }

        if(this.timeNumNum <= 0){
            //游戏结束                  todo   失败出口
            this.unschedule(this.timeFun);
            UIManager.openUI("UI_Lose");
        }
        // this.timeLabel.string = `${this.maxTime -this.time}`;
        this.timeImg.fillRange =1- Math.max(0,Math.min(1,(this.maxTime - this.timeNumNum)/this.maxTime)) ;
    }

    /**翻牌胜利 */
    private fpWin(num) {
        if (num >= 4) {
            this.clickNum = 0;
            this.unschedule(this.timeFun);
            // let aNum = Math.floor(Math.random()*10);
            this.alpv = GameDataMgr.getDataByType(E_GameData_Type.ClickPassLv);
            this.tsMassageNode.spriteFrame = this.tsArrNode[this.alpv - 20]
            this.tsNode.active = true;
            setTimeout(() => {
                this.tsNode.active = false;
                if (this.timeNumNum >= 20) {
                    this.scoreNum = 3;
                    GameDataMgr.setDataByType(E_GameData_Type.CurScoreNum, this.scoreNum);
                    console.log("三星");
                    this.scoreShow(3);
                } else if (this.timeNumNum >= 10 && this.timeNumNum < 20) {
                    this.scoreNum = 2;
                    GameDataMgr.setDataByType(E_GameData_Type.CurScoreNum, this.scoreNum);
                    console.log("两星");
                    this.scoreShow(2);
                } else if (this.timeNumNum > 0 && this.timeNumNum < 10) {
                    this.scoreNum = 1;
                    GameDataMgr.setDataByType(E_GameData_Type.CurScoreNum, this.scoreNum);
                    console.log("一星");
                    this.scoreShow(1);
                }
            }, 1500);

        }
    }

    private scoreShow(star: number) {
        let le = GameDataMgr.getDataByType(E_GameData_Type.MaxlevelNum);
        let lv = GameDataMgr.getDataByType(E_GameData_Type.ClickPassLv);
        console.log('----------------')
        console.log("加星星：" + le);
        console.log("加星星：" + lv);
        // le = le + 1
        if (lv <= le) {
            GameDataMgr.addDataByType(E_GameData_Type.ClickPassLv, 1, 31);
            let lv = GameDataMgr.getDataByType(E_GameData_Type.ClickPassLv);
            console.log("大数据:" + lv);
            if (lv == le) {
                le += 1;
                GameDataMgr.addDataByType(E_GameData_Type.MaxlevelNum, 1, 31);
                NetWork.setScoreMessage(star, le, 1, (res) => {
                    if (res) {
                        console.log("加分成功");
                        UI_Tip.Instance.showTip("获得积分成功");
                        Observer.emit("levelShow");
                    }
                })
            } else {
                NetWork.setScoreMessage(star, le, 1, (res) => {
                    if (res) {
                        console.log("加分成功");
                        UI_Tip.Instance.showTip("获得积分成功");
                    }
                })
            }
        }
        UIManager.openUI("UI_Win");
    }

    /**返回点击点击*/
    private backBtnClick() {
        UIManager.closeUI(this.node.name);
    }

    /**音乐点击*/
    // private musicBool: boolean = true;
    private soundBtnClick() {
        AudioMgr.playAudioEffect(audioConfig.WordClick);
        if (GameMassage.musicBool) {
            GameMassage.musicBool = false;
            // this.musicCloseBg.active = true;
            GameDataMgr.setDataByType(E_GameData_Type.IsHadAudio_BG, false);
            AudioMgr.pauseBGMusic();
        } else {
            GameMassage.musicBool = true;
            // this.musicCloseBg.active = false;
            GameDataMgr.setDataByType(E_GameData_Type.IsHadAudio_BG, true);
            AudioMgr.playBGMusic(audioConfig.M_BGMusic);
        }
    }
}
