import { audioConfig, GameMassage } from "../config/Config";
import { AudioMgr } from "../framework/AudioMgr";
import { Observer } from "../framework/Observer";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Obstacles extends cc.Component {


    onLoad(){
        cc.director.getCollisionManager().enabled=true; //这是一个全局属性，开启后就代表碰撞检测组件可以进行检测了
        // cc.director.getCollisionManager().enabledDebugDraw = true;                          
    }
    start() {

    }

    onCollisionEnter(other, self) {
        // console.log('碰撞了');
        // console.log(other);
        let propName =  other.node._name;
        let thId = propName.substr(2);
        if(GameMassage.fourNum == 1){
            if(thId == "3" || thId == "6" || thId == "8"){
                AudioMgr.playAudioEffect(audioConfig.zqSound);
                Observer.emit('collision');
                Observer.emit("zq");
            }else{
                AudioMgr.playAudioEffect(audioConfig.cwSound);
                GameMassage.num += 1;
                Observer.emit("cw");
                if(GameMassage.num>=3){
                    Observer.emit("gameover");
                    
                }
            }
        }else if(GameMassage.fourNum == 2){
            if(thId == "1" || thId == "2" || thId == "3" || thId == "5"){
                AudioMgr.playAudioEffect(audioConfig.zqSound);
                Observer.emit('collision');
                Observer.emit("zq");
            }else{
                AudioMgr.playAudioEffect(audioConfig.cwSound);
                GameMassage.num += 1;
                Observer.emit("cw");
                if(GameMassage.num>=3){
                    Observer.emit("gameover");
                    
                }
            }
        }
        else if(GameMassage.fourNum == 3){
            if(thId == "1" || thId == "4" || thId == "5" || thId == "6" || thId == "7" || thId == "8"){
                AudioMgr.playAudioEffect(audioConfig.zqSound);
                Observer.emit('collision');
                Observer.emit("zq");
            }else{
                AudioMgr.playAudioEffect(audioConfig.cwSound);
                GameMassage.num += 1;
                Observer.emit("cw");
                if(GameMassage.num>=3){
                    Observer.emit("gameover");
                    
                }
            }
        }
        else if(GameMassage.fourNum == 4){
            if(thId == "4" || thId == "6" || thId == "7" || thId == "8" || thId == "9"){
                AudioMgr.playAudioEffect(audioConfig.zqSound);
                Observer.emit('collision');
                Observer.emit("zq");
            }else{
                AudioMgr.playAudioEffect(audioConfig.cwSound);
                GameMassage.num += 1;
                Observer.emit("cw");
                if(GameMassage.num>=3){
                    Observer.emit("gameover");
                    
                }
            }
        }else if(GameMassage.fourNum == 5){
            if(thId == "1" || thId == "4" || thId == "5" || thId == "6" || thId == "2" || thId == "11"){
                AudioMgr.playAudioEffect(audioConfig.zqSound);
                Observer.emit('collision');
                Observer.emit("zq");
            }else{
                AudioMgr.playAudioEffect(audioConfig.cwSound);
                GameMassage.num += 1;
                Observer.emit("cw");
                if(GameMassage.num>=3){
                    Observer.emit("gameover");
                    
                }
            }
        }
        // other.node.y = 996;
        // other.node.opacity = 0;
        
    }

    private onCollisionStay(other, self) {
        // console.log('现在正在有交集');
    }

    private onCollisionExit(other, self) {
        // console.log('现在刚离开')
    }
}
