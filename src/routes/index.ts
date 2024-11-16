import { AuthRoute } from './auth.route';
import { TradesRoute } from './trade.route';
import { UserRoute } from './users.route';

const routes = [new UserRoute(), new AuthRoute(), new TradesRoute()];

export default routes;
