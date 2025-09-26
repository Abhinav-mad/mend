export interface ICreateCheckinRequest {
  mood: string | null;
  note: string;
}

export interface ICheckin {
  _id: string;
  mood: string | null;
  note: string;
  createdAt: string;
}
