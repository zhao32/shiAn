// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { audioConfig } from "../config/Config";
import { AudioMgr } from "../framework/AudioMgr";
import { E_GameData_Type, GameDataMgr } from "../framework/GameDataMgr";
import { NetWork } from "../framework/NetWork";
import { Observer } from "../framework/Observer";
import { UIManager } from "../framework/UIManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    points: any[]

    @property(cc.Prefab)
    fallPfb: cc.Prefab = null

    @property(cc.AudioClip)
    music: cc.AudioClip[] = []

    @property(cc.Node)
    tiao: cc.Node = null

    @property(cc.Node)
    missTip: cc.Node = null

    @property(cc.Node)
    goodTip: cc.Node = null

    @property(cc.Node)
    prefetTip: cc.Node = null

    @property({
        type: cc.SpriteFrame,
        tooltip: "亮条",
    })
    private tiaoFrameBright: cc.SpriteFrame;


    @property({
        type: cc.SpriteFrame,
        tooltip: "暗条",
    })
    private tiaoFrameDark: cc.SpriteFrame;

    startTime: number

    dis: number = 0

    fallList: cc.Node[] = []

    pointIdx: number = 0

    missNum = 0

    prefetNum = 0

    private downTime = 5.2;

    private tempNum:number = 0;


    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        Observer.on("three", this.init, this)
    }

    onEnable(){
        //1:16 76
        this.init()
    }
    onDestroy() {
        Observer.off("three");
    }

    private yyTimeShow(num:number){
        GameDataMgr.setDataByType(E_GameData_Type.IsHadAudio_BG, false);
        AudioMgr.pauseBGMusic();
        cc.audioEngine.playEffect(this.music[num-1], false)
        if(num == 1){
            this.points = [
                { time: 9.2, value: 1 },
                { time: 10.1, value: 2 },
                { time: 11.2, value: 3 },
                { time: 13.1, value: 0 },
                { time: 14.2, value: 1 },
                { time: 17.0, value: 0 },
                { time: 19.1, value: 2 },
                { time: 21.1, value: 3 },
                { time: 23.2, value: 1 },
                { time: 24.1, value: 2 },
                { time: 26.1, value: 0 },
                { time: 28.1, value: 1 },
                { time: 29.1, value: 3 },//bugou-
                { time: 33.1, value: 1 },
                { time: 34.1, value: 2 },
                { time: 35.1, value: 1 },
                { time: 36.1, value: 3 },
                { time: 38.1, value: 2 },
                { time: 40.1, value: 0 },
                { time: 41.1, value: 2 },
                { time: 42.1, value: 1 },
                { time: 44.1, value: 3 },
                { time: 45.2, value: 0 },
                { time: 47.2, value: 1 },
                { time: 51.1, value: 0 },
                { time: 52.2, value: 3 },
                { time: 54.2, value: 1 },
                { time: 55.1, value: 3 },
                { time: 56.2, value: 0 },
                { time: 57.1, value: 1 },
                { time: 58.2, value: 2 },
                { time: 60.2, value: 3 },
                { time: 62.1, value: 2 },
                { time: 63.1, value: 1 },
                { time: 64.2, value: 2 },
                { time: 66.1, value: 0 },
                { time: 68.1, value: 3 },
                { time: 70.2, value: 2 },
                { time: 71.2, value: 0 },
                { time: 73.2, value: 2 },
                { time: 74.2, value: 1 },
                { time: 75.0, value: 3 },
            ]
        }else if(num == 2){
            this.points = [
                { time: 9.0, value: 3 },
                { time: 11.0, value: 2 },
                { time: 12.2, value: 3 },
                { time: 15.1, value: 0 },
                { time: 16.0, value: 2 },
                { time: 17.0, value: 0 },
                { time: 18.0, value: 1 },
                { time: 18.1, value: 2 },
                { time: 21.0, value: 0 },
                { time: 22.1, value: 2 },
                { time: 24.1, value: 3 },//bugou-
                { time: 25.0, value: 1 },
                { time: 27.0, value: 1 },
                { time: 28.1, value: 2 },
                { time: 29.0, value: 3 },
                { time: 31.0, value: 2 },
                { time: 32.2, value: 0 },
                { time: 35.1, value: 2 },
                { time: 36.1, value: 0 },
                { time: 37.1, value: 3 },
                { time: 39.1, value: 2 },
                { time: 40.0, value: 1 },
                { time: 42.1, value: 0 },
                { time: 43.0, value: 3 },
                { time: 45.0, value: 1 },
                { time: 47.1, value: 1 },
                { time: 48.0, value: 0 },
                { time: 50.0, value: 1 },
                { time: 52.0, value: 2 },
                { time: 54.2, value: 3 },
                { time: 55.1, value: 2 },
                { time: 58.0, value: 3 },
                { time: 59.0, value: 2 },
                { time: 60.0, value: 0 },
                { time: 62.1, value: 3 },
                { time: 64.1, value: 0 },
                { time: 66.1, value: 0 },
                { time: 69.0, value: 2 },
                { time: 71.1, value: 1 },
                { time: 72.2, value: 0 },
                { time: 74.1, value: 2 },
                { time: 76.1, value: 3 },
                { time: 77.0, value: 2 },
                { time: 79.1, value: 0 },
                { time: 80.2, value: 3 },
                { time: 81.0, value: 2 },
                { time: 83.2, value: 0 },
                { time: 85.2, value: 2 },
                { time: 88.0, value: 1 },
                { time: 91.0, value: 0 },
                { time: 93.1, value: 2 },
                { time: 95.1, value: 3 },
                { time: 97.1, value: 2 },
                { time: 100.1, value: 0 },
                { time: 103.0, value: 3 },
                { time: 104.1, value: 2 },
                { time: 106.1, value: 0 },
                { time: 107.0, value: 3 },
                { time: 109.1, value: 1 },
                { time: 111.0, value: 3 },
                { time: 112.0, value: 2 },
                { time: 113.1, value: 1 },
                { time: 115.1, value: 2 },
                { time: 117.0, value: 3 },
                { time: 120.1, value: 1 },
                { time: 123.0, value: 2 },
                { time: 125.2, value: 0 },
                { time: 128.0, value: 2 },
                { time: 131.1, value: 1 },
                { time: 132.2, value: 0 },
                { time: 133.1, value: 1 },
                { time: 136.0, value: 2 },
                { time: 138.0, value: 0 },
                { time: 140.1, value: 1 },
                { time: 141.2, value: 2 },
                { time: 144.1, value: 0 },
                { time: 145.2, value: 2 },
                { time: 146.1, value: 0 },
                { time: 149.0, value: 3 },
                { time: 150.0, value: 0 },
                { time: 152.2, value: 1 },
                { time: 153.1, value: 2 },
                { time: 154.0, value: 3 },
                { time: 156.0, value: 3 },
                { time: 158.1, value: 2 },
            ]
            

        }else if(num == 3){
            this.points = [
                { time: 8.0, value: 1 },
                { time: 10.0, value: 2 },
                { time: 11.2, value: 3 },
                { time: 13.1, value: 0 },
                { time: 14.0, value: 1 },
                { time: 17.0, value: 0 },
                { time: 20.0, value: 2 },
                { time: 22.1, value: 3 },
                { time: 23.0, value: 0 },
                { time: 25.1, value: 1 },
                { time: 26.1, value: 3 },//bugou-
                { time: 29.0, value: 1 },
                { time: 31.0, value: 3 },
                { time: 32.1, value: 2 },
                { time: 35.0, value: 3 },
                { time: 36.0, value: 2 },
                { time: 38.2, value: 1 },
                { time: 40.1, value: 2 },
                { time: 41.1, value: 0 },
                { time: 44.1, value: 3 },
                { time: 47.1, value: 0 },
                { time: 49.0, value: 1 },
                { time: 52.1, value: 0 },
                { time: 54.0, value: 3 },
                { time: 55.0, value: 2 },
                { time: 56.1, value: 1 },
                { time: 58.0, value: 0 },
                { time: 59.0, value: 1 },
                { time: 62.0, value: 2 },
                { time: 63.2, value: 3 },
                { time: 65.1, value: 2 },
                { time: 68.0, value: 3 },
                { time: 69.0, value: 2 },
                { time: 71.0, value: 0 },
                { time: 72.1, value: 3 },
                { time: 74.1, value: 1 },
                { time: 77.1, value: 0 },
                { time: 80.0, value: 2 },
                { time: 82.1, value: 3 },
                { time: 83.2, value: 0 },
                { time: 85.1, value: 2 },
                { time: 87.1, value: 1 },
                { time: 88.0, value: 2 },
                { time: 89.1, value: 0 },
                { time: 90.2, value: 1 },
                { time: 92.0, value: 2 },
                { time: 94.2, value: 0 },
                { time: 96.2, value: 2 },
                { time: 99.0, value: 1 },
                { time: 100.0, value: 3 },
                { time: 101.1, value: 2 },
                { time: 103.1, value: 3 },
                { time: 105.1, value: 1 },
                { time: 106.1, value: 0 },
                { time: 107.0, value: 1 },
                { time: 109.1, value: 2 },
                { time: 110.1, value: 0 },
                { time: 111.0, value: 2 },
                { time: 113.1, value: 1 },
                { time: 114.0, value: 3 },
                { time: 115.0, value: 2 },
                { time: 116.1, value: 3 },
                { time: 118.1, value: 2 },
                { time: 120.0, value: 3 },
                { time: 122.1, value: 0 },
                { time: 125.0, value: 2 },
                { time: 127.2, value: 0 },
                { time: 129.0, value: 2 },
                { time: 131.1, value: 3 },
                { time: 132.2, value: 0 },
                {time: 134.1, value: 1 },
                { time: 136.0, value: 2 },
                { time: 138.0, value: 3 },
                { time: 141.1, value: 1 },
                { time: 143.2, value: 2 },
                { time: 144.1, value: 3 },
                { time: 145.2, value: 2 },
                { time: 147.1, value: 0 },
                { time: 149.0, value: 3 },
                { time: 150.0, value: 0 },
                { time: 152.2, value: 1 },
                { time: 154.1, value: 0 },
                { time: 156.0, value: 2 },
                { time: 157.0, value: 3 },
                { time: 160.1, value: 1 },
                { time: 162.0, value: 0 },
                { time: 164.1, value: 2 },
            ]
        }
        
    }

    createrFall(type: number) {
        let fall = cc.instantiate(this.fallPfb)
        let posX = this.tiao.children[type].x
        let posY = 850

        fall.setPosition(posX, posY)
        fall.parent = this.node.getChildByName('fallPanel')
        this.fallList.push(fall)
        fall.name = String(type)

        let s = -(850 + 500)
        let v = s / this.downTime

        // let move0 = cc.moveBy(this.downTime, cc.v2(0, s))
        // let move1 = cc.moveBy(2, cc.v2(0, v * 2))
        // let callF = cc.callFunc(() => {
        //     let disTime = ((new Date()).getTime() - this.startTime) / 1000
        //     console.log('时间节点：' + disTime)
        // })
        // fall.runAction(cc.sequence(move0, callF, move1))

        // cc.tween(fall)
        //     .by(this.downTime, { x: 0, y: s })
        //     .call(() => {
        //         let disTime = ((new Date()).getTime() - this.startTime) / 1000
        //         console.log('时间节点：' + disTime)
        //     })
        //     .by(2, { x: 0, y: v * 2 })
        //     .start()


        cc.tween(fall)
            .by(this.downTime + 2, { x: 0, y: s + v * 2 })
            .start()
    }

    init() {
        let aNum = Math.floor(Math.random()*3)+1;
        this.tempNum = aNum;
        console.log(this.tempNum);
        this.yyTimeShow(this.tempNum);
        this.startTime = (new Date()).getTime()
        this.pointIdx = 0
        this.missNum = 0
        this.prefetNum = 0
        this.dis = 0
        this.missTip.active = false
        this.goodTip.active = false
        this.prefetTip.active = false
        while (this.fallList.length > 0) {
            this.fallList.pop().destroy()
        }
        this.fallList = []
        this.node.getChildByName('fallPanel').active = true

    }

    onBtnClick(event, idx) {
        console.log("customEventData:" + idx)

        // this.tiao.children[idx].active = false
        this.tiao.children[idx].opacity= 255
        this.tiao.children[idx].getComponent(cc.Sprite).spriteFrame = this.tiaoFrameBright

        setTimeout(() => {
            // this.tiao.children[idx].active = true
            this.tiao.children[idx].opacity= 180
            this.tiao.children[idx].getComponent(cc.Sprite).spriteFrame = this.tiaoFrameDark
        }, 200);

        let shine = event.target.getChildByName('guang') as cc.Node
        shine.stopAllActions()
        AudioMgr.playAudioEffect(`audio/ck${idx}`);
        for (let i = this.fallList.length - 1; i >= 0; i--) {
            let fall = this.fallList[i]
            if (parseInt(fall.name) == idx) {
                console.log('-------在此列----------')
                if (Math.abs(event.target.y - fall.y) < 10) {
                    console.log('prefet')
                    shine.runAction(cc.sequence(cc.fadeIn(0.1), cc.fadeOut(0.3)))
                    // fall.destroy()
                    // this.fallList.splice(i, 1)
                    fall.opacity = 0;
                    fall.name = "destory";
                    this.prefetTip.active = true;
                    this.prefetTip.getComponent(cc.Animation).play()
                    setTimeout(() => {
                        this.prefetTip.active = false;
                    }, 600);
                    this.prefetNum++
                } else if (Math.abs(event.target.y - fall.y) < event.target.height) {
                    console.log('good')
                    shine.runAction(cc.sequence(cc.fadeIn(0.1), cc.fadeOut(0.3)))
                    // fall.destroy()
                    // this.fallList.splice(i, 1)
                    fall.opacity = 0;
                    fall.name = "destory";
                    this.goodTip.active = true;
                    this.goodTip.getComponent(cc.Animation).play()
                    setTimeout(() => {
                        this.goodTip.active = false;
                    }, 600);
                }
            }
        }
    }

    private yfShow(num: number) {
        switch (num) {
            case 0:
                
                break;
            case 1:
            
            break;
            case 2:
            
            break;
            case 3:
            
            break;
        
            default:
                break;
        }
    }

    private scoreShow(star: number) {
        NetWork.setScoreMessage(star, 32,1,(res) => {
            if (res) {
                console.log("加分成功");
            }
        })
    }

    playWin() {
        // this.missTip.active = false;
        if (this.missNum < 3) {
            cc.audioEngine.stopAllEffects();
            GameDataMgr.setDataByType(E_GameData_Type.IsHadAudio_BG, true);
            AudioMgr.playBGMusic(audioConfig.M_BGMusic);
            console.log('游戏成功结束')
            this.unscheduleAllCallbacks()
            let percent = this.prefetNum / this.points.length
            let star: number
            if (percent > 0.7) {
                star = 3
            } else if (percent > 0.4) {
                star = 2
            } else {
                star = 1
            }
            this.scoreShow(star);
            this.node.getChildByName('fallPanel').active = false
            GameDataMgr.setDataByType(E_GameData_Type.CurScoreNum, star);
            UIManager.openUI("UI_Win");
        }
    }

    update(dt) {
        if (this.dis < 0) return
        this.dis++

        if (this.dis == 2) {
            this.dis = 0
            let disTime = ((new Date()).getTime() - this.startTime) / 1000;
            // for (let i = 0; i < this.points.length; i++) {
            //     if (Math.round(disTime * 10) == Math.round((this.points[0].time - 5) * 10)) {
            //         console.error('产生item')
            //         let data = this.points.shift()
            //         this.createrFall(data.value)
            //     }
            // }
            if (this.pointIdx == this.points.length) {
                let delay = this.points[this.pointIdx - 1].time - ((new Date()).getTime() - this.startTime) / 1000
                console.log("delay：" + delay)
                this.scheduleOnce(this.playWin, delay)
                this.dis = -1
                return
            }

            if (Math.round(disTime * 10) == Math.round((this.points[this.pointIdx].time - this.downTime) * 10)) {
                let data = this.points[this.pointIdx]
                this.pointIdx++
                this.createrFall(data.value)
            }
        }

        for (let i = this.fallList.length - 1; i >= 0; i--) {
            let fall = this.fallList[i]
            if (fall.name != 'destory' && fall.y <= -630) {
                console.log('丢一分')
                fall.name = 'destory'
                this.missNum++
                this.missTip.active = true;
                this.missTip.getComponent(cc.Animation).play()
                setTimeout(() => {
                    this.missTip.active = false;
                    if (this.missNum == 3) {
                        this.unscheduleAllCallbacks()
                        this.node.getChildByName('fallPanel').active = false
                        cc.audioEngine.stopAllEffects();
                        GameDataMgr.setDataByType(E_GameData_Type.IsHadAudio_BG, true);
                        AudioMgr.playBGMusic(audioConfig.M_BGMusic);
                        UIManager.openUI("UI_Lose");
                    }
                }, 600);
            }

            if (this.fallList[i].y <= -850) {
                this.fallList[i].destroy()
                this.fallList.splice(i, 1)
            }
        }
    }

    /**返回点击点击*/
    private backBtnClick() {
        cc.audioEngine.stopAllEffects();
        GameDataMgr.setDataByType(E_GameData_Type.IsHadAudio_BG, true);
        AudioMgr.playBGMusic(audioConfig.M_BGMusic);
        UIManager.closeUI(this.node.name);
    }

    /**音乐点击*/
    private musicBool: boolean = true;
    private soundBtnClick() {
        AudioMgr.playAudioEffect(audioConfig.WordClick);
        if (this.musicBool) {
            this.musicBool = false;
            // this.musicCloseBg.active = true;
            GameDataMgr.setDataByType(E_GameData_Type.IsHadAudio_BG, false);
            AudioMgr.pauseBGMusic();
        } else {
            this.musicBool = true;
            // this.musicCloseBg.active = false;
            GameDataMgr.setDataByType(E_GameData_Type.IsHadAudio_BG, true);
            AudioMgr.playBGMusic(audioConfig.M_BGMusic);
        }
    }
}
