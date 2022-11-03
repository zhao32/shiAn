const {ccclass, property} = cc._decorator;

@ccclass
export default class PipeItem extends cc.Component {


    type:number = 0;

    init(type){
        this.type = type;
    }

}
