import { MailerModule } from '@nestjs-modules/mailer';
import mailTransporter from '../mail-transporter.config';

export default MailerModule.forRoot(mailTransporter);