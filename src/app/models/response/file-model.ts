export interface FileModel {
  _id: string,
  createdDate: Date,
  date: Date,
  statusKey: string,
  statusValue: string,
  name: string,
  type: string,
  size: string
}

export interface Status {
  key: string,
  value: string
}
