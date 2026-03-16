export interface AuthTokensEntity {
  accessToken: string;
  refreshToken: string | null;
  expiredAt: Date;
  firebaseUid?: string;
}
