
var com = require('common');

cc.Class({
    extends: cc.Component,

    properties: {
      isLight: false,
      grillPosition: {
        default: null,
        type: cc.Node
      },
      grill: {
        default: null,
        type: cc.Node
      },
      foodPlace: {
        default: null,
        type: cc.Node
      },
      smoke: {
        default: null,
        type: cc.Node
      },
      foodCookingParticle: {
        default: null,
        type: cc.Prefab
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
        /*显示可防止位置
        var anim = this.grillPosition.getComponent(cc.Animation);
        anim.play();
        */
        //变大,旋转
        var action = cc.spawn(cc.scaleTo(0.2,0.8,0.8),cc.rotateBy(0.2,-90)).easing(cc.easeCubicActionOut());
        target.runAction(action);

        //如果拿的不是最上层的食物，则将其他的食物
        var children = this.node.children;
        var targetType = "";
        for(var k = 1; k < target.childrenCount; k++){
          targetType += target.children[k].name
        }
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
      //防止鼠标点击事件
      if(!this.isLight){
        return;
      }
      this.isLight = false;
      /* 显示可防止位置
      var anim = this.grillPosition.getComponent(cc.Animation);
      anim.stop();
      this.grillPosition.opacity = 0;
      */
      //判断是否放在烤炉上，如果没有则复原
      //x:-744 ~194  y: -200~100
      var grillLeft = -744;
      var grillRight = -100;
      var grillTop = 100;
      var grillBottom = -200;
      if(target.x >= grillLeft && target.x <= grillRight && target.y <= grillTop && target.y >= grillBottom){
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
        target.x =target.x + distance;
        //随机生成是个数
        var randomNum = ""
        for(let j = 0; j < 10; j++){
          randomNum += Math.floor(Math.random() * 10)
        }
        //唯一标识
        target.name = "strand" + randomNum;

        //取消监听
        target.off(cc.Node.EventType.TOUCH_MOVE, this.mouseMove, this)
        target.off(cc.Node.EventType.TOUCH_END, this.mouseEnd, this)
        target.off(cc.Node.EventType.TOUCH_CANCEL, this.mouseEnd, this)
        this.targetBeforeYLength = 0;
        this.changeStrands(target);
        //调用foodPlace上的移动函数
        this.onGrill();
        var that = this.foodPlace.getComponent('foodPlace')
        target.on(cc.Node.EventType.TOUCH_MOVE, that.mouseMove,that)
        target.on(cc.Node.EventType.TOUCH_START, that.mouseStart,that)
        target.on(cc.Node.EventType.TOUCH_END, that.mouseEnd,that)
        target.on(cc.Node.EventType.TOUCH_CANCEL, that.mouseEnd,that)
      }
      else{
        this.doRecover(target);
      }
    },

    //还原篮子中食物位置
    doRecover: function(target){
      var x = -1 * target.x + this.targetOriginX;
      var y = -1 * target.y + this.targetOriginY + this.targetBeforeYLength*5;
      var action = cc.spawn(cc.scaleTo(0.2,0.4,0.4), cc.rotateBy(0.2,90), cc.moveBy(0.2,x,y)).easing(cc.easeCubicActionOut())
      target.runAction(action)
      this.changeFoodOrder(target);
      this.targetBeforeYLength = 0;

    },

    //改变食物的顺序
    changeFoodOrder: function(target){
      var children = this.node.children;
      //将最上面的和当前的食物交换位置
      var temp = children[this.iSelect];
      for(var i=this.iSelect;i<children.length;i++){
        children[i] = children[i+1]
      }
      children[children.length - 1]=temp;
    },

    //全局变量strands中减去target类型
    changeStrands: function(target){
      var strands = com.data.strands;

      var targetType = "";
      for(let i = 1; i < target.childrenCount; i++){
        targetType += target.children[i].name
      }
      for(let i = 0; i < strands.length; i++){
        var type = strands[i].type
        var str = ""
        for(let j = 0; j < type.length; j++){
          str += type[j]
        }
        if(str == targetType){
          strands[i].length--;
          if(strands[i].length==0){
            strands.splice(i,1);
          }
        }
      }

      var data = {
        name:target.name,
        typeName:targetType,
        front:0,
        back:0,
        seasoning:[],
        selectedFace:"back"
      }
      com.data.strandsInGrill.push(data)
      com.data.strands = strands;
    },

    //食物放在烤架上：出现烤的特效
    onGrill: function(){
      //起烟
      var anim = this.smoke.getComponent(cc.Animation);
      anim.play();
      /*
      //溅油特效
      var child = target.children;
      for(var i=0;i<child.length;i++){
        if(i !== 0){
          var oil = cc.instantiate(this.foodCookingParticle);
          oil.setPosition(cc.v2(0,0));
          oil.height = child[i].height;
          oil.width = child[i].width;
          oil.zIndex = child[i].zIndex - 1;
          child[i].addChild(oil)
        }
      }
      console.log(target)
      */
    }

});
