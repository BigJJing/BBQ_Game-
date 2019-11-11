module.exports = {
  data:{
    types:[
      {
        name: "sausage",
        chinese:"香肠"
      },
      {
        name: "potato",
        chinese: "土豆串"
      }
    ],
    getFood(){
      var num = Math.floor(Math.random() * this.types.length);
      console.log(this.types[num])
      return this.types[num];
    }
  }
}
