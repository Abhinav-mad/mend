export type SpacePlanStatus = "active" | "paused" | "completed" | "inactive";

export interface ISpacePlan {
  _id: string;
  userId: string;
  days: number;
  startedAt: string;
  status: SpacePlanStatus;
  daysComplete?: number;
}

export interface ICreateSpaceResponse {
  success: boolean;
  data: ISpacePlan;
}

export interface IFetchSpacesResponse {
  success: boolean;
  data: ISpacePlan | null;
}
