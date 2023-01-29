import { User } from '../../models';

export interface AuthState {
  isAuthenticated: boolean;
  isTwoStepEnabled: boolean;
  error?: string;
  loading: boolean;
  user?: User;
}
