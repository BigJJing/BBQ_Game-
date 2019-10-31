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
        foodPlace:{
          default: null,
          type:cc.Node
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
      console.log(com.data.strands)
      var basket = com.data.basket;
      if(basket !== null && basket.childrenCount !== 0){
        for(var i=0;i<basket.childrenCount;i++){
          var node = cc.instantiate(basket.children[i])
          node.parent = this.basket;
        }
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
        com.data.basket = cc.instantiate(this.basket);
        console.log(com.data.basket)
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
