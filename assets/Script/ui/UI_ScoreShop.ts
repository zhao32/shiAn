import { audioConfig, GameMassage, GoodsConfig, letNodeConfig, RankConfig } from "../config/Config";
import { AudioMgr } from "../framework/AudioMgr";
import { E_GameData_Type, GameDataMgr } from "../framework/GameDataMgr";
import { NetWork } from "../framework/NetWork";
import { Observer } from "../framework/Observer";
import { UIManager } from "../framework/UIManager";


const {ccclass, property} = cc._decorator;

@ccclass
export default class UI_ScoreShop extends cc.Component {


    // LIFE-CYCLE CALLBACKS:
    @property({
        type: cc.Node,
        tooltip: "商品列表 "
    })
    private content: cc.Node = null;

    @property({
        type: cc.Prefab,
        tooltip: "商品Item "
    })
    private spItem: cc.Prefab = null;

    private shopLength:number = 0

    @property({
        type: cc.Label,
        tooltip: "积分 "
    })
    private jfTxt: cc.Label = null;

    @property({
        type: cc.Node,
        tooltip: "提示 "
    })
    private tsNode: cc.Node = null;

    @property({
        type: cc.Label,
        tooltip: "扣除积分 "
    })
    private kcjfTxt: cc.Label = null;

    onLoad () {
        Observer.on("gold",this.gold,this);
        this.itemShow();
    }

    onEnable(){
    }

    onDestroy(){
        Observer.off("gold");
    }

    // start () {

    // }

    /**item显示 */
    itemShow(){
        let as = GameDataMgr.getDataByType(E_GameData_Type.AllScoreNum);
        this.jfTxt.string = as;

        this.shopLength = GoodsConfig.length;
        let contents = this.content;
        if(contents.childrenCount>0){
            contents.removeAllChildren();
        }
        // contents.height = (250+28)* (this.shopLength/2)

        if(this.shopLength>0){
            for(let i = 0;i < this.shopLength ;i++){
                let item = cc.instantiate(this.spItem);
                contents.addChild(item);
                item.getChildByName("mcBg").name ="shp" + i;
                let view = item.getComponent("goodsItem");
                view.sprItemShow(i)
            }
        }
    }

    private gold(){

    }

    /**返回点击点击*/
    private backBtnClick(){
        UIManager.closeUI(this.node.name);
    }

    /**确定点击*/
    private sureBtnClick(){
    
        UIManager.openUI("UI_Site");
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
