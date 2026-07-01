export class Author {
  id: number
  name: string
  avatar: string

  constructor(
    id: number = 0, 
    name: string = "", 
    avatar: string = ""
    
    ) {

    this.id = id
    this.name = name
    this.avatar = avatar
  }
}
