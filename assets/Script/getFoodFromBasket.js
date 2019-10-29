// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
var com = require('common');

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
      targetOriginX:0,
      targetOriginY:0,
      targetBeforeYLength:0,
      iSelect:-1
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
      //监听篮子的点击事件
      var children = this.node.children;
      console.log(children)
      for(var i=0;i<children.length;i++){
        children[i].on(cc.Node.EventType.TOUCH_MOVE, this.mouseMove, this)
        children[i].on(cc.Node.EventType.TOUCH_END, this.mouseEnd, this)
        children[i].on(cc.Node.EventType.TOUCH_CANCEL, this.mouseEnd, this)
      }
    },

    start () {

    },

    mouseMove: function(e){
      var target = e.target;
      if(!this.isLight){
        this.targetOriginX = target.x;
        this.targetOriginY = target.y;
        this.isLight = true;
        var anim = this.grillPosition.getComponent(cc.Animation);
        anim.play();
        //变大,旋转
        var action = cc.spawn(cc.scaleTo(0.2,0.8,0.8),cc.rotateBy(0.2,-90)).easing(cc.easeCubicActionOut());
        target.runAction(action);

        //如果拿的不是最上层的食物，则将其他的食物
        var children = this.node.children;
        var targetType = "";
        for(var k = 1; k < target.childrenCount; k++){
          targetType += target.children[k].name
        }
        console.log(targetType)
        for(var i = 0; i < children.length; i++){
          if(children[i]== target){
            this.iSelect = i;
          }
          var child = children[i].children;
          var childType = "";
          for(var j=1;j<child.length;j++){
            childType+= child[j].name;
          }
          if(children[i].y > this.targetOriginY && childType == targetType && i!== this.iSelect){
            var actionY = cc.moveBy(0.2,0,-5);
            children[i].runAction(actionY)
            this.targetBeforeYLength++;
          }
        }
      }

      //移动
      var delta = e.touch.getDelta();
      target.x += delta.x;
      target.y += delta.y;
    },

    mouseEnd: function(e){
      var target = e.target;
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
        //将该节点移动到食物节点上
        var foods = this.foodPlace.children;
        var targetLeft = target.x - target.width/2;
        var targetRight = target.x + target.width/2;
        for(var i = 0; i < foods.length; i++){
          var foodLeft = foods[i].x - foods[i].width/2 - distance;
          var foodRight = foods[i].x + foods[i].width/2 - distance;
          if(!(targetRight < foodLeft || targetLeft > foodRight)){
            //位置复原
            this.doRecover(target);
            return;
          }
        }
        target.parent = this.foodPlace;
        //判断防止食物的位置在哪里 x=-300 -200 -100 0 100 200 300 400
        target.y = 0;
        target.x =target.x + distance - target.width/2;
        //取消监听
        target.off(cc.Node.EventType.TOUCH_MOVE, this.mouseMove, this)
        target.off(cc.Node.EventType.TOUCH_END, this.mouseEnd, this)
        target.off(cc.Node.EventType.TOUCH_CANCEL, this.mouseEnd, this)
        this.targetBeforeYLength = 0;
      }
      else{
        //位置复原
        this.doRecover(target);
      }
    },

    //还原篮子中食物位置
    doRecover: function(target){
      var x = -1 * target.x + this.targetOriginX;
      var y = -1 * target.y + this.targetOriginY + this.targetBeforeYLength*5;
      var action = cc.spawn(cc.scaleTo(0.2,0.4,0.4), cc.rotateBy(0.2,90), cc.moveBy(0.2,x,y))
      target.runAction(action)
      this.changeFoodOrder(target);
      this.targetBeforeYLength = 0;

    },

    //改变食物的顺序
    changeFoodOrder: function(target){
      var children = this.node.children;
      console.log(children)
      //将最上面的和当前的食物交换位置
      var temp = children[this.iSelect];
      for(var i=this.iSelect;i<children.length;i++){
        children[i] = children[i+1]
      }
      children[children.length - 1]=temp;
      console.log(children)
    }
});
