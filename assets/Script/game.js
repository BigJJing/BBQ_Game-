var com = require('common');

cc.Class({
    extends: cc.Component,

    properties: {
        basket:{
          default: null,
          type: cc.Node
        },
        camera: {
          default: null,
          type: cc.Node
        },
        basketContainer:{
          default: null,
          type: cc.Node
        },
        foodPlace:{
          default: null,
          type:cc.Node
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
      var basket = com.data.basket;
      if(basket == null){
        var that = this;
        cc.loader.loadRes('basket',cc.SpriteFrame,function(err,spriteFrame){
          var basketNode = new cc.Node;
          basketNode.parent = that.basket
          var sp = basketNode.addComponent(cc.Sprite);
          sp.spriteFrame = spriteFrame;
          basketNode.name = "container";
          basketNode.width = 158;
          basketNode.height = 201;
          that.basketContainer = basketNode;
        })
      }
      else{
        basket.parent = this.basket;
        this.basketContainer = basket
      }
      var foodPlace = com.data.foodPlace;
      if(foodPlace !== null && foodPlace.childrenCount !== 0){
        console.log(foodPlace.children)
        for(var i=0;i<foodPlace.childrenCount;i++){
          var node = cc.instantiate(foodPlace.children[i])
          node.parent = this.foodPlace;
        }
        //this.foodPlace.children = foodPlace.children;
      }

      //键盘监听 A，D键切换场景
      cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.changeSence, this);

    },

    start () {

    },

    //切换场景
    changeSence: function(e){
      var nowSence = cc.director.getScene();
      if(e.keyCode == 65 || e.keyCode == 68){
        com.data.basket = cc.instantiate(this.basketContainer);
        if(nowSence.name == "SenceCook"){
          com.data.foodPlace = cc.instantiate(this.foodPlace);
          cc.director.loadScene("SenceMake")
        }
        else{
          cc.director.loadScene("SenceCook")

        }
      }
    },

});
