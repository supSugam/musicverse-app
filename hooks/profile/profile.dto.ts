export interface ICreateUserProfileDTO {
  name: string;
  bio?: string;
  avatar?: string;
  cover?: string;
}

export interface IUpdateUserProfileDTO extends ICreateUserProfileDTO {}
