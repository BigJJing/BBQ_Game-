module.exports = {
  data:{
    kind:{
      greeting: [
        ["今天我想来点","。"],
        ["好久没吃过","啦。"],
        ["麻烦给我来点","。"],
        ["天气好胃口就好，我想要吃","。"],
        ["好久不见了呢,真怀念你家的","!"],
        ["可以给我来点","吗?"]
      ],
      number: [
        [1,""],
        [1,"一串就可以。"],
        [2,"麻烦来两串。"],
        [3,"来三串吧，快要饿死了。"],
      ],
      //什么都符合
      tasteGood: [
        "确认过眼神，我是吃它的人",
        "好吃好吃",
        "我已经迫不及待想要再来一份了",
      ],
      //食物给错了
      falseFood: [
        "还行吧，勉强能吃",
        "这好像不是我点的",
        "我的天，你居然知道我更喜欢吃这个",
        "这好像比我点的更好吃呢",
        "嗯..虽然不是我点的..但是好像赚到了呢"
      ],
      //没烤熟
      uncooked: [
        "好像有点没熟呢",
        "牛排七分熟更好吃呢，这个也一样呢",
        "虽然有点没熟，但老板的自信恰恰说明了食物很新鲜",
        "怎么烤了后还是软趴趴的"
      ],
      //烤糊了
      thanCooked: [
        "下次可以不要烤糊吗",
        "有种焦焦的感觉",
        "没有以前的好吃了呢",
        "我感觉可以拿着它当武器"
      ]
    },
    unkind:{
      greeting:[
        ["给我烤点",",不要再烤糊了!"],
        ["来点好吃的","吧。"],
        ["我想吃",",速度快一点OK?"]
      ],
      number:[
        [1,""],
        [1,"就要一串。"],
        [1,"只要一串。"],
        [2,"来两串好了。"],
        [2,"两串。"],
        [3,"三串,多吃才能变健康~"],
      ],
      tasteGood:[
        "好吃到流油",
        "这是我吃过的最好吃的烧烤了"
      ],
      //食物给错了
      falseFood:[
        "你是耳背吗",
        "这是我见过最差的服务了",
        "咦，这是啥？好难吃啊",
        "你觉得这种猪食我会吃吗？",
        "我从来不吃这个"
      ],
      //没烤熟
      uncooked: [
        "一股子腥味",
        "老板你怎么能给我吃没熟的食物呢，拉肚子了你负责吗",
        "怎么还是生的，我也是醉了",
        "这可能不是烤的，是水煮的"
      ],
      //烤焦了
      thanCooked: [
        "什么呀，硬邦邦的",
        "都烤焦了，还怎么吃呀",
        "吃起来像木头一样",
        "我的牙齿都要被磕掉了"
      ]
    },
    getGreeting(type){
      if(type == "kind"){
        var num = Math.floor(Math.random() * this.kind.greeting.length);
        return this.kind.greeting[num]
      }
      else{
        var num = Math.floor(Math.random() * this.unkind.greeting.length);
        return this.unkind.greeting[num]
      }
    },
    getNumber(type){
      if(type == "kind"){
        var num = Math.floor(Math.random() * this.kind.number.length);
        return this.kind.number[num]
      }
      else{
        var num = Math.floor(Math.random() * this.unkind.number.length);
        return this.unkind.number[num]
      }
    },
    //获取评价  evaluationType:tasteGood , falseFood , uncooked , thanCooked
    getEvaluation(type, evaluationType){
      if(type == "kind"){
        if(evaluationType == "tasteGood"){
          var num =  Math.floor(Math.random() * this.kind.tasteGood.length);
          return this.kind.tasteGood[num]
        }
        else if(evaluationType == "falseFood"){
          var num =  Math.floor(Math.random() * this.kind.falseFood.length);
          return this.kind.falseFood[num]
        }
        else if(evaluationType == "uncooked"){
          var num =  Math.floor(Math.random() * this.kind.uncooked.length);
          return this.kind.uncooked[num]
        }
        else if(evaluationType == "thanCooked"){
          var num =  Math.floor(Math.random() * this.kind.thanCooked.length);
          return this.kind.thanCooked[num]
        }
      }
      else{
        if(evaluationType == "tasteGood"){
          var num =  Math.floor(Math.random() * this.unkind.tasteGood.length);
          return this.unkind.tasteGood[num]
        }
        else if(evaluationType == "falseFood"){
          var num =  Math.floor(Math.random() * this.unkind.falseFood.length);
          return this.unkind.falseFood[num]
        }
        else if(evaluationType == "uncooked"){
          var num =  Math.floor(Math.random() * this.unkind.uncooked.length);
          return this.unkind.uncooked[num]
        }
        else if(evaluationType == "thanCooked"){
          var num =  Math.floor(Math.random() * this.unkind.thanCooked.length);
          return this.unkind.thanCooked[num]
        }
      }

    }
  }
}
