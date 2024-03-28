// 멤버에 들어갈 타입
type memberType = {
  memberId: number|null,
  nickname: string|null,
  socialId: string|null,
  villageId: number|null,
  villageName: 'apple'|'orange'|'pineapple'|'watermelon'|'grape'|'peach'|'blueberry'|'kakao',
  level: number|null,
  missionCount: number|null,
  accessToken :string|null,
} 

// 마을 타입
type villageType = {
  apple : string,
  orange : string,
  pineapple : string,
  watermelon : string,
  grape : string,
  peach : string,
  blueberry : string,
  kakao: string
}



// 고민 타입
type consultType = {
  consultId : number,
  memberId : number,
  title : string,
  content : string,
  categoryId : number
}

// 고민 카테고리 타입
type categoryType = {
  categoryId : number,
  categoryName : string
}



export type {consultType, categoryType, memberType, villageType}