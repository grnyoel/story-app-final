import HomePage from '../pages/home/home-page';
import RegisterPage from '../pages/auth/register/register-page';
import LoginPage from '../pages/auth/login/login-page';
import { checkAuthenticatedRoute, checkUnauthenticatedRouteOnly } from '../utils/auth';
import NewPage from '../pages/new/new-page';
import BookmarkPage from '../pages/bookmark/bookmark-page';
import NotFoundPage from '../pages/not-found/not-found-page';

const routes = {
  // Auth
  '/login': () => checkUnauthenticatedRouteOnly(new LoginPage()),
  '/register': () => checkUnauthenticatedRouteOnly(new RegisterPage()),

  '/': () => checkAuthenticatedRoute(new HomePage()),
  '/bookmark': () => checkAuthenticatedRoute(new BookmarkPage()),
  '/new': () => new NewPage(),
  '*': () => new NotFoundPage(),
};

export default routes;
