// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameUtil from "./GameUtil";
import winWnd from "./winWnd";


const { ccclass, property } = cc._decorator;
@ccclass
export default class Game extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        GameUtil.Game = this
        this.loadPage()
    }

    loadPage() {
        this.node.getChildByName('GameUI').removeAllChildren()
        cc.loader.loadRes(`pfb/level${GameUtil.CURLEVEL}`, cc.Prefab, (error: Error, pfb: cc.Prefab) => {
            if (!error) {
                let page = cc.instantiate(pfb)
                page.parent = this.node.getChildByName('GameUI')
                console.log('加载成功')
            } else {
                console.log(error)
            }
        });
    }

    loadWin(time:number,level:number) {
        console.log('开始加载成功窗口')
        this.node.getChildByName('wndPanel').removeAllChildren()
        cc.loader.loadRes(`pfb/winWnd`, cc.Prefab, (error: Error, pfb: cc.Prefab) => {
            if (!error) {
                let wnd = cc.instantiate(pfb)
                wnd.parent = this.node.getChildByName('wndPanel')
                wnd.getComponent(winWnd).init(time,level)
                console.log('加载成功')
            } else {
                console.log(error)
            }
        });
    }

    loadLose() {
        console.log('开始加载失败窗口')
        this.node.getChildByName('wndPanel').removeAllChildren()
        cc.loader.loadRes(`pfb/loseWnd`, cc.Prefab, (error: Error, pfb: cc.Prefab) => {
            if (!error) {
                let wnd = cc.instantiate(pfb)
                wnd.parent = this.node.getChildByName('wndPanel')
                console.log('加载成功')
            } else {
                console.log(error)
            }
        });
    }




    // update (dt) {}
}

// export function loadPfb(path) {
//     cc.loader.loadRes(path, cc.Prefab,  (error: Error, pfb: cc.Prefab) => {
//         if (!error) {
//             this._allResources.Prefab[prefabName] = pfb;
//         }
//     });
// }
