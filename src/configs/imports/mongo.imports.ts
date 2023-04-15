import { MongooseModule } from '@nestjs/mongoose';
import mongoConfig from '../mongo.config';

export default MongooseModule.forRoot(mongoConfig.uri);