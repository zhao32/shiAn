import { ResourcesMgr } from "./ResourcesMgr";

export const UIManager = new class{
    /**父节点 */
    private uiRoot: cc.Node;
    /**所有UI */
    private allUI: Map<string,cc.Node> = new Map();
    /**当前显示的UI */
    private curShowUI: Array<string> = new Array();
    /**待显示队列 */
    private waitShow: string[] = [];
    /**是否正在显示 */
    private isLoading: boolean = false;

    /**设置父节点 */
    public setRoot(root: cc.Node){
        this.uiRoot = root;
        this.uiRoot.setPosition(cc.v2(cc.winSize.width / 2, cc.winSize.height / 2));
    }

    /**显示UI */
    showUI(){
        if(this.isLoading) return;
        this.isLoading = true;
        if(this.waitShow.length == 0){
            this.isLoading = false;
            return;
        }
        let name = this.waitShow[0];
        if(this.curShowUI.indexOf(name) >= 0){
            console.log(name + " 该UI已显示，勿重复显示");
            if(this.waitShow.indexOf(name) >= 0){
                this.waitShow.splice(this.waitShow.indexOf(name), 1);
            }
            this.isLoading = false;
            this.showUI();
            return;
        }
        else{
            if(this.allUI.has(name)){
                let uiNode = this.allUI.get(name);
                uiNode.active = true;
                // if(name != "UI_Loading"){
                //     uiNode.zIndex = this.uiRoot.children.length;
                // }

                this.curShowUI.push(name);
                if(this.waitShow.indexOf(name) >= 0){
                    this.waitShow.splice(this.waitShow.indexOf(name), 1);
                }
                this.isLoading = false;
                console.log("显示UI: " + name + " 成功");
                this.showUI();
                return;
            }
            else{
                let self = this;
                ResourcesMgr.loadPrefab(name,(res)=>{
                    if(self.waitShow.indexOf(name) >= 0){
                        self.waitShow.splice(self.waitShow.indexOf(name), 1);
                    }
                    self.isLoading = false;
                    if(!res){
                        console.log("实例化UI节点失败：" + name);
                        self.showUI();
                        return;
                    }
                    let ui_node = cc.instantiate(res);
                    self.uiRoot.addChild(ui_node);
                    // if(name != "UI_Loading"){
                    //     ui_node.zIndex = this.uiRoot.children.length;
                    // }
                    self.allUI.set(name,ui_node);
                    self.curShowUI.push(name);
                    console.log("显示UI: " + name + " 成功");
                    
                    self.showUI();
                })
            }
        }
    }

    /**打开UI界面 */
    public openUI(name: string){
        this.waitShow.push(name);
        this.showUI();
    }

    /**关闭UI界面 */
    public closeUI(name: string){
        if(this.curShowUI.indexOf(name) >= 0){
            let ui_node = this.allUI.get(name);
            // if(name != "UI_Loading"){
            //     ui_node.zIndex = 1;
            // }
            ui_node.active = false;
            this.curShowUI.splice(this.curShowUI.indexOf(name),1);
        }
        else{
            console.log("显示UI队列中没有找到" + name);
            return;
        }
        console.log("关闭UI: " + name);
    }

    /**关闭所有UI界面 */
    public closeAllUI(){
        for(let i = 0;i < this.curShowUI.length;i++){
            let name = this.curShowUI[i];
            let ui_node = this.allUI.get(name);
            ui_node.active = false;
            this.curShowUI.splice(this.curShowUI.indexOf(name),1);
        }
    }

    /**判断当前显示界面 */
    public judgeShowUI(name: string){
        let isShow = false;
        if(this.curShowUI.indexOf(name) >= 0){
            isShow = true;
        }
        return isShow;
    }
}
