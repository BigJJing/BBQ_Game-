module.exports = {
  data:{
    kind:{
      greeting:[
        ["今天我想来点","。"],
        ["好久没吃过","啦。"],
        ["麻烦给我来点","。"],
        ["天气好胃口就好，我想要吃","。"],
        ["好久不见了呢,真怀念你家的","!"],
        ["可以给我来点","吗?"]
      ],
      number:[
        [1,""],
        [1,"一串就可以。"],
        [2,"麻烦来两串。"],
        [3,"来三串吧，快要饿死了。"],
      ],
      tasteGood:[
        "确认过眼神，我是吃它的人",
        "好吃好吃",
        "我已经迫不及待想要再来一份了",
      ],
      tasteBad:[
        "总的来说，很不满意"
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
      tasteBad:[
        "什么玩意，退钱"
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
    }
  }
}
