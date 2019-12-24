module.exports = {
  data:{
    types:[
      {
        name: "sausage",
        chinese:"香肠",
        price:2,
      },
      {
        name: "potatopotatopotato",
        chinese: "土豆串",
        price:1,
      },
      {
        name: "mutton",
        chinese: "羊肉串",
        price:3,
      }
    ],
    getFood(){
      var num = Math.floor(Math.random() * this.types.length);
      console.log(this.types[num])
      return this.types[num];
    }
  }
}
