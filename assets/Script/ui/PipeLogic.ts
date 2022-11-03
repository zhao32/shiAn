import { E_GameData_Type, GameDataMgr } from "../framework/GameDataMgr";
import { Observer } from "../framework/Observer";
import PipeItem from "./PipeItem";
import ResultLogic from "./ResultLogic";

const {ccclass, property} = cc._decorator;

const PIPE_GRID_W = 164;           //格子宽度
const PIPE_GRID_H = 164;           //格子高度
const PIPE_Time = 60;           //游戏时间
const PIPE_LEVEL_DATA = [          //几列*几行
    [3, 3],
    [3, 3],
    [3, 3],
    [3, 4],
    [3, 4],
    [3, 4],
    [4, 4],
    [4, 4],
    [4, 5],
    [4, 5],
];

const PIPE_LEVEL_PIPE_DATA = [          //管道数量  直的 弯的
    [2, 2],
    [2, 2],
    [2, 2],
    [3, 2],
    [3, 2],
    [3, 2],
    [3, 2],
    [4, 2],
    [3, 4],
    [4, 4],
];

const PIPE_OUT = [              //管道出口
    [[0,2],[1,2],[2,2]],
    [[1,2],[2,2]],
    [[1,2]],
    [[0,3],[1,3],[2,3]],
    [[1,3],[2,3]],
    [[1,3]],
    [[1,3]],
    [[2,3]],
    [[2,4]],
    [[3,4]],

]

const enemyPos = [
    [164,520],
    [164,520],
    [164,520],
    [-164,520],
    [-164,520],
    [-164,520],
    [248,520],
    [-248,520],
    [-248,520],
    [-248,520],

]

@ccclass
export default class PipeLogic extends cc.Component {

    @property(cc.Node) pipeNode: cc.Node = null;     //选择管道节点
    @property(cc.Node) posNode: cc.Node = null;
    @property(cc.Node) draggingNode: cc.Node = null;       //拖拽节点
    @property(cc.Label) straightLabel: cc.Label = null;
    @property(cc.Label) curveLabel: cc.Label = null;
    @property(cc.Label) timeLabel: cc.Label = null;
    @property(cc.Label) levelLabel: cc.Label = null;

    @property(cc.Prefab) gridPre: cc.Prefab = null;  //空格子

    @property(cc.Sprite) bg:cc.Sprite = null;

    @property([cc.SpriteFrame]) pipeIcons: cc.SpriteFrame[] = [];
    @property([cc.SpriteFrame]) gridIcons: cc.SpriteFrame[] = [];
    @property([cc.SpriteFrame]) bgIcons: cc.SpriteFrame[] = [];

    @property(ResultLogic) resultLogic:ResultLogic = null;

    @property(cc.Node) enemyNode:cc.Node = null;

    // @property(cc.Sprite) renNode:cc.Node = null;

    mapData; //位置信息

    curve: number = 0;   //弯的
    straight: number = 0;  //直的
    changePipeID: number = -1;
    changeExId: number = -1;
    changeExType: number = -1;
    level: number = 0;
    time:number = 0;
    maxTime:number = 0;

    // private renX = [165,];

    outPos;

    onLoad(){
        Observer.on("aa",function(id:any){
            this.init(id);
        },this);
    }

    onEnable(){
        // this.onDrag();

        let levNum = Number(GameDataMgr.getDataByType(E_GameData_Type.ClickPassLv));
        let lev = levNum;
        this.init(lev);
    }

    /**
     * 初始化
     * @param level  关卡，0开始，超出配置均已最高值算
     */
    init(level: number) {
        this.onDrag();
        console.log("走了没" + level);
        this.resultLogic.node.active = false;
        if (level >= PIPE_LEVEL_DATA.length) {
            level = PIPE_LEVEL_DATA.length - 1;
        }
        this.enemyNode.x = enemyPos[level][0];
        this.mapData = [];
        this.outPos = [];
        this.posNode.destroyAllChildren();
        for (let i = 0; i < PIPE_LEVEL_DATA[level][1]; i++) {
            for (let j = 0; j < PIPE_LEVEL_DATA[level][0]; j++) {
                let vec2 = cc.v2(-PIPE_GRID_W * PIPE_LEVEL_DATA[level][0] / 2 + PIPE_GRID_W / 2 + PIPE_GRID_W * j, -PIPE_GRID_H / 2 - PIPE_GRID_H * i);
                this.mapData.push(vec2);
                let node = cc.instantiate(this.gridPre);
                let pipeItem = node.getComponent(PipeItem) || node.addComponent(PipeItem);
                pipeItem.init(0);
                node.setParent(this.posNode);
                node.setPosition(vec2);
                node.opacity = 1;
                let o = PIPE_OUT[level].find((v)=>{return  v[0] == j && v[1] == i})
                if(o != undefined){
                    this.outPos.push(vec2);
                }
            }
        }
        console.log(this.outPos);

        this.level = level;
        this.time = 0;
        this.maxTime = PIPE_Time;
        this.curve = PIPE_LEVEL_PIPE_DATA[level][1];
        this.straight = PIPE_LEVEL_PIPE_DATA[level][0];
        this.changePipeID = 0;
        this.changeExId = -1;
        this.changeExType = 0;
        this.draggingNode.active = false;
        this.curveLabel.string = `${this.curve}`;
        this.straightLabel.string = `${this.straight}`;
        this.timeLabel.string = `${this.maxTime -this.time}`;
        this.levelLabel.string = `Level ${this.level+1}`;
        this.bg.spriteFrame = this.bgIcons[this.level];

        this.schedule(this.addTime,1,cc.macro.REPEAT_FOREVER,1);
        console.log(this.posNode);
    }

