import { audioConfig, GameMassage } from "../config/Config";
import { AudioMgr } from "../framework/AudioMgr";
import { E_GameData_Type, GameDataMgr } from "../framework/GameDataMgr";
import { Observer } from "../framework/Observer";
import { UIManager } from "../framework/UIManager";
import GameUtil from "./GameUtil";
import winWnd from "./winWnd";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Label)
    levelDisplay: cc.Label = null;

    @property(cc.Label)
    timeDisplay: cc.Label = null;

    @property(cc.Sprite) timeImg:cc.Sprite = null;  //时间进度条

    @property(cc.Prefab)
    tagErr: cc.Prefab = null;

    @property(cc.Node)
    grid0: cc.Node = null;

    @property(cc.Node)
    grid1: cc.Node = null;

    @property(cc.Node)
    tip: cc.Node = null;

    @property(cc.Node)
    btnBack: cc.Node = null;

    @property({ tooltip: '不同点的数量' })
    difNum: number = 5;

    selectNum: number = 0

    timeHanlder: Function

    time: number = 0

    canClick: boolean = true

    /**点错的次数 */
    falseTime: number = 0

    maxTime:number = 60;


    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.btnBack && this.btnBack.on(cc.Node.EventType.TOUCH_END, () => {
            console.log('点击返回')
        }, this)

        this.grid0.on(cc.Node.EventType.TOUCH_START, this.touchGrid, this)
        this.grid1.on(cc.Node.EventType.TOUCH_START, this.touchGrid, this)

        // this.timeHanlder = () => {
        //     this.time--
        //     // this.timeDisplay.string = `time:${this.time}`
        //     this.timeDisplay.string = `${this.time}`
        //     if (this.time <= 0) {
        //         this.unschedule(this.timeHanlder)
        //         this.gameLose()
        //     }
        // }
    }

    touchGrid(eventTouch) {
        if (!this.canClick) return
        const touchPos = eventTouch.getLocation();
        let pos = eventTouch.target.convertToNodeSpaceAR(touchPos)

        let selected = false
        for (let i = 1; i < eventTouch.target.children.length; i++) {
            let child = eventTouch.target.children[i]
            let rect = child.getBoundingBox()

            if (rect.contains(pos)) {
                selected = true
            }

            if (rect.contains(pos) && child.active == false) {
                this.grid0.children[i].active = true
                this.grid1.children[i].active = true

                this.grid0.children[0].children[i - 1].name = 'selected'
                this.grid1.children[0].children[i - 1].name = 'selected'

                this.selectNum++

                AudioMgr.playAudioEffect(audioConfig.clickRight);


                let url = `pic/tip${GameUtil.CURLEVEL}_${i - 1}`
                let sprite = this.tip.getComponent(cc.Sprite)
                cc.resources.load(url, cc.SpriteFrame, (err, spriteFrame: cc.SpriteFrame) => {
                    sprite.spriteFrame = spriteFrame;
                });
            }
        }

        if (!selected) {
            AudioMgr.playAudioEffect(audioConfig.clickFalse);

            let tag = cc.instantiate(this.tagErr)
            tag.parent = eventTouch.target
            tag.setPosition(pos)

            this.scheduleOnce(() => {
                tag.destroy()
            }, 0.3)

            this.falseTime++
            if (this.falseTime == 3) {
                this.unschedule(this.timeHanlder)
                this.gameLose()
            }
        }

        if (this.selectNum == this.difNum) {
            this.canClick = false
            this.gameWin(this.time)
            this.unschedule(this.timeHanlder)
        }
    }

    start() {
        this.gameStart()

    }

      /**
     * 关卡内计时
     */
       addTime(){
        console.log('this.time:'+this.time )
        console.log('this.maxTime:'+this.maxTime )

        if(this.time >= this.maxTime){
            //游戏结束                  todo   失败出口
            this.gameLose()
            this.unscheduleAllCallbacks();
            return;
        }
        this.time+=0.1;
        // this.timeLabel.string = `${this.maxTime -this.time}`;
        this.timeImg.fillRange = Math.max(0,Math.min(1,(this.maxTime - this.time)/this.maxTime)) ;
    }


    gameStart() {
        this.time = 0
        this.timeImg.fillRange = 1;
        this.schedule(this.addTime,0.1,cc.macro.REPEAT_FOREVER,1);

        for (let i = 1; i < this.grid0.children.length; i++) {
            this.grid0.children[i].active = false
            this.grid1.children[i].active = false
        }
        this.falseTime = 0

        this.selectNum = 0
        let sprite = this.tip.getComponent(cc.Sprite)
        sprite.spriteFrame = null

        this.levelDisplay.string = `Level ${GameUtil.CURLEVEL + 11}`
        // this.time = 60
        // this.timeDisplay.string = `time:${this.time}`
        this.timeDisplay.string = `${this.time}`
        // this.schedule(this.timeHanlder, 1)

        this.canClick = true

        let tipPanel1 = this.grid0.children[0]
        let tipPanel2 = this.grid1.children[0]

        for (let i = 0; i < tipPanel1.children.length; i++) {
            tipPanel1.children[i].name = 'unSelect'

        }

        for (let i = 0; i < tipPanel2.children.length; i++) {
            tipPanel2.children[i].name = 'unSelect'
        }
    }

    /**
     * @param time 剩余时间
     */
    gameWin(time: number) {
        this.scheduleOnce(() => {
            GameUtil.instance.loadWin(time);
        }, 1)
    }

    gameLose() {
        GameUtil.instance.loadLose()
    }

    /**返回点击 */
    private backBtnClick() {
        let tv = GameDataMgr.getDataByType(E_GameData_Type.MaxlevelNum);
        let str = "level" + (tv - 1)
        cc.find("Canvas").getChildByName(str)
        this.node.destroy();
    }

    private btnTip() {
        AudioMgr.playAudioEffect(audioConfig.WordClick);

        let tipPanel1 = this.grid0.children[0]
        let tipPanel2 = this.grid1.children[0]

        for (let i = 0; i < tipPanel1.children.length; i++) {
            let tipNode = tipPanel1.children[i]
            console.log(`tipNode${i}.name:`+tipNode.name)
            if (tipNode.name != 'selected' && tipNode.getComponent(cc.Animation)) {
                tipNode.getComponent(cc.Animation).play()
            }
        }

        for (let i = 0; i < tipPanel2.children.length; i++) {
            let tipNode = tipPanel2.children[i]
            console.log(`tipNode${i}.name:`+tipNode.name)
            if (tipNode.name != 'selected' && tipNode.getComponent(cc.Animation)) {
                tipNode.getComponent(cc.Animation).play()
            }
        }


    }

    /**音乐点击*/
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


    // update (dt) {}
}
