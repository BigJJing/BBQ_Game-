module.exports = {
  data:{
    character:[
      {
        name:"Abel",
        type:'kind',
        appearance:'略显颓废的黄头发男人'
      },
      {
        name:"catGirl",
        type:'kind',
        appearance:'抱着猫的小女孩'
      },
      {
        name:"candy",
        type:'kind',
        appearance:'穿着正式的女生'
      },
      {
        name:"littleAngal",
        type:'kind',
        appearance:'可爱的蓝裙子女孩'
      },
      {
        name:"sugar",
        type:'kind',
        appearance:'蓝裙子大女孩'
      }
    ],
    //随机派出人物
    show(guests){
      var nameArr = [];
      var characterArr = [];
      for(let i = 0; i < guests.length; i++){
        var str = JSON.stringify(guests[i])
        if(str != "{}"){
          nameArr.push(guests[i].guest.name)
        }
      }
      var len = this.character.length;
      for(let i = 0; i < len; i++){
        if(nameArr.indexOf(this.character[i].name) == -1){
          characterArr.push(this.character[i])
        }
      }
      var num = Math.floor(Math.random()*characterArr.length);
      return characterArr[num]
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
