import { ApiUrl, GameMassage, GoodsConfig, RankConfig} from "../config/Config";
import UI_Tip from "../ui/UI_Tip";
import { E_GameData_Type, GameDataMgr } from "./GameDataMgr";
import MD5 from "./MD5";
import { UIManager } from "./UIManager";

/** 网络封装 */
export const NetWork = new class{

   /** 有参数POST接口封装
     * @param url 请求地址
     * @param data 请求参数(会签名)
     * @param callback 回调函数
     */
    noTokenParametersPost(url,param, callback){
        //2.发起请求
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            console.log(xhr.readyState);
            if (xhr.readyState == 4){
                console.log(xhr.status);
                if(xhr.status >= 200 && xhr.status < 400){
                    console.log(xhr.responseText);
                    var response = xhr.responseText;
                    if(response){
                        var responseJson = JSON.parse(response);
                        if(responseJson.code == 0){
                            callback(responseJson,responseJson.msg);
                        }else if(responseJson.code == 1){
                            console.log("返回数据失败")
                            callback(false,responseJson.msg);
                        }
                    }else{
                        console.log("返回数据不存在")
                        callback(false);
                    }
                }else{
                    console.log("请求失败")
                    callback(false);
                }
            }
        };
        xhr.open("POST",url, true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded'); 
        xhr.send(param);//reqData为字符串形式： "key=value"
    };
    
    /** 空参数POST接口封装
     * @param url 请求地址
     * @param data 请求参数(会签名)
     * @param callback 回调函数
     */
    emptyParametersPost(url, callback){
        //2.发起请求
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4){
                if(xhr.status >= 200 && xhr.status < 400){
                    var response = xhr.responseText;
                    if(response){
                        var responseJson = JSON.parse(response);
                        callback(responseJson);
                    }else{
                        console.log("返回数据不存在")
                        callback(false);
                    }
                }else{
                    console.log("请求失败")
                    callback(false);
                }
            }
        };
        xhr.open("POST",url, true);

        let isNeedToken = GameDataMgr.getDataByType(E_GameData_Type.AppToken);
        // let isNeedToken = ApiUrl.token;
        if (isNeedToken != "") {
            xhr.setRequestHeader('Authorization', "Bearer " + isNeedToken);
        }
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded;charset=utf-8');
        xhr.send();
    };

    /** 有参数POST接口封装
     * @param url 请求地址
     * @param data 请求参数(会签名)
     * @param callback 回调函数
     */
     haveParametersPost(url,param, callback){
        //2.发起请求
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4){
                console.log(xhr.status);
                if(xhr.status >= 200 && xhr.status < 400){
                    var response = xhr.responseText;
                    if(response){
                        var responseJson = JSON.parse(response);
                        // console.log(responseJson);
                        if(responseJson.code == 0){
                            callback(responseJson,responseJson.msg);
                        }else if(responseJson.code == 1){
                            console.log("返回数据失败")
                            callback(false,responseJson.msg);
                        }
                    }else{
                        console.log("返回数据不存在")
                        callback(false);
                    }
                }else{
                    console.log("请求失败")
                    callback(false);
                }
            }
        };
        xhr.open("POST",url, true);
        let isNeedToken = GameDataMgr.getDataByType(E_GameData_Type.AppToken);
        console.log(isNeedToken);
        if (isNeedToken != "") {
            xhr.setRequestHeader('Token',isNeedToken);
        }
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded'); 
        xhr.send(param);//reqData为字符串形式： "key=value"
    };

    /** 接口
     * @param url 请求地址
     * @param data 请求参数(会签名)
     * @param callback 回调函数
     */
     emptyTokeGet(url, callback){
        //2.发起请求
        var thiss = this;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4){
                if(xhr.status >= 200 && xhr.status < 400){
                    var response = xhr.responseText;
                    if(response){
                        // thiss.wxGetUserInfo()
                        var responseJson = JSON.parse(response);
                        callback(responseJson);
                    }else{
                        console.log("返回数据不存在")
                        callback(false);
                    }
                }else{
                    console.log("请求失败")
                    callback(false);
                }
            }
        }
        
        xhr.open("GET",url, true);
        xhr.setRequestHeader("Content-Type" , "application/x-www-form-urlencoded");  
        xhr.send();//reqData为字符串形式： "key=value"
    }
    
    /** 接口
     * @param url 请求地址
     * @param data 请求参数(会签名)
     * @param callback 回调函数
     */
     haveTokeGet(url, callback){
        //2.发起请求
        var thiss = this;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4){
                if(xhr.status >= 200 && xhr.status < 400){
                    var response = xhr.responseText;
                    if(response){
                        // thiss.wxGetUserInfo()
                        var responseJson = JSON.parse(response);
                        callback(responseJson);
                    }else{
                        console.log("返回数据不存在")
                        callback(false);
                    }
                }else{
                    console.log("请求失败")
                    callback(false);
                }
            }
        };
        
        xhr.open("GET",url, true);
        let isNeedToken = GameDataMgr.getDataByType(E_GameData_Type.AppToken);
        // let isNeedToken = ApiUrl.token;
        if (isNeedToken != "") {
            xhr.setRequestHeader('Authorization', "Bearer " + isNeedToken);
        }
        xhr.setRequestHeader("Content-Type" , "application/x-www-form-urlencoded");  
        xhr.send();//reqData为字符串形式： "key=value"
    };

    /**登陆 */
    setLoginMessage(name:string,password:string,callback){
        let na = name;
        let ps = password;
        console.log(na);
        console.log(ps);
        let rbUrl = ApiUrl.appUrl+"/game.api?";
        var obj = 'c=auth&a=login&username=' + na +'&password=' + ps+'';
        console.log("地址：" + rbUrl); 
        // let para={
        //     "usename": na,
        //     "password": ps,
        // }
        // let pra = JSON.stringify(para);
        this.noTokenParametersPost(rbUrl,obj,(res,msg)=>{ 
            if(res !=null){
                if (res) {
                    console.log(res);
                    console.log("请求成功");
                    let name = res.data.userInfo.nickname;
                    let cusid = res.data.userInfo.cusid;
                    let add = res.data.userInfo.address;
                    let token = res.data.userInfo.token;
                    GameMassage.name = name;
                    GameMassage.cusid = cusid;
                    GameMassage.add = add;

                    GameDataMgr.setDataByType(E_GameData_Type.AppToken, token);
                    callback(true,msg);
                }else{
                    console.log("系统错误");
                    callback(false,msg);
                }
            }
        })
    };

    /**注册 */
    setEnrollMessage(name:string,password:string,repassword:string,callback){
        // let rbUrl = ApiUrl.appUrl+"/game.api";
        let rbUrl = ApiUrl.appUrl+"/game.api?";
        console.log("地址：" + rbUrl);
        let na = name;
        let ps = password;
        let rps = repassword;
        console.log(name);
        console.log(password);
        console.log(repassword);
        var obj = 'c=auth&a=register&username=' + na +'&password=' + ps +'&repassword='+ rps +'';
        // var objs = JSON.stringify(obj)
        // let para={
        //     c: 'auth',
        //     a: 'register',
        //     username: na,
        //     password: ps,
        //     repassword: rps
        // }
        // let pra = JSON.stringify(para);
        this.noTokenParametersPost(rbUrl,obj,(res,msg)=>{
            if(res !=null){
                if (res) {
                    console.log(res);
                    console.log("请求成功");
                    callback(true,msg);
                }else{
                    console.log("返回数据失败");
                    callback(false,msg);
                }
            }
        })
    };

