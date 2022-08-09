import config from '@/config/config';

export const UserLogout = () => {
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = config.page.homePage;
}