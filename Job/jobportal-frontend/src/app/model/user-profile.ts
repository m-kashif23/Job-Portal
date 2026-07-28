// The signed-in account's profile (matches the backend User entity, minus password)
export interface UserProfile {
  id?: number;
  username: string;
  email: string;
  mobileNumber?: string;
  roles?: string;
}
