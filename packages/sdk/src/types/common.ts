export enum EAdenaResponseStatus {
	SUCCESS = "success",
	FAILURE = "failure",
}

export interface IAdenaResponse<T, D> {
	code: number;
	status: EAdenaResponseStatus;
	type: T;
	message: string;
	data: D;
}