// 乔木接口
// 用户登陆http://qmapp.vip.hnhxzkj.com/game.api?c=auth&a=login
// 参数 username password
// 用户注册http://qmapp.vip.hnhxzkj.com/game.api?c=auth&a=register
// 参数 username password repassword verifyCode realname
// 增加积分http://qmapp.vip.hnhxzkj.com/game.api?c=flower&a=addDiamonds
// 参数 Token diamond level 
// 我的积分http://qmapp.vip.hnhxzkj.com/game.api?c=flower&a=myDiamonds
// 参数 Token
// 我的排名http://qmapp.vip.hnhxzkj.com/game.api?c=flower&a=myRank
// 参数 Token

// 积分购物
// 商品列表http://qmapp.vip.hnhxzkj.com/game.api?c=flower&a=getShops
// 参数 Token page num
// 立即购买http://qmapp.vip.hnhxzkj.com/game.api?c=flower&a=QuickOrder
// 参数 Token goods_ids nums address_id
// 积分支付http://qmapp.vip.hnhxzkj.com/game.api?c=flower&a=payDiamonds
// 参数 Token order_id
// 我的地址http://qmapp.vip.hnhxzkj.com/game.api?c=flower&a=getMyAddress
// 参数 Token id name mobile address notes
// 编辑地址http://qmapp.vip.hnhxzkj.com/game.api?c=flower&a=EditAddress
// 参数 Token id name mobile address notes

    /**发送积分*/
    setScoreMessage(score:any,lev:any,type:any,callback){
        let rbUrl = ApiUrl.appUrl+"/game.api?";
        console.log("地址：" + rbUrl);
        let sco = score;
        let le = lev;
        let ty = type;
        console.log("分数B：" + sco);
        var obj = 'c=flower&a=addDiamonds&diamond=' + sco +'&level=' + le +'&type=' + ty +'';
        // let para={
        //     "c":"flower",
        //     "a":"addDiamonds",
        //     "diamond": score,
        //     "level": lev,
            
        // }
        // let pra = JSON.stringify(para);
        this.haveParametersPost(rbUrl,obj,(res)=>{
            if(res !=null){
                if (res) {
                    console.log(res);
                    console.log("请求成功");
                    callback(true);
                }
            }else{
                console.log("系统错误");
                callback(false);
            }
        })
    };

    /**获得积分*/
    getScoreMessage(callback){
        let rbUrl = ApiUrl.appUrl+"/game.api?";
        var obj = 'c=flower&a=myDiamonds';
        console.log("地址：" + rbUrl);
        // let para={
        //     "c":"flower",
        //     "a":"myDiamonds",
        // }
        // let pra = JSON.stringify(para);
        this.haveParametersPost(rbUrl,obj,(res)=>{
            if(res !=null){
                if (res) {
                    console.log(res);
                    let sc = res.data.userInfo.socre;
                    let id = res.data.userInfo.uid;
                    let lev = Number(res.data.userInfo.level);
                    // lev = 0
                    GameDataMgr.setDataByType(E_GameData_Type.AllScoreNum,sc);
                    GameDataMgr.setDataByType(E_GameData_Type.playerID,id);
                    GameDataMgr.setDataByType(E_GameData_Type.MaxlevelNum,lev);
                    GameDataMgr.setDataByType(E_GameData_Type.ClickPassLv,lev);
                    console.log("请求成功");
                    callback(true);
                }
            }else{
                console.log("系统错误");
                callback(false);
            }
        })
    };

    /**获得排行*/
    getRankMessage(callback){
        let rbUrl = ApiUrl.appUrl+"/game.api?";
        console.log("地址：" + rbUrl);
        var obj = 'c=flower&a=myRank';
        // let para={
        //     "c":"flower",
        //     "a":"myRank",
        // }
        // let pra = JSON.stringify(para);
        this.haveParametersPost(rbUrl,obj,(res)=>{
            if(res !=null){
                if (res) {
                    console.log(res);
                    console.log("请求成功");
                    let sttel = res.data.list.length 
                    RankConfig.length = 0;
                    for (let a = 0; a < sttel; a++) {
                        RankConfig.push(res.data.list[a])
                    }
                    callback(true);
                }
            }else{
                console.log("系统错误");
                callback(false);
            }
        })
    };

