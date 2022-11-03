import Game from "./Game";
import winWnd from "./winWnd";

export default class GameUtil {

    private static _instance: GameUtil = null;
    public static get instance(): GameUtil {
        if (!this._instance) {
            this._instance = new GameUtil();
        }
        return this._instance;
    }
    static Game: Game

    /**当前第几局 0 开始 */
    static CURLEVEL: number = 0

    static CURTIME: number = 0

    public static _isPlaying: boolean = false

    public loadPage() {
        // this.node.getChildByName('GameUI').removeAllChildren()
        cc.loader.loadRes(`prefab/level${GameUtil.CURLEVEL}`, cc.Prefab, (error: Error, pfb: cc.Prefab) => {
            if (!error) {
                let page = cc.instantiate(pfb)
                page.parent = cc.find("Canvas")
                console.log('加载成功')
            } else {
                console.log(error)
            }
        });
    }

    public loadWin(time:number) {
        console.log('开始加载成功窗口')
        // this.node.getChildByName('wndPanel').removeAllChildren()
        cc.loader.loadRes(`prefab/winWnd`, cc.Prefab, (error: Error, pfb: cc.Prefab) => {
            if (!error) {
                let wnd = cc.instantiate(pfb)
                wnd.parent = cc.find("Canvas")
                wnd.getComponent(winWnd).init(time)
                console.log('加载成功')
            } else {
                console.log(error)
            }
        });
    }

    public loadLose() {
        console.log('开始加载失败窗口')
        // this.node.getChildByName('wndPanel').removeAllChildren()
        cc.loader.loadRes(`prefab/loseWnd`, cc.Prefab, (error: Error, pfb: cc.Prefab) => {
            if (!error) {
                let wnd = cc.instantiate(pfb)
                wnd.parent = cc.find("Canvas")
                console.log('加载成功')
            } else {
                console.log(error)
            }
        });
    }

}