    /**
     * 关卡内计时
     */
    addTime(){
        if(this.time >= this.maxTime){
            //游戏结束                  todo   失败出口
            this.resultLogic.node.active = true;
            this.resultLogic.showLose(this.level);
            this.unscheduleAllCallbacks();
            return;
        }
        this.time++;
        this.timeLabel.string = `${this.maxTime -this.time}`;
    }


    //拖拽注册
    onDrag() {
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);

    }

    //拖拽注销
    offDrag() {
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.node.off(cc.Node.EventType.TOUCH_START, this.touchStart, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.touchEnd, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
    }

    eventPos;

    touchMove(event: cc.Touch) {
        const p = event.getLocation();
        this.draggingNode.setPosition(this.draggingNode.getParent().convertToNodeSpaceAR(p));

    }

    touchStart(event: cc.Touch) {
        const p = event.getLocation();
        this.eventPos = event.getLocation();

        //判断是不是点击了上面没拉出来的管道
        const borders = this.pipeNode.children.map(getBorder);
        for (let i = 0; i < borders.length; i++) {
            const b = borders[i];
            if (
                this.pipeNode.children[i].active && (
                    p.x > b.left &&
                    p.x < b.right &&
                    p.y > b.bottom &&
                    p.y < b.top)
            ) {
                if (i == 0 && this.straight > 0) {
                    this.draggingNode.active = true;
                    this.changePipeID = 1;
                    this.draggingNode.getComponent(cc.Sprite).spriteFrame = this.pipeIcons[1];
                    this.draggingNode.setPosition(this.draggingNode.getParent().convertToNodeSpaceAR(p));

                    return;
                } else if (i == 1 && this.curve > 0) {
                    this.draggingNode.active = true;
                    this.changePipeID = 2;
                    this.draggingNode.getComponent(cc.Sprite).spriteFrame = this.pipeIcons[2];
                    this.draggingNode.setPosition(this.draggingNode.getParent().convertToNodeSpaceAR(p));

                    return;
                }
            }
        }

        //判断是不是点击了下方的管道
        const borders1 = this.posNode.children.map(getBorder);
        for (let i = 0; i < borders1.length; i++) {
            const b = borders1[i];
            if (
                this.posNode.children[i].active && (
                    p.x > b.left &&
                    p.x < b.right &&
                    p.y > b.bottom &&
                    p.y < b.top) &&
                this.posNode.children[i].opacity == 255
            ) {
                this.draggingNode.active = true;
                let t = this.posNode.children[i].getComponent(PipeItem).type;
                this.draggingNode.getComponent(cc.Sprite).spriteFrame = this.pipeIcons[t];
                this.draggingNode.setPosition(this.draggingNode.getParent().convertToNodeSpaceAR(p));
                this.changeExId = i;
                this.changeExType = t;
                // console.log('点到了下面格子');
                return;
            }
        }

        this.changePipeID = 0;
        this.changeExId = -1;
        this.changeExType = 0;
    }

    touchEnd(event: cc.Touch) {
        const p = event.getLocation();
        let vec2 = this.posNode.convertToNodeSpaceAR(p);

        // 点击旋转？
        if (Math.abs(event.getLocation().x - this.eventPos.x) < 5 && this.draggingNode.active) {
            // console.log('dianji')
            //将开始时坐标赋予触摸跟随节点
            const borders = this.posNode.children.map(getBorder);
            for (let i = 0; i < borders.length; i++) {
                const b = borders[i];
                if (
                    this.posNode.children[i].active && (
                        p.x > b.left &&
                        p.x < b.right &&
                        p.y > b.bottom &&
                        p.y < b.top) &&
                    this.posNode.children[i].opacity == 255
                ) {   //找到了

                    this.posNode.children[i].angle += 90;
                    this.draggingNode.active = false;
                    this.showW(i);
                    
                    // console.log(this.posNode.children[i].angle%360);
                    this.checkResult();
                    this.changeExId = -1;
                    this.changeExType = 0;
                   break;
                }
            }
            this.draggingNode.active = false;

            return;

        }
        // console.log(vec2);
        // 从上方拖动下来的
        if (this.changePipeID != 0) {
            for (let i = 0; i < this.posNode.childrenCount; i++) {
                if (Math.abs(vec2.x - (this.posNode.children[i].x)) < PIPE_GRID_W / 2 &&
                    Math.abs(vec2.y - (this.posNode.children[i].y)) < PIPE_GRID_H / 2 &&
                    this.posNode.children[i].opacity == 1 ) {
                    console.log(i);
                    this.draggingNode.active = false;
                    this.posNode.children[i].opacity = 255;
                    this.posNode.children[i].children[0].getComponent(cc.Sprite).spriteFrame = this.gridIcons[this.changePipeID];
                    this.posNode.children[i].getComponent(PipeItem).init(this.changePipeID);
                    if (this.changePipeID == 1) {
                        this.straight--;
                    } else if (this.changePipeID == 2) {
                        this.curve--;
                    }
                    this.curveLabel.string = `${this.curve}`;
                    this.straightLabel.string = `${this.straight}`;
                    this.changePipeID = 0;
                    this.showW(i);
                    this.checkResult();

                    return;
                }
            }
        }

        // 拖动交换的
        if (this.changeExType != 0) {
            for (let i = 0; i < this.posNode.childrenCount; i++) {
                if (Math.abs(vec2.x - (this.posNode.children[i].x)) < PIPE_GRID_W / 2 &&
                    Math.abs(vec2.y - (this.posNode.children[i].y)) < PIPE_GRID_H / 2&&
                    i != this.changeExId) {
                    console.log(i);
                    this.draggingNode.active = false;
                    if (this.posNode.children[i].opacity == 1) {
                        this.posNode.children[i].opacity = 255;
                        this.posNode.children[i].children[0].getComponent(cc.Sprite).spriteFrame = this.gridIcons[this.changeExType];
                        this.posNode.children[i].getComponent(PipeItem).init(this.changeExType);
                        this.posNode.children[this.changeExId].opacity = 1;
                        this.posNode.children[this.changeExId].children[0].getComponent(cc.Sprite).spriteFrame = this.gridIcons[0];
                        this.posNode.children[this.changeExId].getComponent(PipeItem).init(0);
                       
                    } else {
                        let t = this.posNode.children[i].getComponent(PipeItem).type;
                        this.posNode.children[i].children[0].getComponent(cc.Sprite).spriteFrame = this.gridIcons[this.changeExType];
                        this.posNode.children[i].getComponent(PipeItem).init(this.changeExType);
                        this.posNode.children[this.changeExId].children[0].getComponent(cc.Sprite).spriteFrame = this.gridIcons[t];
                        this.posNode.children[this.changeExId].getComponent(PipeItem).init(t);
                        this.showW(this.changeExId);
                    }
                    this.showW(i);
                    this.changeExId = 0;
                    this.changeExType = 0;
                    this.checkResult();

                    return;
                }
            }
        }

        this.draggingNode.active = false;
        this.changePipeID = 0;
        this.changeExId = -1;
        this.changeExType = 0;
    }

    showW(i){
        console.log(this.posNode.childrenCount);
        let t = this.posNode.children[i].getComponent(PipeItem).type;
        if(t == 1){
            if(this.posNode.children[i].y == this.posNode.children[0].y ){
                console.log(this.posNode.children[i].angle);
                if(this.posNode.children[i].angle%360 == 0 ){
                
                    this.posNode.children[i].children[0].getComponent(cc.Sprite).spriteFrame = this.gridIcons[3];  //直的冒头
                    this.posNode.children[i].children[0].anchorY = 0.45;
                    this.posNode.children[i].children[0].angle = 0;


                }else if(this.posNode.children[i].angle%360 == 180){
                    this.posNode.children[i].children[0].getComponent(cc.Sprite).spriteFrame = this.gridIcons[3];  //直的冒头
                    this.posNode.children[i].children[0].anchorY = 0.45;
                    this.posNode.children[i].children[0].angle = -180;

                }else{
                    this.posNode.children[i].children[0].getComponent(cc.Sprite).spriteFrame = this.gridIcons[1];
                    this.posNode.children[i].children[0].anchorY = 0.5;
                    this.posNode.children[i].children[0].angle = 0;

                }
            }else if(this.posNode.children[i].y == this.posNode.children[this.posNode.childrenCount-1].y){
                if(this.posNode.children[i].angle%360 == 180 ){
                
                    this.posNode.children[i].children[0].getComponent(cc.Sprite).spriteFrame = this.gridIcons[3];  //直的冒头
                    this.posNode.children[i].children[0].anchorY = 0.45;
                    this.posNode.children[i].children[0].angle = 0;


                }else if(this.posNode.children[i].angle%360 == 0){
                    this.posNode.children[i].children[0].getComponent(cc.Sprite).spriteFrame = this.gridIcons[3];  //直的冒头
                    this.posNode.children[i].children[0].anchorY = 0.45;
                    this.posNode.children[i].children[0].angle = -180;

                }else{
                    this.posNode.children[i].children[0].getComponent(cc.Sprite).spriteFrame = this.gridIcons[1];
                    this.posNode.children[i].children[0].anchorY = 0.5;
                    this.posNode.children[i].children[0].angle = 0;

                }
            }
            else{
                this.posNode.children[i].children[0].getComponent(cc.Sprite).spriteFrame = this.gridIcons[1];
                this.posNode.children[i].children[0].anchorY = 0.5;
            }
        }else if(t == 2){
            if(this.posNode.children[i].y == this.posNode.children[0].y){
                if(this.posNode.children[i].angle%360 == 0 ){
                    this.posNode.children[i].children[0].getComponent(cc.Sprite).spriteFrame = this.gridIcons[4];
                    this.posNode.children[i].children[0].scaleX = 1;
                    this.posNode.children[i].children[0].angle = 0;

                    this.posNode.children[i].children[0].anchorY = 0.45;
                }else if(this.posNode.children[i].angle%360 == 90 ){
                    this.posNode.children[i].children[0].getComponent(cc.Sprite).spriteFrame = this.gridIcons[4];  //直的冒头
                    this.posNode.children[i].children[0].scaleX = -1;
                    this.posNode.children[i].children[0].angle = -90;
                    this.posNode.children[i].children[0].anchorY = 0.45;
                }else{
                    this.posNode.children[i].children[0].getComponent(cc.Sprite).spriteFrame = this.gridIcons[2];  
                        this.posNode.children[i].children[0].scaleX = 1;
                        this.posNode.children[i].children[0].angle = 0;
                        this.posNode.children[i].children[0].anchorY = 0.5;
                }
            }else if(this.posNode.children[i].y == this.posNode.children[this.posNode.childrenCount-1].y){
                if(this.posNode.children[i].angle%360 == 180 ){
                    this.posNode.children[i].children[0].getComponent(cc.Sprite).spriteFrame = this.gridIcons[4];
                    this.posNode.children[i].children[0].scaleX = 1;
                    this.posNode.children[i].children[0].angle = 0;

                    this.posNode.children[i].children[0].anchorY = 0.45;
                }else if(this.posNode.children[i].angle%360 == 270 ){
                    this.posNode.children[i].children[0].getComponent(cc.Sprite).spriteFrame = this.gridIcons[4];  //直的冒头
                    this.posNode.children[i].children[0].scaleX = -1;
                    this.posNode.children[i].children[0].angle = -90;
                    this.posNode.children[i].children[0].anchorY = 0.45;
                }else{
                    this.posNode.children[i].children[0].getComponent(cc.Sprite).spriteFrame = this.gridIcons[2];  
                        this.posNode.children[i].children[0].scaleX = 1;
                        this.posNode.children[i].children[0].angle = 0;
                        this.posNode.children[i].children[0].anchorY = 0.5;
                }

            }else{
                this.posNode.children[i].children[0].getComponent(cc.Sprite).spriteFrame = this.gridIcons[2];  
                    this.posNode.children[i].children[0].scaleX = 1;
                    this.posNode.children[i].children[0].angle = 0;
                    this.posNode.children[i].children[0].anchorY = 0.5;
            }
        }
    }

    show;

    /**
     * 结果检测
     */
    checkResult() {
       let ac = this.posNode.children.filter((v) => {
            return v.opacity == 255
        })
        // console.log(ac);
        if (ac.length !=
            (PIPE_LEVEL_PIPE_DATA[this.level][0] + PIPE_LEVEL_PIPE_DATA[this.level][1])) {
            console.log('管子还没下完');
            return false;
        }

        this.show = this.posNode.children.filter((v) => {
            return v.opacity == 255
        })

        // console.log(show);

        if (this.show.find((v) => {
            return v.y == this.posNode.children[0].y
        }) == undefined) {
            console.log('管子没头');
            return false;
        }

        if (this.show.find((v) => {
            return v.y == this.posNode.children[this.posNode.childrenCount - 1].y
        }) == undefined) {
            console.log('管子没尾');
            return false;
        }

        // if(this.show[0].getComponent(PipeItem).type == 1 && (this.show[0].angle%360 == 90 || this.show[0].angle%360 == 270)){
        //     console.log('直管口没朝上')
        //     console.log(this.show[0].angle%360)
        //     return false;
        // }

        // if(this.show[0].getComponent(PipeItem).type == 2 && (this.show[0].angle%360 == 270 || this.show[0].angle%360 == 180)){
        //     console.log('弯管口没朝上')
        //     return false;
        // }

        // if(this.show[(PIPE_LEVEL_PIPE_DATA[this.level][0] + PIPE_LEVEL_PIPE_DATA[this.level][1])-1].getComponent(PipeItem).type == 1 &&
        //     (this.show[(PIPE_LEVEL_PIPE_DATA[this.level][0] + PIPE_LEVEL_PIPE_DATA[this.level][1])-1].angle%360 == 90 ||
        //         this.show[(PIPE_LEVEL_PIPE_DATA[this.level][0] + PIPE_LEVEL_PIPE_DATA[this.level][1])-1].angle%360 == 270)){
        //     console.log('直管口没朝下')
        //     return false;
        // }
        //
        // if(this.show[(PIPE_LEVEL_PIPE_DATA[this.level][0] + PIPE_LEVEL_PIPE_DATA[this.level][1])-1].getComponent(PipeItem).type == 2 &&
        //     (this.show[(PIPE_LEVEL_PIPE_DATA[this.level][0] + PIPE_LEVEL_PIPE_DATA[this.level][1])-1].angle%360 == 0 ||
        //         this.show[(PIPE_LEVEL_PIPE_DATA[this.level][0] + PIPE_LEVEL_PIPE_DATA[this.level][1])-1].angle%360 == 90)){
        //     console.log('弯管口没朝下')
        //     return false;
        // }

        let ss = [];
        for(let i = 0;i < this.show.length;i++){
            ss.push(this.show[i]);
        }
        let res = []
        for(let i = 0;i < ss.length;i++){
            // this.ccc(show,i)
            let c = this.ccc(ss,i);
            if(!c){
                let o = this.outPos.find((v)=>{return  v.x == ss[i].x && v.y == ss[i].y})
                if(o == undefined){
                    console.log('最后一个管道位置不对')
                    return false
                }
                console.log(i);
                console.log(ss[i]);
                // ss[i].color = new cc.Color(125,125,125,255);
                if(ss[i].y == -PIPE_GRID_H/2){
                    if(ss[i].getComponent(PipeItem).type == 1  && (ss[i].angle%360 == 90 || ss[i].angle%360 == 270)){
                        console.log('直管口没朝上')
                        return false;
                    }
                    if(ss[i].getComponent(PipeItem).type == 2 && (ss[i].angle%360 == 270 || ss[i].angle%360 == 180)){
                        console.log('弯管口没朝上')
                        return false;
                    }
                }else if(ss[i].y == this.posNode.children[this.posNode.childrenCount-1].y){
                    if(ss[i].getComponent(PipeItem).type == 1 &&
                        (ss[i].angle%360 == 90 ||
                            ss[i].angle%360 == 270)){
                        console.log('直管口没朝下')
                        return false;
                    }

                    if(ss[i].getComponent(PipeItem).type == 2 &&
                        (ss[i].angle%360 == 0 ||
                            ss[i].angle%360 == 90)){
                        console.log('弯管口没朝下')
                        return false;
                    }
                }
            }
            // ss[i].color = new cc.Color(255,255,255,255);

            res.push(c)
            // console.log(this.ccc(ss,i),i);
            // console.log(this.show);
        }
        // console.log(res);
        let r = res.filter((v)=>{return v == false})
        if(r.length == 1){              // todo  胜利出口
            console.log('胜利');
            this.offDrag();
            for(let i = 0; i <ss.length;i++ ){
                cc.tween(ss[i])
                .to(0.2,{opacity:1})
                .to(0.2,{opacity:255})
                .to(0.2,{opacity:1})
                .to(0.2,{opacity:255})
                .call(()=>{
                    // this.showResult();
                })
                .start();
            }
            setTimeout(() => {
                this.showResult();
            }, 800);
            
            
        }

    }

    showResult(){
        this.resultLogic.node.active = true;
        // this.resultLogic.node.scale = 0;
        // cc.tween(this.resultLogic.node)
        // .to(0.5,{scale:1})
        // .start();
        this.resultLogic.showWin(this.level,this.time < 40 ? 3 :this.time < 50 ? 2 : 1);
        this.unscheduleAllCallbacks();
    }

    /**
     * 根据角度去寻找下一个管道的位置，找不到返回 false 找到对应位置有管道后根据其角度返回TRUE 或 false
     * @param show   所有管道的节点数组
     * @param i      第几个  其实可以写成一个，但初始写了，后面懒得改，就没改
     */
    ccc(show,i){
        if(show[i].angle%360 == 0){
            if(show[i].getComponent(PipeItem).type == 1){
                let a = this.show.findIndex((v)=>{return  v.x == show[i].x && v.y+PIPE_GRID_H == show[i].y})
                if(a != -1){
                    if(this.show[a].getComponent(PipeItem).type == 1){
                        if(this.show[a].angle%360 == 0 || this.show[a].angle%360 == 180){
                            this.show.splice(a,1);
                            return true;
                        }else {
                            return false;
                        }
                    }else if(this.show[a].getComponent(PipeItem).type == 2){
                        if(this.show[a].angle%360 == 0 || this.show[a].angle%360 == 90){
                            this.show.splice(a,1);

                            return true;

                        }else {
                            return false;
                        }
                    }
                }else {
                    return false;
                }
            }else if(show[i].getComponent(PipeItem).type == 2){
                let a = this.show.findIndex((v)=>{return  v.x - PIPE_GRID_W == show[i].x && v.y == show[i].y})

                if(a != -1){
                    if(this.show[a].getComponent(PipeItem).type == 1){
                        if(this.show[a].angle%360 == 90 || this.show[a].angle%360 == 270){
                            this.show.splice(a,1);

                            return true;

                        }else {
                            return false;
                        }
                    }else if(this.show[a].getComponent(PipeItem).type == 2){
                        if(this.show[a].angle%360 == 90 || this.show[a].angle%360 == 180){
                            this.show.splice(a,1);

                            return true;

                        }else {
                            return false;
                        }
                    }
                }else {
                    return false;
                }
            }

        }else if(show[i].angle%360 == 90){
            if(show[i].getComponent(PipeItem).type == 1){
                let a = this.show.findIndex((v)=>{return   (v.x-PIPE_GRID_W == show[i].x && v.y == show[i].y)
                    ||(v.x+PIPE_GRID_W == show[i].x && v.y == show[i].y)})

                if(a != -1){
                    if(this.show[a].getComponent(PipeItem).type == 1){
                        if(this.show[a].angle%360 == 90 || this.show[a].angle%360 == 270){
                            this.show.splice(a,1);

                            return true;

                        }else {
                            return false;
                        }
                    }else if(this.show[a].getComponent(PipeItem).type == 2){
                        if(this.show[a].angle%360 == 90 || this.show[a].angle%360 == 180){
                            this.show.splice(a,1);

                            return true;

                        }else {
                            return false;
                        }
                    }
                }else {
                    return false;
                }
            }else if(show[i].getComponent(PipeItem).type == 2){
                let a = this.show.findIndex((v)=>{return   v.x+PIPE_GRID_W == show[i].x && v.y == show[i].y})

                if(a != -1){
                    if(this.show[a].getComponent(PipeItem).type == 1){
                        if(this.show[a].angle%360 == 90 || this.show[a].angle%360 == 270){
                            this.show.splice(a,1);

                            return true;

                        }else {
                            return false;
                        }
                    }else if(this.show[a].getComponent(PipeItem).type == 2){
                        if(this.show[a].angle%360 == 0 || this.show[a].angle%360 == 270){
                            this.show.splice(a,1);

                            return true;

                        }else {
                            return false;
                        }
                    }
                }else {
                    return false;
                }
            }
        } else if(show[i].angle%360 == 180){
            if(show[i].getComponent(PipeItem).type == 1){
                let a = this.show.findIndex((v)=>{return  v.x == show[i].x && v.y+PIPE_GRID_H == show[i].y})

                if(a != -1){
                    if(this.show[a].getComponent(PipeItem).type == 1){
                        if(this.show[a].angle%360 == 0 || this.show[a].angle%360 == 180){
                            this.show.splice(a,1);

                            return true;

                        }else {
                            return false;
                        }
                    }else if(this.show[a].getComponent(PipeItem).type == 2){
                        if(this.show[a].angle%360 == 0 || this.show[a].angle%360 == 90){
                            this.show.splice(a,1);

                            return true;

                        }else {
                            return false;
                        }
                    }
                }else {
                    return false;
                }
            }else if(show[i].getComponent(PipeItem).type == 2){
                let a = this.show.findIndex((v)=>{return  v.x == show[i].x && v.y+PIPE_GRID_H == show[i].y})

                if(a != -1){
                    if(this.show[a].getComponent(PipeItem).type == 1){
                        if(this.show[a].angle%360 == 0 || this.show[a].angle%360 == 180){
                            this.show.splice(a,1);

                            return true;

                        }else {
                            return false;
                        }
                    }else if(this.show[a].getComponent(PipeItem).type == 2){
                        if(this.show[a].angle%360 == 90 || this.show[a].angle%360 == 0){
                            this.show.splice(a,1);

                            return true;

                        }else {
                            return false;
                        }
                    }
                }else {
                    return false;
                }
            }
        } else if(show[i].angle%360 == 270){
            if(show[i].getComponent(PipeItem).type == 1){
                let a = this.show.findIndex((v)=>{return (v.x-PIPE_GRID_W == show[i].x && v.y == show[i].y)
                    ||(v.x+PIPE_GRID_W == show[i].x && v.y == show[i].y)})

                if(a != -1){
                    if(this.show[a].getComponent(PipeItem).type == 1){
                        if(this.show[a].angle%360 == 90 || this.show[a].angle%360 == 270){
                            this.show.splice(a,1);

                            return true;

                        }else {
                            return false;
                        }
                    }else if(this.show[a].getComponent(PipeItem).type == 2){
                        if(this.show[a].angle%360 == 90 || this.show[a].angle%360 == 180){
                            this.show.splice(a,1);

                            return true;

                        }else {
                            return false;
                        }
                    }
                }else {
                    return false;
                }
            }else if(show[i].getComponent(PipeItem).type == 2){
                let a = this.show.findIndex((v)=>{return v.x == show[i].x && v.y+PIPE_GRID_H == show[i].y})
                if(a != -1){
                    if(this.show[a].getComponent(PipeItem).type == 1){
                        if(this.show[a].angle%360 == 0 || this.show[a].angle%360 == 180){
                            this.show.splice(a,1);

                            return true;

                        }else {
                            return false;
                        }
                    }else if(this.show[a].getComponent(PipeItem).type == 2){
                        if(this.show[a].angle%360 == 90 || this.show[a].angle%360 == 0){
                            this.show.splice(a,1);

                            return true;

                        }else {
                            return false;
                        }
                    }
                }else {
                    return false;
                }
            }
        }
    }


}


