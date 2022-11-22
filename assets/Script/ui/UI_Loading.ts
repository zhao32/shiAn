
import { levelNodeConfig } from "../config/Config";
import { AudioMgr } from "../framework/AudioMgr";
import GameClient from "../framework/GameClient";
import { ResourcesMgr } from "../framework/ResourcesMgr";
import { UIManager } from "../framework/UIManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UI_Loading extends cc.Component {
    @property({
        type: cc.Sprite,
        tooltip: "进度条",
    })
    loadSlider: cc.Sprite = null

    @property({
        type: cc.Node,
        tooltip: "车尾",
    })
    weiNode: cc.Node = null

    /**加载速度 */
    private speed:number = 0.01;
    /**当前进度 */
    private curRange: number = 0;

    private curBool:boolean = false;

    private curRBool:boolean = false;
    private curWBool:boolean = false;
    

    onLoad(){
        this.node.zIndex = 9;
        cc.loader.loadResDir("pic", (err, assets, urls) => {
            if (!err) {
                // console.log(JSON.stringify(assets))
                cc.log(`加载资源${err ? '失败' : '成功'}`)
                console.log(JSON.stringify(urls))
            } else {
                console.error('err:' + err)
            }
        });

        cc.loader.loadResDir("prefab", (err, assets, urls) => {
            if (!err) {
                // console.log(JSON.stringify(assets))
                cc.log(`加载资源${err ? '失败' : '成功'}`)
                console.log(JSON.stringify(urls))
            } else {
                console.error('err:' + err)
            }
        });

        

    }

    onEnable(){
        
        this.loadSlider.fillRange = 0;
        this.curRange = 0;
        this.weiNode.x = -282
        GameClient.isReady = true;
        this.curBool = false;
        this.curWBool = false;
        this.curRBool = false;
        this.tiao()
    }
    update(dt){
        // this.curRange += this.speed;
        // if(GameClient.isReady){
        //     if(this.curRange > 1){
        //         this.curRange = 1;
        //     }
        // }
        // else{
        //     if(this.curRange > 0.8){
        //         this.curRange = 0.8;
        //         GameClient.isReady = true;
        //     }
        // }
        // this.loadSlider.fillRange = this.curRange;
        // if(this.curRange == 1){
        //     // UIManager.closeUI("UI_Game");
        //     // UIManager.openUI("UI_Level");
        //     this.aabb()
        //     UIManager.closeUI("UI_Loading");
        //     AudioMgr.setVolume(1);
        //     this.curRange = 0;
        //     GameClient.isReady = false;
        // }
        if(!this.curBool){
            this.curRange += this.speed;
            this.loadSlider.fillRange = this.curRange;
            this.weiNode.x = -282 + this.curRange*580;
            if(this.curRange >= 0.4){
                this.curBool = true;
            }
        }
        if(this.curWBool){
            this.curRange += this.speed;
            this.loadSlider.fillRange = this.curRange;
            this.weiNode.x = -282 + this.curRange*580;
            if(this.curRange >= 0.7){
                this.curWBool = false;
            }
        }
        if(this.curRBool){
            this.curRange += this.speed;
            this.loadSlider.fillRange = this.curRange;
            this.weiNode.x = -282 + this.curRange*580;
            if(this.curRange >= 1){
                this.curRBool = false;
                UIManager.closeUI("UI_Loading");
                AudioMgr.setVolume(1);
                this.curRange = 0;
                GameClient.isReady = false;
                console.log(GameClient.isReady);
            }
        }

    }

    private tiao(){
        levelNodeConfig.length = 0;
        for (let a = 1; a < 33; a++) {
                let url = "ui_zi/gq" + a;
                ResourcesMgr.loadSpriteFrame(url, (frame)=>{
                    if(frame){
                        levelNodeConfig.push(frame);
                        if(a == 15){
                            // this.loadSlider.fillRange = 1;
                            this.curWBool = true;
                        }
                        if(a == 32){
                            // this.loadSlider.fillRange = 1;
                            this.curRBool = true;
                        }
                    }
                })
        }
        ResourcesMgr.loadPrefab("UI_Level",function(){});
     }
}
