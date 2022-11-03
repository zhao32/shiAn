import { E_GameData_Type, GameDataMgr } from "../framework/GameDataMgr";
import { NetWork } from "../framework/NetWork";
import { Observer } from "../framework/Observer";
import { UIManager } from "../framework/UIManager";
import GameUtil from "./GameUtil";
import PipeLogic, {PIPE_ANSWERS} from "./PipeLogic";
import UI_Tip from "./UI_Tip";

// import PipeLogic from "./PipeLogic";

const {ccclass, property} = cc._decorator;

export enum PIPE_RESULT_TYPE{
    lose,
    win,
    ansLose,
    ansWin
}

@ccclass
export default class ResultLogic extends cc.Component {

    @property(cc.Node) loseNode:cc.Node = null;
    @property(cc.Node) winNode:cc.Node = null;
    @property(cc.Node) ansWinNode:cc.Node = null;
    @property(cc.Node) ansLoseNode:cc.Node = null;

    @property(cc.Label) winTitleLabel:cc.Label = null;

    @property(cc.Label) ansLoseTitleLabel:cc.Label = null;
    @property(cc.Label) ansLoseDecLabel:cc.Label = null;


    @property(cc.Label) ansWinTitleLabel:cc.Label = null;
    @property(cc.Label) ansWinDecLabel:cc.Label = null;

    @property(cc.Label) scoreLabel:cc.Label = null;

    // @property(PipeLogic) pipe:PipeLogic = null;

    @property([cc.Node]) stars:cc.Node[] =[];





    type:PIPE_RESULT_TYPE = PIPE_RESULT_TYPE.win;
    level:number = 0;
    star:number = 0;

    show(){
        this.loseNode.active = this.type == PIPE_RESULT_TYPE.lose;
        this.winNode.active = this.type == PIPE_RESULT_TYPE.win;
        this.ansLoseNode.active = this.type == PIPE_RESULT_TYPE.ansLose;
        this.ansWinNode.active = this.type == PIPE_RESULT_TYPE.ansWin;
    }

    /**
     * 显示游戏失败界面
     * @param l  关卡
     */
    showLose(l){
        this.level = l;
        this.type = PIPE_RESULT_TYPE.lose;
        this.show();
    }

    /**
     * 显示游戏胜利界面
     * @param l  关卡
     * @param s  星级
     */
    showWin(l,s){
        this.level = l;
        this.star = s;
        this.type = PIPE_RESULT_TYPE.win;
        this.show();
        this.winTitleLabel.string = `${PIPE_ANSWERS[l].title}`;
        this.scoreLabel.string = this.star + "";
    }

    /**
     * 显示答题失败界面
     */
    showAnsLose(){
        this.type = PIPE_RESULT_TYPE.ansLose;
        this.show();
        this.ansLoseTitleLabel.string = `${PIPE_ANSWERS[this.level].title}`
        this.ansLoseDecLabel.string = `${PIPE_ANSWERS[this.level].dec}`
    }

    /**
     * 显示答题成功界面
     */
    showAnsWin(){
        this.type = PIPE_RESULT_TYPE.ansWin;
        this.show();
        for(let i = 0; i < this.stars.length;i++){
            this.stars[i].active = this.star <= i;
        }
        this.ansWinTitleLabel.string = `${PIPE_ANSWERS[this.level].title}`
        this.ansWinDecLabel.string = `${PIPE_ANSWERS[this.level].dec}`
        let le = GameDataMgr.getDataByType(E_GameData_Type.MaxlevelNum);
        let lv = GameDataMgr.getDataByType(E_GameData_Type.ClickPassLv);
        console.log(lv);
        if(lv<=le){
            GameDataMgr.addDataByType(E_GameData_Type.ClickPassLv,1,31);
            if(lv==le){
                le+=1;
                GameDataMgr.addDataByType(E_GameData_Type.MaxlevelNum,1,31);
                NetWork.setScoreMessage(this.star,le,1,(res)=>{
                    if(res){
                        console.log("加分成功");
                        UI_Tip.Instance.showTip("获得积分成功");
                        Observer.emit("levelShow");
                    }
                })
            }else{
                NetWork.setScoreMessage(this.star,le,1,(res)=>{
                    if(res){
                        console.log("加分成功");
                        UI_Tip.Instance.showTip("获得积分成功");
                    }
                })
            }
        }
    }

    /**
     * 重玩
     */
    onClickRest(){
        this.node.active = false;
        // this.pipe.init(this.level);
        Observer.emit("aa",this.level);
    }

    /**
     * 点击是
     */
    onClickTrue(){
        this.showAnsLose();
    }

    /**
     * 点击不是
     */
    onClickFalse(){
        this.showAnsWin();
    }

    /**
     * 点击下一关
     */
    onClickNext(){
        this.node.active = false;
        // this.pipe.init(this.level+1);
        // let lev = GameDataMgr.getDataByType(E_GameData_Type.CurMaxlevelNum);
        // console.log("当前"+lev);
        // console.log(this.level +1);
        // if(lev <= (this.level + 1)){
        //     console.log("厚度e");
        //     let le = Number(GameDataMgr.getDataByType(E_GameData_Type.CurMaxlevelNum));
        //     console.log("现在" + le);
        //     GameDataMgr.setDataByType(E_GameData_Type.ClickPassLv,le);
        //     Observer.emit("levelShow");
        // }
        
        if(this.level + 1 >= 10){
            console.log("第11关了")
            let nu = 0;
            let str = "level" + nu;
            UIManager.closeUI("PIPE");
            // UIManager.openUI(str);
            GameUtil.CURLEVEL = nu
            GameUtil.instance.loadPage()
        }else{
            console.log(this.level+1);
            let lv = this.level+1;
            Observer.emit("aa",this.level+1);
        }
    }

}