export class NodeBorder {
    top: number;
    bottom: number;
    left: number;
    right: number;

    constructor(top: number, bottom: number, left: number, right: number) {
        this.top = top;
        this.bottom = bottom;
        this.left = left;
        this.right = right;
    }
}

export function getBorder(node: cc.Node): NodeBorder {
    const p = node.convertToWorldSpaceAR(cc.v2(0, 0));
    return new NodeBorder(
        p.y + node.height / 2,
        p.y - node.height / 2,
        p.x - node.width / 2,
        p.x + node.width / 2
    );
}

export function inBorder(b: NodeBorder, p: { x: number, y: number }) {
    return p.x > b.left &&
        p.x < b.right &&
        p.y > b.bottom &&
        p.y < b.top;
}


export const PIPE_ANSWERS = [
    {
        title:'“0蔗糖”就是无糖',
        ans:false,
        dec:'0蔗糖不代表无糖。“0蔗糖”可理解为未添加蔗糖，但并不代表该食品内不含葡萄糖、麦芽糖、果糖等其他糖类。“0糖”和“0蔗糖”表示的含糖成分、含糖量截然不同，有着本质的区别。'
    },
    {
        title:'不添加食品添加剂的食品更安全',
        ans:false,
        dec:'是否加入食品添加剂是由食品性质和生产工艺决定的。蛋白质含量较高的食品，必须添加一定量的防腐剂以确保食品质量安全。在A食品中无毒的添加剂，在B食品中可能就严禁添加。因此，不能单纯以是否有食品添加剂来判定食品的安全性。'
    },
    {
        title:'无菌蛋生吃营养价值更高',
        ans:false,
        dec:'所谓无菌蛋，一般指经过巴氏杀菌以及严格加工处理过的鸡蛋。无菌蛋的生产过程管控严格，因此成本较高。喜爱吃溏心鸡蛋、生鸡蛋的消费者，无菌蛋是理想选择。但生吃鸡蛋的蛋白质吸收率较低，只有55%，而水煮蛋高达91%。因为生鸡蛋中有一些蛋白酶抑制剂，会影响蛋白质的消化吸收。长期生吃鸡蛋还可能造成生物素（一种B族维生素）缺乏。因此，从营养角度说，生吃鸡蛋不如熟吃好。另外，如果要完全排除沙门氏菌等致病菌的风险，还是建议将鸡蛋煮熟后食用。'
    },
    {
        title:'超过 3 个月的冷冻肉，对人体有害',
        ans:false,
        dec:'在冷冻温度下，微生物停止生产，生化反应停止进行，这意味着，不会有危害健康的物质出现。三个月的冷冻肉除了口感差一点，营养差一点，并不会对人体有啥危害。\n' +
            '需要注意的是：解冻后的肉，一定要及时烹饪，避免滋生过多的细菌。'
    },
    {
        title:'酱油吃多了，皮肤会变黑',
        ans:false,
        dec:'酱油中有“酪氨酸”，但食物中酪氨酸含量对肤色几乎没有影响。酱油作为调料食用之后可以被消化系统降解、吸收,并被吸收入体内,最后通过排泄器官将其排出,因此进食酱油会变黑没有理论依据。皮肤有了伤口以后，不用担心吃盘酱油炒饭就会出现色素沉着了。'
    },
    {
        title:'催熟的果蔬会引起性早熟',
        ans:false,
        dec:'植物激素与动物激素有非常大的差别，植物激素大多是小分子，而动物激素主要是大分子的蛋白质和多肽，两者的化学结构不同，受体和作用机理也完全不一样，植物激素不会对人体有影响，就像花粉不会让人怀孕一样。儿童性早熟和环境雌激素有关，所以女孩子性早熟的比男孩子多，因为是环境雌激素，而不是环境雄激素，这和我们用的药物，化学洗涤用品和避孕药有关，这些讲解之后会产生环境雌激素，不仅是中国，也是个新的世界性问题。'
    },
    {
        title:'隔夜茶不能喝，致癌',
        ans:false,
        dec:'茶叶经放置过夜后，其中的一些二级胺类物质可以转变形成致癌物——亚硝胺。但二级胺类物质并非茶汤中所特有，而是广泛存在于很多食物中，尤以腌腊制品中含量最多，就算“隔夜茶”有，也是少量的，你想想，你每天喝的茶才几克，残余到最后的就更少，远低于人们从任何一种主食或蔬菜中摄入的量。而且，这种二级胺类物质需要在特定条件下与硝酸盐共同存在、并发生化学反应才能形成亚硝胺，后者才是致癌的，而亚硝胺要达到每千克体重吸收100至200毫克才有可能致癌，你得喝多少隔夜剩茶呀？'
    },
    {
        title:'奶皮越厚牛奶越好',
        ans:false,
        dec:'牛奶煮沸后形成的奶皮是牛奶中的乳脂肪成分受热后上浮，并吸附牛奶中酪蛋白、乳清蛋白等蛋白成分后聚集到牛奶表面形成的，但这并不代表它更营养更好。在现代奶业加工中，所有的原料奶在生产加工过程中都会经过一步处理——均质工艺。这个工艺会让牛奶中的脂肪破碎的更加细小，从而使整个产品体系更加稳定，使牛奶看起来更加洁白细腻。所以，经过均质化加工较未加工过的生鲜牛奶，其所形成的奶皮要薄，甚至肉眼看不出奶皮，喝起来的口感也更细腻爽滑。'
    },
    {
        title:'经常吃腐乳会致癌',
        ans:false,
        dec:'不能把腐乳和盐、腌菜混为一谈，“大豆中的亚硝酸盐非常低，即使长达几个月的发酵也不会带来大量的亚硝酸盐，正确食用腐乳不会致癌”。事实上，制作腐乳是以毛霉菌为主，也包括少量的经过特定方法严选的酵母菌、曲霉、青霉，但这些都是经过严选的有益食用菌，不会产生毒素。此外，红曲色素是红曲菌产生的天然色素，对人体十分安全。'
    },
    {
        title:'反季节果蔬会有农药',
        ans:false,
        dec:'反季水果主要是通过长期保存、大棚种植以及异地种植三种方式获得。反季水果与应季水果的营养和口感会有差异，但是这并不代表它们没有营养或者有毒有害。只要规范种植的水果，农药残留都不超标，正常食用不会对人体健康产生危害，都是可以放心食用的。相比没有水果供应，反季水果对人们的营养获得有很大帮助。还有人担心果蔬农药残留。其实我国绝大部分水果和蔬菜中的农药残留均未超标，并且用清水冲洗、削皮等简单处理就可以去除部分农药残留。'
    },
]