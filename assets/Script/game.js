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
        menu: {
          default: null,
          type: cc.Node
        },
        dialogMenu: {
          default: null,
          type: cc.Node
        },
        guest:{
          default: null,
          type: cc.Node
        },
        money:{
          default: null,
          type: cc.Label
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
      //money
      this.money.string = com.data.money.toFixed(2);
      //篮子里的食物
      var basket = com.data.basket;
      if(basket !== null && basket.childrenCount !== 0){
        for(var i=0;i<basket.childrenCount;i++){
          var node = cc.instantiate(basket.children[i])
          node.parent = this.basket;
        }
      }
      //烤架上的食物
      var foodPlace = com.data.foodPlace;
      if(foodPlace !== null && foodPlace.childrenCount !== 0){
        for(var i=0;i<foodPlace.childrenCount;i++){
          var node = cc.instantiate(foodPlace.children[i])
          node.parent = this.foodPlace;
        }
        //this.foodPlace.children = foodPlace.children;
      }
      //键盘监听 A，D键切换场景
      cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.changeSence, this);
      //监听对话记录菜单点击事件
      this.menu.on(cc.Node.EventType.TOUCH_START, this.openMenu, this)
    },

    start () {

    },

    //切换场景
    changeSence: function(e){
      var nowSence = cc.director.getScene();
      if(e.keyCode == 65 || e.keyCode == 68){
        com.data.basket = cc.instantiate(this.basket);
        if(nowSence.name == "SenceCook"){
          com.data.foodPlace = cc.instantiate(this.foodPlace);
          com.data.guest = cc.instantiate(this.guest);
          cc.director.loadScene("SenceMake")
        }
        else{
          var presentStrand = cc.find("Canvas").getChildByName('Main Camera').getChildByName('presentStrand');
          console.log(presentStrand)
          com.data.presentStrand = cc.instantiate(presentStrand);
          cc.director.loadScene("SenceCook")

        }
      }
    },
    //打开对话记录菜单
    openMenu: function(e){
      //更新里面的内容
      var dialogs = com.data.dialogs;
      var menu = this.dialogMenu.children[1].children[0];
      var topX = -190;
      var topY = 200;
      const MAX_CONTENT_LENGTH = 18;
      console.log(topX,topY)
      var content = "";
      for(var i = 0; i < dialogs.length; i++){
        content += dialogs[i].appearance;
        content += ":\n";
        var diaContent = dialogs[i].content;
        if(diaContent.length > MAX_CONTENT_LENGTH){
          var diaLen = Math.ceil(diaContent.length/MAX_CONTENT_LENGTH)
          console.log(diaLen)
          for(var j = 0; j < diaLen; j++){
            var str = diaContent.slice(j*MAX_CONTENT_LENGTH,(j+1)*MAX_CONTENT_LENGTH)
            console.log(str)
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
      cancelBtn.on(cc.Node.EventType.TOUCH_START, this.closeMenu, this)
    },

    closeMenu: function(e){
      this.dialogMenu.opacity = 0;
      var cancelBtn = this.dialogMenu.children[0];
      cancelBtn.off(cc.Node.EventType.TOUCH_START, this.closeMenu, this)
    },


});
