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
      isLight: false,
      grillPosition: {
        default: null,
        type: cc.Node
      },
      grill:{
        default: null,
        type: cc.Node
      },
      foodPlace:{
        default: null,
        type: cc.Node
      },
      foodContainer:{
        default: null,
        type: cc.Node
      }

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
      //监听篮子的点击事件
      var container = this.node.children[0];
      this.foodContainer = container;
      if(container != undefined){
        this.node.width = container.width;
        this.node.height = container.height;

        var children = container.children;
        this.foodContainer = container
        //对每个串都进行监听
        for(var i=0;i<children.length;i++){
          children[i].on(cc.Node.EventType.TOUCH_MOVE, this.mouseMove, this)
          children[i].on(cc.Node.EventType.TOUCH_END, this.mouseEnd, this)
          children[i].on(cc.Node.EventType.TOUCH_CANCEL, this.mouseEnd, this)
        }

      }
    },

    start () {

    },

    mouseMove: function(e){
      var target = e.target;
      if(!this.isLight){
        this.isLight = true;
        var anim = this.grillPosition.getComponent(cc.Animation);
        anim.play();
        //变大,旋转
        var action = cc.spawn(cc.scaleTo(0.2,0.8,0.8),cc.rotateBy(0.2,-90));
        target.runAction(action);
      }

      //移动
      var delta = e.touch.getDelta();
      target.x += delta.x;
      target.y += delta.y;
    },

    mouseEnd: function(e){
      var target = e.target;
      console.log(target.x)
      this.isLight = false;
      var anim = this.grillPosition.getComponent(cc.Animation);
      anim.stop();
      this.grillPosition.opacity = 0;
      //判断是否放在烤炉上，如果没有则复原
      //x:-744 ~194  y: -200~100
      var grillLeft = -744;
      var grillRight = -100;
      var grillTop = -200;
      var grillBottom = 100;
      if(target.x >= grillLeft && target.x <= grillRight && target.y >= grillTop && target.y <= grillBottom){
        var distance = this.node.x - this.grillPosition.x;
        console.log(distance)
        //将该节点移动到食物节点上
        console.log("yes")
        var foods = this.foodPlace.children;
        console.log(foods)
        console.log(target.x)
        var targetLeft = target.x - target.width/2;
        var targetRight = target.x + target.width/2;
        for(var i = 0; i < foods.length; i++ ){

          var foodLeft = foods[i].x - foods[i].width/2 - distance;
          var foodRight = foods[i].x + foods[i].width/2 - distance;
          console.log(targetRight,foodLeft)
          console.log(targetLeft,foodRight)
          if(!(targetRight < foodLeft || targetLeft > foodRight)){
            //位置复原
            console.log("no");
            this.doRecover(target);
            return;
          }
        }
        target.parent = this.foodPlace;
        //判断防止食物的位置在哪里 x=-300 -200 -100 0 100 200 300 400
        target.y = 0;
        target.x =target.x + 444 - target.width/2;
        console.log(target.x)
        //var num = target.x - (grillLeft - grillRight)/2;
        //var x = Math.floor(num / 100) * 100;
        //target.x = x;

        //取消监听
        target.off(cc.Node.EventType.TOUCH_MOVE, this.mouseMove, this)
        target.off(cc.Node.EventType.TOUCH_END, this.mouseEnd, this)
        target.off(cc.Node.EventType.TOUCH_CANCEL, this.mouseEnd, this)
      }
      else{
        //位置复原
        console.log("no2")
        this.doRecover(target);
      }
    },

    //还原篮子中食物位置
    doRecover: function(target){
      var action = cc.spawn(cc.scaleTo(0.2,0.4,0.4), cc.rotateBy(0.2,90), cc.moveBy(0.2,0,0))
      target.runAction(action)
    }
});
