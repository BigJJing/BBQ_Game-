var com = require('common');

cc.Class({
    extends: cc.Component,

    properties: {
        basket:{
          default: null,
          type: cc.Node
        },
        foodPlace:{
          default: null,
          type:cc.Node
        },
        dialogMenu:{
          default: null,
          type:cc.Node
        },
        //预制资源
        //右上角菜单
        menu: {
          default: null,
          type: cc.Prefab
        },
        //确认退出框
        confirmBack:{
          default: null,
          type: cc.Prefab
        },
        //设置音乐框
        setting:{
          default:null,
          type:cc.Prefab
        },
        menuBtn:{
          default: null,
          type: cc.Node
        },
        dialogBtn: {
          default: null,
          type: cc.Node
        },
        guest:{
          default: null,
          type: cc.Node
        },
        dish:{
          default: null,
          type: cc.Node
        },
        money:{
          default: null,
          type: cc.Label
        },
        sun:{
          default: null,
          type: cc.Label
        },
        timeChange:5000
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
      //音效
      this.AudioPlayer = cc.find("Audio").getComponent("audioManager");
      var nowSence = cc.director.getScene();
      //显示时间
      this.sun.string = com.data.timeForGameDisplay;
      if(com.data.timeForGame <= 0){
        this.sun.node.color = new cc.Color().fromHEX('#FF0000');
      }
      //money
      this.money.string = com.data.money.toFixed(2);
      //篮子里的食物
      var basket = com.data.basket;
      if(basket !== null && basket.childrenCount !== 0){
        for(var i=0;i<basket.childrenCount;i++){
          let node = cc.instantiate(basket.children[i])
          node.parent = this.basket;
        }
      }
      if(nowSence.name == "SenceCook"){
        this.AudioPlayer.playBarbecueSound();
        //烤架上的食物
        var foodPlace = com.data.foodPlace;
        if(foodPlace !== null && foodPlace.childrenCount !== 0){
          for(var i = 0;i < foodPlace.childrenCount; i++){
            let node = cc.instantiate(foodPlace.children[i])
            node.parent = this.foodPlace;
          }
          //this.foodPlace.children = foodPlace.children;
        }

        //烤架上的食物
        var dish = com.data.dish;
        if(dish){
            let node = cc.instantiate(dish);
            for(let i = 0; i < node.children.length; i++){
              var foods = node.children[i].children;
              for(let j = 0; j < foods.length; j++){
                foods[j].parent = this.dish.children[i]
              }
            }
          }
      }
      else{
        this.AudioPlayer.stopBarbecueSound();
      }

      //键盘监听 A，D键切换场景
      cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.changeSence, this);
      //监听对话记录菜单点击事件
      this.dialogBtn.on(cc.Node.EventType.TOUCH_START, this.openDialog, this)
      //监听菜单
      this.menuBtn.on(cc.Node.EventType.TOUCH_START,this.openMenu,this)
    },

    start () {
      //计时
      this.doInterval();
    },

    //计时
    doInterval: function(){
      com.data.timer = setInterval(()=>{
        com.data.timeForGame -= 5;
        //时间显示变化
        this.sun.string = this.getTime();
        com.data.timeForGameDisplay = this.sun.string;
        console.log(com.data.timeForGame)
        if(com.data.timeForGame <= 0){
          this.sun.node.color = new cc.Color().fromHEX('#FF0000');
        }
        if(com.data.timeForGame <= 0 && com.data.guestsNum == 0){


        }
        //食物变化
        var nowSence = cc.director.getScene();
        com.data.changeAllInCommon();
        if(nowSence.name == "SenceCook"){
          var guestScript = this.guest.getComponent('character');
          //客人出现
          if(com.data.timeShow == com.data.settings.timeForGuest && com.data.timeForGame > 0){
            com.data.timeShow = 0;
            if(com.data.guestsNum < 4){
              com.data.guestsNum ++;
              guestScript.showGuest();
              this.AudioPlayer.playGuestComing();
            }
          }
          //客人离开
          guestScript.findLeaveGuest();

        }
        else{
          //客人出现
          if(com.data.timeShow == com.data.settings.timeForGuest && com.data.timeForGame > 0){
            com.data.timeShow = 0;
            if(com.data.guestsNum < 4){
              com.data.guestsNum ++;
              this.AudioPlayer.playGuestComing();
            }
          }
          com.data.changeMood();
        }

      },this.timeChange)
    },
    //切换场景
    changeSence: function(e){
      com.data.clearTime();
      console.log("clear 2")
      var nowSence = cc.director.getScene();
      if(e.keyCode == 65 || e.keyCode == 68){
        com.data.basket = cc.instantiate(this.basket);
        if(nowSence.name == "SenceCook"){
          com.data.foodPlace = cc.instantiate(this.foodPlace);
          com.data.guest = cc.instantiate(this.guest);
          com.data.dish = cc.instantiate(this.dish)
          cc.director.loadScene("SenceMake")
        }
        else{
          var presentStrand = cc.find("Canvas").getChildByName('Main Camera').getChildByName('presentStrand');
          com.data.presentStrand = cc.instantiate(presentStrand);
          cc.director.loadScene("SenceCook")

        }
      }
    },
    //打开对话记录菜单
    openDialog: function(e){
      //音效
      this.AudioPlayer.playPropClick();
      //更新里面的内容
      var dialogs = com.data.dialogs;
      var menu = this.dialogMenu.children[1].children[0];
      var topX = -190;
      var topY = 200;
      const MAX_CONTENT_LENGTH = 18;
      var content = "";
      for(var i = 0; i < dialogs.length; i++){
        content += dialogs[i].appearance;
        content += ":\n";
        var diaContent = dialogs[i].content;
        if(diaContent.length > MAX_CONTENT_LENGTH){
          var diaLen = Math.ceil(diaContent.length/MAX_CONTENT_LENGTH)
          for(var j = 0; j < diaLen; j++){
            var str = diaContent.slice(j*MAX_CONTENT_LENGTH,(j+1)*MAX_CONTENT_LENGTH)
            content += str;
            content += "\n"
          }
        }
        else{
          content += diaContent;
          content += "\n"
        }
        content+="\n\n"
      }
      menu.getComponent(cc.Label).string = content
      this.dialogMenu.opacity = 255;
      var cancelBtn = this.dialogMenu.children[0];
      cancelBtn.on(cc.Node.EventType.TOUCH_START, this.closeDialog, this)
    },

    //关闭对话
    closeDialog: function(e){
      this.dialogMenu.opacity = 0;
      var cancelBtn = this.dialogMenu.children[0];
      cancelBtn.off(cc.Node.EventType.TOUCH_START, this.closeDialog, this)
    },

    //打开游戏菜单页面
    openMenu: function(e){
      //音效
      this.AudioPlayer.stopBarbecueSound();
      this.AudioPlayer.playPropClick();
      //显示菜单
      var menu = cc.instantiate(this.menu);
      this.node.parent.addChild(menu);
      com.data.clearTime();
      console.log("clear 3")
      var btns = menu.children[0].children;
      for(var i = 0; i < btns.length; i++){
        btns[i].on(cc.Node.EventType.TOUCH_START, this.selectMenuBtn, this)
      }

    },

    selectMenuBtn:function(e){
      //音效
      this.AudioPlayer.playGeneralClick();
      var parent = e.target.parent.parent;
      if(e.target.name == 'return'){
        this.closeMenu(parent)
      }
      else if(e.target.name == 'settings'){
        var setting = cc.instantiate(this.setting)
        parent.addChild(setting);
        var bgManager = setting.getChildByName('bg');
        var soundEffectManager = setting.getChildByName('effect');
        var btn = setting.getChildByName('true');

        //显示当前音量
        bgManager.getComponent(cc.Slider).progress = this.AudioPlayer.getBgVolume();
        soundEffectManager.getComponent(cc.Slider).progress = this.AudioPlayer.getEffectVolume();

        //设置背景音乐音量大小
        bgManager.on('slide',function(e){
          this.AudioPlayer.setBgVolume(e.progress)
        },this)

        //设置音效音乐音量大小
        soundEffectManager.on('slide',function(e){
          this.AudioPlayer.setEffectVolume(e.progress)
        },this)

        btn.on('click',function(e){
          this.AudioPlayer.playGeneralClick()
          this.closeMenu(parent)
        },this)
      }
      else if(e.target.name == 'mainMenu'){
        var confirm = cc.instantiate(this.confirmBack);
        parent.addChild(confirm)
        var children = confirm.children;
        for(let i = 1; i < children.length; i++){
          children[i].on(cc.Node.EventType.TOUCH_START,function(e){
            this.AudioPlayer.playGeneralClick()
            if(e.target.name == "true"){
              this.AudioPlayer.playGeneralClick()
              com.data.restoreData()
              cc.director.loadScene("SenceEnter")
            }
            else if(e.target.name == "false"){
              this.closeMenu(parent)
            }
          },this)
        }
        /*
        confirm.x = parent.children[0].x;
        confirm.y = parent.children[0].y;
        confirm.width = parent.children[0].width;
        confirm.height = parent.children[0].height;
        */
      }
    },
    closeMenu(parent){
      this.doInterval();
      parent.destroy();
      var nowSence = cc.director.getScene();
      if(nowSence.name == "SenceCook"){
        this.AudioPlayer.playBarbecueSound();
      }
    },
    getTime(){
      var str = this.sun.string;

      var arr = str.split(":");
      var min = parseInt(arr[1]);
      if(min + 3 >= 60){
        var h = parseInt(arr[0]) + 1;
        return "0"+ h +":" + "00";
      }
      else{
        min += 3
        if(min > 10){
          return arr[0] + ":" +min
        }
        else{
          return arr[0] + ":" + "0" + min
        }
      }
    }
});