// 积分购物
// 商品列表http://qmapp.vip.hnhxzkj.com/game.api?c=flower&a=getShops
// 参数 Token page num
// 立即购买http://qmapp.vip.hnhxzkj.com/game.api?c=flower&a=QuickOrder
// 参数 Token goods_ids nums address_id
// 积分支付http://qmapp.vip.hnhxzkj.com/game.api?c=flower&a=payDiamonds
// 参数 Token order_id

    /**获得商品列表*/
    getGoodsMessage(callback){
        let rbUrl = ApiUrl.appUrl+"/game.api?";
        console.log("地址：" + rbUrl);
        let sco = 1;
        let le = 1000;
        var obj = 'c=flower&a=getShops&page=' + sco +'&num=' + le +'';
        // let para={
        //     "c":"flower",
        //     "a":"getShops",
        //     "page":1,
        //     "num":1000
        // }
        // let pra = JSON.stringify(para);
        this.haveParametersPost(rbUrl,obj,(res)=>{
            if(res !=null){
                if (res) {
                    console.log(res);
                    let slet = res.data.list.length;
                    GoodsConfig.length = 0;
                    for (let a = 0; a < slet; a++) {
                        GoodsConfig.push(res.data.list[a]);
                    }
                    console.log("请求成功");
                    callback(true);
                }
            }else{
                console.log("系统错误");
                callback(false);
            }
        })
    };

    /**立即购买*/
    buyGoodsMessage(gsid:any,nums:any,add:any,callback){
        let rbUrl = ApiUrl.appUrl+"/game.api?";
        let gid = gsid;
        let nu = nums;
        let ad = add;
        var obj = 'c=flower&a=QuickOrder&goods_ids=' + gid +'&nums=' + nu +'&address_id=' + ad +'';
        console.log("地址：" + rbUrl);
        // let para={
        //     "c":"flower",
        //     "a":"QuickOrder",
        //     "goods_ids":1,
        //     "nums":1000,
        //     "address_id":1,
        // }
        // let pra = JSON.stringify(para);
        this.haveParametersPost(rbUrl,obj,(res,msg)=>{
            if(res !=null){
                if (res) {
                    console.log(res);
                    console.log("请求成功");
                    callback(true,msg);
                }
            }else{
                console.log("系统错误");
                callback(false,msg);
            }
        })
    };

    /**提交地址*/
    getAddressMessage(id:any,nu:any,mo:any,ad:any,no:any,callback){
        let rbUrl = ApiUrl.appUrl+"/game.api?";
        console.log("地址：" + rbUrl);
        let idd = 0
        var obj = 'c=flower&a=EditAddress&id=' + idd +'&nums=' + nu +'&mobile=' + mo +'&address=' + ad+'&notes=' + no+'';
        // let para={
        //     "c":"flower",
        //     "a":"EditAddress",
        //     "id":1,
        //     "nums":1000,
        //     "mobile":1,
        //     "address":1000,
        //     "notes":1,
        // }
        // let pra = JSON.stringify(para);
        this.haveParametersPost(rbUrl,obj,(res,msg)=>{
            if(res !=null){
                if (res) {
                    console.log(res);
                    console.log("请求成功");
                    callback(true,msg);
                }
            }else{
                console.log("系统错误");
                callback(false,msg);
            }
        })
    };

    /**发送地址*/
    // setAddressMessage(callback){
    //     let rbUrl = ApiUrl.appUrl+"/game.api";
    //     var obj = 'c=flower&a=getMyAddress&id=' + id +'&nums=' + nu +'&mobile=' + mo +'&address=' + ad+'&notes=' + no+'';
    //     console.log("地址：" + rbUrl);
    //     let para={
    //         "c":"flower",
    //         "a":"EditAddress",
    //         "id":1,
    //         "nums":1000,
    //         "mobile":1,
    //         "address":1000,
    //         "notes":1,
    //     }
    //     let pra = JSON.stringify(para);
    //     this.haveParametersPost(rbUrl,pra,(res)=>{
    //         if(res !=null){
    //             if (res) {
    //                 console.log(res);
    //                 if (res.msgCode == 1){
    //                     callback(false);
    //                     return;
    //                 }
    //                 console.log("请求成功");
    //                 callback(true);
    //             }
    //         }else{
    //             console.log("系统错误");
    //             callback(false);
    //         }
    //     })
    // };


