import { audioConfig, GameMassage, RankConfig } from "../config/Config";
import { AudioMgr } from "../framework/AudioMgr";
import { E_GameData_Type, GameDataMgr } from "../framework/GameDataMgr";
import { ResourcesMgr } from "../framework/ResourcesMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class rankItem extends cc.Component {

    
    @property({
        type: cc.Node,
        tooltip: "1",
    })
    private mcSpr: cc.Node = null;

    @property({
        type: cc.Label,
        tooltip: "2",
    })
    private ncTxt: cc.Label = null;

    @property({
        type: cc.Label,
        tooltip: "3",
    })
    private nameTxt: cc.Label = null;

    @property({
        type: cc.Label,
        tooltip: "4",
    })
    private cjTxt: cc.Label = null;

    @property({
        type: cc.Node,
        tooltip: "我的",
    })
    private mySpr: cc.Node = null;

    @property({
        type: cc.Node,
        tooltip: "底框",
    })
    private diNode: cc.Node = null;

    private playID:any;

    onLoad () {

    }
    onEnable(){
        this.diNode.active = false;
        this.playID = GameDataMgr.getDataByType(E_GameData_Type.playerID);
    }
    /**item显示 */
    public itemShow(ai:number){
        // console.log(rankConfig);
        // ResourcesMgr.loadImgByUrl(this.mcSpr,RankConfig[ai].avatar,"png")
        if(this.playID == RankConfig[ai].uid){
            this.diNode.active = true;
        }
        this.ncTxt.string = "NO."+(ai+1);
        this.nameTxt.string = RankConfig[ai].nickname;
    }

}
