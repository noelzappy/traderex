import { AuthRoute } from './auth.route';
import { UserRoute } from './users.route';

const routes = [new UserRoute(), new AuthRoute()];

export default routes;
