import { E_GameData_Type, GameDataMgr } from "../framework/GameDataMgr";
import { Observer } from "../framework/Observer";
import PipeItem from "./PipeItem";
import ResultLogic from "./ResultLogic";

const {ccclass, property} = cc._decorator;

// const PIPE_GRID_W = 164;           //格子宽度
// const PIPE_GRID_H = 164;           //格子高度
const PIPE_Time = 90;           //游戏时间
// const PIPE_LEVEL_DATA = [          //几列*几行
//     [3, 3],
//     [3, 3],
//     [3, 3],
//     [3, 4],
//     [3, 4],
//     [3, 4],
//     [4, 4],
//     [4, 4],
//     [4, 5],
//     [4, 5],
// ];

// const PIPE_LEVEL_PIPE_DATA = [          //管道数量  直的 弯的
//     [2, 2],
//     [2, 2],
//     [2, 2],
//     [3, 2],
//     [3, 2],
//     [3, 2],
//     [3, 2],
//     [4, 2],
//     [3, 4],
//     [3, 4],
// ];

// const PIPE_OUT = [              //管道出口
//     [[0,2],[1,2],[2,2]],
//     [[1,2],[2,2]],
//     [[1,2]],
//     [[0,3],[1,3],[2,3]],
//     [[1,3],[2,3]],
//     [[1,3]],
//     [[1,3]],
//     [[2,3]],
//     [[2,4]],
//     [[2,4]],
//
// ]

const PIPE_LEVEL_DATA = [     //关卡地图信息  [0(直管)/1（弯管），0,90,180,270（旋转角度）]
    [
        [1,270],[0,90],[0,90],[1,90],
        [],[],[],[0,0],
        [],[],[],[0,0],
    ],
  [
       [0,0],[],[],[],
       [0,0],[],[],[],
       [1,270],[0,90],[0,90],[1,90],
    ],
  [
       [0,0],[],[],[],
       [1,270],[0,90],[1,0],[],
       [],[],[1,270],[1,0],
    ],
  [
       [1,270],[1,90],[],[],
       [],[0,0],[],[],
       [],[1,0],[0,90],[1,180],
    ],
  [
       [1,270],[0,0],[1,0],[],
       [],[],[0,0],[],
       [],[],[1,90],[1,90],
    ],
  [
       [1,270],[0,90],[1,90],[],
       [],[1,0],[1,90],[],
       [],[1,0],[0,90],[1,0],
    ],
  [
       [1,0],[1,90],[],[],
       [1,0],[1,90],[],[],
       [1,0],[0,90],[0,90],[1,90],
    ],
  [
       [1,0],[1,90],[],[],
       [1,180],[1,0],[1,0],[1,0],
       [1,180],[0,0],[1,0],[0,0],
    ],
  [
       [1,0],[1,90],[],[],
       [],[0,0],[1,0],[1,90],
       [],[1,0],[1,90],[0,0],
    ],
  [
       [1,270],[1,90],[1,270],[1,0],
       [1,180],[1,0],[0,0],[0,0],
       [1,180],[0,0],[1,90],[0,0],
    ],


]

const PIPE_LEVEL_DATA_TARGET = [    // 关卡目标地图信息
    [
        [1,90],[0,0],[0,0],[1,270],
        [],[],[],[0,90],
        [],[],[],[0,90],
    ],
    [
        [0,90],[],[],[],
        [0,90],[],[],[],
        [1,90],[0,0],[0,0],[1,270],
    ],
    [
        [0,90],[],[],[],
        [1,90],[0,0],[1,270],[],
        [],[],[1,90],[1,270],
    ],
    [
        [1,90],[1,270],[],[],
        [],[0,90],[],[],
        [],[1,90],[0,0],[1,270],
    ],
    [
        [1,90],[0,0],[1,270],[],
        [],[],[0,90],[],
        [],[],[1,90],[1,270],
    ],
    [
        [1,90],[0,0],[1,270],[],
        [],[1,0],[1,180],[],
        [],[1,90],[0,0],[1,270],
    ],
    [
        [1,90],[1,270],[],[],
        [1,0],[1,180],[],[],
        [1,90],[0,0],[0,0],[1,270],
    ],
    [
        [1,90],[1,270],[],[],
        [1,0],[1,180],[1,0],[1,270],
        [1,90],[0,0],[1,180],[0,90],
    ],
    [
        [1,90],[1,270],[],[],
        [],[0,90],[1,0],[1,270],
        [],[1,90],[1,180],[0,90],
    ],
    [
        [1,90],[1,270],[1,0],[1,270],
        [1,0],[1,180],[0,90],[0,90],
        [1,90],[0,0],[1,180],[0,90],
    ],

]

const PIPE_SHU_POS = [   //弯的水管不同角度的坐标
    [23,-20],
    [23,25],
    [-25,23],
    [-20,-20],
]

@ccclass
export default class PipeLogic extends cc.Component {


    @property(cc.Label) timeLabel: cc.Label = null;   //时间文本，暂时没用到
    @property(cc.Label) levelLabel: cc.Label = null;  //关卡文本

