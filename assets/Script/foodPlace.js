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
      grill: {
        default: null,
        type: cc.Node
      },
      isMove:false,
      targetOriginX: 0,
      targetOriginY: 0,
    },

    onLoad () {
      var children = this.node.children;
      for(var i = 0; i < children.length; i++){
        children[i].on(cc.Node.EventType.TOUCH_MOVE, this.mouseMove,this);
        children[i].on(cc.Node.EventType.TOUCH_END,this.mouseEnd,this);
        children[i].on(cc.Node.EventType.TOUCH_CANCEL,this.mouseEnd,this);
      }
    },

    mouseMove: function(e){
      var target = e.target;
      if(!this.isMove){
        this.isMove = true;
        this.targetOriginX = target.x;
        this.targetOriginY = target.y;
        target.zIndex ++;
      }

      //移动
      var delta = e.touch.getDelta();
      target.x += delta.x;
      target.y += delta.y;
    },

    mouseEnd: function(e){
      var target = e.target;
      var grillLeft = - this.grill.width/2 + 50;
      var grillRight = this.grill.width/2 - 50;
      var grillTop =  this.grill.height/2;
      var grillBottom = - this.grill.height/2;
      console.log(grillLeft,grillRight,grillTop,grillBottom)
      console.log(target.x,target.y)
      if(target.x >= grillLeft && target.x <= grillRight && target.y <= grillTop && target.y >= grillBottom){
        console.log("yes")
        //检查是否把节点移到了食物上
        var foods = this.node.children;
        var targetLeft = target.x - target.width/2;
        var targetRight = target.x + target.width/2;
        console.log(targetLeft,targetRight)
        for(var i = 0; i < foods.length; i++){
          var foodLeft = foods[i].x - foods[i].width/2;
          var foodRight = foods[i].x + foods[i].width/2;
          if(!(targetRight < foodLeft || targetLeft > foodRight) && foods[i] != target){
            console.log("no2");
            //位置复原
            target.x = this.targetOriginX;
            target.y = this.targetOriginY;
            this.isMove = false;
            target.zIndex --;
            return;
          }
        }
        //移动到新位置
        target.y = 0;
      }
      else{
        console.log("no")
        //位置复原
        target.x = this.targetOriginX;
        target.y = this.targetOriginY;
      }
      this.isMove = false;
      target.zIndex --;
    },
});
