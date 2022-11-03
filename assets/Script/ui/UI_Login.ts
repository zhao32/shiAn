import { audioConfig, GameMassage, LevelConfig, levelNodeConfig } from "../config/Config";
import { AudioMgr } from "../framework/AudioMgr";
import { NetWork } from "../framework/NetWork";
import { ResourcesMgr } from "../framework/ResourcesMgr";
import { UIManager } from "../framework/UIManager";
import UI_Base from "../framework/UI_Base";
import UI_Tip from "./UI_Tip";


const {ccclass, property} = cc._decorator;

@ccclass
export default class UI_Main extends cc.Component {


    @property({
        type: cc.EditBox,
        tooltip: "账号"
    })
    private zcZHTxt: cc.EditBox = null;

    @property({
        type: cc.EditBox,
        tooltip: "密码"
    })
    private zcMMTxt: cc.EditBox = null;

    @property({
        type: cc.EditBox,
        tooltip: "再次密码"
    })
    private zcAgainTxt: cc.EditBox = null;

    @property({
        type: cc.EditBox,
        tooltip: "登陆账号"
    })
    private dlZHTxt: cc.EditBox = null;

    @property({
        type: cc.EditBox,
        tooltip: "登陆密码"
    })
    private dlMMTxt: cc.EditBox = null;

    @property({
        type: cc.Node,
        tooltip: "注册"
    })
    private zcNode: cc.Node = null;

    @property({
        type: cc.Node,
        tooltip: "登陆"
    })
    private dlNode: cc.Node = null;

    onLoad(){
    }

    onDestroy(){
    }

    onEnable(){
        this.init();

    }
    /**初始化 */
    init(){
        this.zcNode.active = false;
        this.dlNode.active = true;
        // ResourcesMgr.loadPrefab("UI_Level",function(){});
        ResourcesMgr.loadPrefab("PIPE",function(){})
    }

    /**登陆成功 */
    loginBtnClick(){
        let name = this.dlZHTxt.string;
        let pass = this.dlMMTxt.string;
        if(name == ""){
            UI_Tip.Instance.showTip("请输入你的账号");
            return;
        }
        if(pass == ""){
            UI_Tip.Instance.showTip("请输入你的密码");
            return;
        }
        NetWork.setLoginMessage(name,pass,(res,msg)=>{
            let a = msg+"";
            if(res){
                console.log("登录成功");
                // UIManager.closeUI("UI_Level");
                NetWork.getScoreMessage((res)=>{
                    if(res){
                        GameMassage.isLevel = true;
                        UIManager.closeUI(this.node.name);
                        UIManager.openUI("UI_Level");
                    }
                });
            }
            else{
                UI_Tip.Instance.showTip(a);
            }
        });
    }

    /**注册成功 */
    enrollBtnClick(){
        let name = this.zcZHTxt.string;
        let pass = this.zcMMTxt.string;
        let repass = this.zcAgainTxt.string;
        if(name == ""){
            UI_Tip.Instance.showTip("请输入账号");
            return;
        }
        if(pass == ""){
            UI_Tip.Instance.showTip("请输入密码");
            return;
        }
        if(repass == ""){
            UI_Tip.Instance.showTip("请再次输入密码");
            return;
        }
        if(pass != repass){
            UI_Tip.Instance.showTip("两次输入密码不一致");
            return;
        }
        console.log("点击注册");
        NetWork.setEnrollMessage(name,pass,repass,(res,msg)=>{
            let a = msg+"";
            if(res){
                console.log("注册成功");
                UI_Tip.Instance.showTip("注册成功");
                this.zcNode.active = false;
                this.dlZHTxt.string = "";
                this.dlMMTxt.string = "";
                this.dlNode.active = true;

            }
            else{
                UI_Tip.Instance.showTip(a);
            }
        });
    }

    /**注册点击 */
    zcBtnClick(){
        this.zcNode.active = true;
        this.dlNode.active = false;
    }


    /**登陆TXT点击 */
    dlBtnClick(){
        this.zcNode.active = false;
        this.dlNode.active = true;
    }
}
