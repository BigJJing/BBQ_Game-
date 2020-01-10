var com = require('common');
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
    //cc.sys.localStorage.removeItem('userData')
      var userData = JSON.parse(cc.sys.localStorage.getItem('userData'))
      console.log(userData)
      if(userData == null){
        var name = cc.instantiate(this.nameing);
        this.node.addChild(name);
        var input = name.children[2];
        input.on('editing-return',this.doNaming,name)
      }
      else{
        var dayStr = "第" + userData.day + "天";
        this.enterBtn.node.children[0].children[0].getComponent(cc.Label).string = dayStr;
      }
      //监听按钮
      this.enterBtn.node.on('click',this.enter,this)
      //播放背景音乐
      this.AudioPlayer = cc.find("Audio").getComponent("audioManager");
      console.log(this.AudioPlayer)
      this.AudioPlayer.playBgMusic();

    },

    start () {

    },
    //进入第n天
    enter: function(e){
      //点击鼠标声音
      this.AudioPlayer = cc.find("Audio").getComponent("audioManager");
      this.AudioPlayer.playGeneralClick();

      //进入游戏
      var userData = JSON.parse(cc.sys.localStorage.getItem('userData'));
      com.data.money = userData.money;
      cc.director.loadScene("SenceCook");
      /*
      var that = this;
      cc.director.preloadScene("SenceCook", function () {
        that.node.runAction(cc.fadeOut(0.5));
        setTimeout(function(){
          cc.director.loadScene("SenceCook")
        },500)
      })
      */

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
            bgMusic: 0.5,   //0-10
            soundEffect: 0.5, //0-10
          }
        }
        cc.sys.localStorage.setItem('userData', JSON.stringify(userData));
        this.destroy()
        //this.node.destroy();
      }
    }

    // update (dt) {},
});
