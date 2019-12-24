// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
      enterBtn:{
        default: null,
        type: cc.Button
      },
      nameing: {
        default: null,
        type: cc.Prefab
      }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    //  cc.sys.localStorage.removeItem('userData')
      var userData = JSON.parse(cc.sys.localStorage.getItem('userData'))
      console.log(userData)


      if(userData == null){
        console.log(2)
        var name = cc.instantiate(this.nameing);
        this.node.addChild(name);

        var input = name.children[2];
        console.log(input)
        input.on('editing-return',this.doNaming,name)
      }
      else{
        var dayStr = "第" + userData.day + "天";
        this.enterBtn.node.children[0].children[0].getComponent(cc.Label).string = dayStr;
        console.log(1)
      }
      this.enterBtn.node.on('click',this.enter,this)
    },

    start () {

    },
    //进入第n天
    enter: function(){
      var userData = JSON.parse(cc.sys.localStorage.getItem('userData'))
      console.log(userData)
    },
    //取名字
    doNaming: function(e){
      e.placeholder = '按 "enter" 确认';
      if(e.string == ""){
        e.placeholder = "名字不能为空哟"
        e.placeholderFontColor = new cc.Color().fromHEX("#762727");
      }
      else{
        var userData = {
          player: e.string,
          day: 1,
          money: 10,
          setting: {
            bgMusic: 5,   //0-10
            soundEffect: 5, //0-10
          }
        }
        cc.sys.localStorage.setItem('userData', JSON.stringify(userData));
        this.destroy()
        //this.node.destroy();
      }
    }

    // update (dt) {},
});
