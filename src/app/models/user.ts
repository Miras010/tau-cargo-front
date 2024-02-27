export interface User {
  _id: string,
  username: string,
  name: string,
  surname: string,
  phoneNumber: string,
  mail: string,
  password: string,
  roles: Array<string>,
  isActive: Boolean
}
