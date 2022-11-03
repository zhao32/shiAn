import { audioConfig, GoodsConfig, letNodeConfig } from "../config/Config";
import { AudioMgr } from "../framework/AudioMgr";
import { E_GameData_Type, GameDataMgr } from "../framework/GameDataMgr";
import { ResourcesMgr } from "../framework/ResourcesMgr";
import Game from "./Game";

const {ccclass, property} = cc._decorator;

@ccclass
export default class goodsItem extends cc.Component {

    @property({
        type: cc.Node,
        tooltip: "背景色",
    })
    private huangShopIcon: cc.Node = null;

    @property({
        type: cc.Sprite,
        tooltip: "背景",
    })
    private shopIcon: cc.Sprite = null;

    @property({
        type: cc.Label,
        tooltip: "商品名称",
    })
    private shopName: cc.Label = null;

    @property({
        type: cc.Label,
        tooltip: "商品钱数",
    })
    private shopMoney: cc.Label = null;

    onLoad () {
        
    }
    onEnable(){
        this.huangShopIcon.active = false;
    }
    /**item显示 */
    public sprItemShow(ai:number){
        if(ai == 0){
            this.huangShopIcon.active = true;
            GameDataMgr.setDataByType(E_GameData_Type.playerClick,0)
        }
        // ResourcesMgr.loadImgByUrl(this.shopIcon,GoodsConfig[ai].thumb,"png")
        this.shopName.string = GoodsConfig[ai].name;
        this.shopMoney.string = GoodsConfig[ai].dic_price;
        letNodeConfig.push(this.huangShopIcon)
    }

    /**商品点击*/
    private carClick(event){
        AudioMgr.playAudioEffect(audioConfig.WordClick);
        let propName =  event.target.name;
        let thId = propName.substr(3);
        let tempNum = Number(thId);
        console.log(tempNum);
        let clickId =  GameDataMgr.getDataByType(E_GameData_Type.playerClick);
        // console.log(clickId);
        
        letNodeConfig[clickId].active = false;

        // console.log(letNodeConfig[clickId]);

        GameDataMgr.setDataByType(E_GameData_Type.playerClick,tempNum);
        letNodeConfig[tempNum].active = true;

        // console.log(letNodeConfig[tempNum]);
        
    }


}
