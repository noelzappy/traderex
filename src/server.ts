import { App } from '@/app';
import { ValidateEnv } from '@utils/validateEnv';
import routes from './routes';

ValidateEnv();

const app = new App(routes);

app.listen();