// 我的地址http://qmapp.vip.hnhxzkj.com/game.api?c=flower&a=getMyAddress
// 参数 Token id name mobile address notes
// 编辑地址http://qmapp.vip.hnhxzkj.com/game.api?c=flower&a=EditAddress
// 参数 Token id name mobile address notes
    



    /**路径加密 */
    rbInfoString(lf){
        let aSing = "s=" + lf;
        let sign = new MD5().hex_md5(aSing).toUpperCase();
        return sign;
    };
    //随机生成16位字符串
    addArr(){
        let arr = [];
        let astr = "";
        for(var i=65;i<91;i++){
            arr.push(String.fromCharCode(i));
        }
        for(var j=97;j<123;j++){
            arr.push(String.fromCharCode(j));
        }
        for(var k=0;k<16;k++){
            let aNum = Math.floor(Math.random()*arr.length);
            astr += arr[aNum];
        }
        return astr;
    };
};


// 用户登陆http://qmapp.vip.hnhxzkj.com/game.api?c=auth&a=login
// 用户注册http://qmapp.vip.hnhxzkj.com/game.api?c=auth&a=register
// 增加积分http://qmapp.vip.hnhxzkj.com/game.api?c=flower&a=addDiamonds
// 我的积分http://qmapp.vip.hnhxzkj.com/game.api?c=flower&a=myDiamonds
// 我的排名http://qmapp.vip.hnhxzkj.com/game.api?c=flower&a=myRank

