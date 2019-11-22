export class UserInfoModel {
  

  constructor(model) {
    let {
      nickName = "小明", _open_id = "", avatarUrl = "", gender = 1, fansNums = 0, followNums = 0, isFollowed = false
    } = model
    this.nickName = nickName
    this.open_id = _open_id
    this.avatarUrl = avatarUrl
    this.gender = gender
    this.fansNums = fansNums
    this.followNums = followNums
    this.isFollowed = isFollowed
    this._fixData();
  }
  _fixData(){
    this._fixGender()
    this._fixIsFollowed()
  }
  _fixGender(){
    const genderEnum = {
      0: "女",
      1: "男"
    }
    this.genderTxt = genderEnum[this.gender]
  }
  _fixIsFollowed(){
    const followGenderEnum = {
      0: "她",
      1: "他"
    }
    if(this.isFollowed){
      this.followed = "取消关注"
    }else{
      this.followed = "关注" + followGenderEnum[this.gender]
    }
  }
  _changeFansNums(){
    if(this.isFollowed){
      this.fansNums += 1
    }else{
      this.fansNums -= 1
    }
  } 
  setIsFollowed(isFollowed){
    this.isFollowed = isFollowed
    this._fixIsFollowed()
    this._changeFansNums()
  }

}