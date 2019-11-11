module.exports = {
  data:{
    character:[
      {
        name:"Abel",
        type:'kind',
        appearance:'略显颓废的黄头发男人'
      },
    ],
    //随机派出人物
    show(){
      var len = this.character.length;
      var num = Math.floor(Math.random()*len);
      return this.character[num]
    },
    findByName(name){
      for(var i = 0; i < this.character.length; i++){
        if(this.character[i].name == name){
          return this.character[i]
        }
      }
      console.err("can't find" + name);
      return false;
    }
  }
}