    // @property([cc.SpriteFrame]) pipeIcons: cc.SpriteFrame[] = [];
    // @property([cc.SpriteFrame]) gridIcons: cc.SpriteFrame[] = [];
    // @property([cc.SpriteFrame]) bgIcons: cc.SpriteFrame[] = [];
    @property(cc.Node) map:cc.Node = null;    //地图父节点

    @property(ResultLogic) resultLogic:ResultLogic = null;   //结算脚本
    @property(cc.Sprite) timeImg:cc.Sprite = null;  //时间进度条

    mapData; //位置信息

    curve: number = 0;   //弯的
    straight: number = 0;  //直的
    // changePipeID: number = -1;
    // changeExId: number = -1;
    // changeExType: number = -1;
    level: number = 0;
    time:number = 0;
    maxTime:number = 0;

    // outPos;

    onLoad(){
        Observer.on("aa",function(id:any){
            this.init(id);
        },this);
    }

    // 竖的   0 （23，-20）   90（23,25）  180（-25,23）   270（-20，-20）

    protected onEnable() {
        // this.init(0);
        let levNum = Number(GameDataMgr.getDataByType(E_GameData_Type.ClickPassLv));
        let lev = levNum;
        this.init(lev);
       
    }


    /**
     * 初始化
     * @param level  关卡，0开始，超出配置均已最高值算
     */
    init(level: number) {
        this.resultLogic.node.active = false;
        if (level >= PIPE_LEVEL_DATA.length) {
            level = PIPE_LEVEL_DATA.length - 1;
        }
        this.mapData = [];
        // this.outPos = [];

        // console.log(this.outPos);

        this.level = level;
        this.time = 0;
        this.maxTime = PIPE_Time;

        // this.timeLabel.string = `${this.maxTime -this.time}`;
        this.levelLabel.string = `Level ${this.level+1}`;
        this.timeImg.fillRange = 1;

        // 初始化地图
        for(let i = 0; i < this.map.childrenCount;i++){
            this.map.children[i].children[0].active = PIPE_LEVEL_DATA[level][i].length > 0 && PIPE_LEVEL_DATA[level][i][0] == 0;
            this.map.children[i].children[1].active = PIPE_LEVEL_DATA[level][i].length > 0 && PIPE_LEVEL_DATA[level][i][0] == 1;
            if(this.map.children[i].children[0].active){
                this.map.children[i].children[0].angle = PIPE_LEVEL_DATA[level][i][1];
            }
            if(this.map.children[i].children[1].active){
                this.map.children[i].children[1].angle = PIPE_LEVEL_DATA[level][i][1];
                this.map.children[i].children[1].position = new cc.Vec3(PIPE_SHU_POS[backNumber(PIPE_LEVEL_DATA[level][i][1])][0],PIPE_SHU_POS[backNumber(PIPE_LEVEL_DATA[level][i][1])][1],0);
            }
        }

        this.schedule(this.addTime,0.1,cc.macro.REPEAT_FOREVER,1);
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
        this.time+=0.1;
        // this.timeLabel.string = `${this.maxTime -this.time}`;
        this.timeImg.fillRange = Math.max(0,Math.min(1,(this.maxTime - this.time)/this.maxTime)) ;
    }

    // 点击旋转
    onClickRotation(event,data){
        let a = parseInt(data);
        if(this.map.children[a].children[0].active){
            this.map.children[a].children[0].angle+=90;
        }
        if(this.map.children[a].children[1].active){
            this.map.children[a].children[1].angle+=90;
            this.map.children[a].children[1].position = new cc.Vec3(PIPE_SHU_POS[backNumber(this.map.children[a].children[1].angle)][0],PIPE_SHU_POS[backNumber(this.map.children[a].children[1].angle)][1],0);
        }
        this.checkResult();
    }

    //检查是否成功
    checkResult(){
        for(let i = 0; i < this.map.childrenCount;i++){
            console.log(i);
            if(this.map.children[i].children[0].active){
                console.log(this.map.children[i].children[0].angle%180);
                console.log(PIPE_LEVEL_DATA_TARGET[this.level][i][1]);
                if(this.map.children[i].children[0].angle%180 != PIPE_LEVEL_DATA_TARGET[this.level][i][1]){
                    return false
                }
            }
            if(this.map.children[i].children[1].active){
                console.log(this.map.children[i].children[1].angle%360);
                console.log(PIPE_LEVEL_DATA_TARGET[this.level][i][1]);
                if(this.map.children[i].children[1].angle%360 != PIPE_LEVEL_DATA_TARGET[this.level][i][1]){
                    return false
                }
            }
        }
        console.log('成功');
        //   todo 成功出口 需要更改什么的在这更改
        this.resultLogic.node.active = true;
        this.resultLogic.showWin(this.level,this.time < 40 ? 3 :this.time < 80 ? 2 : 1);
        this.unscheduleAllCallbacks();
        return;
    }




}

export function backNumber(p){
    let a = p%360;
    switch (a){
        case 0:
            return 0;
        case 90:
            return 1;

        case 180:
            return 2;

        case 270:
            return 3;

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