import { AxiosError } from 'axios';

export interface ProfilePresenter {
  name: string;
  photo?: string;
  pat: string;
}

export interface AuthTokenPresenter {
  access: string;
  accessExpiresIn: string;
  refresh: string;
  refreshExpiresIn: string;
}

export interface IAuthPresenter extends ProfilePresenter  {
  tokens: AuthTokenPresenter;
}

export interface ErrorResponse {
  message: string[] | string;
  statusCode: number;
  path: string;
  error: string;
}

export class ApiError extends AxiosError<ErrorResponse> {}

export interface SuccessResponse<T> {
  isArray: boolean;
  path: string;
  duration: string;
  method: string;
  data: T;
}

export interface SignInPayload {
  token: string;
}
