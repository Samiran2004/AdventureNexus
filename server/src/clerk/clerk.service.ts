import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EmailService } from 'src/email/email.service';
import User from 'src/user/user.schema';
import { Webhook } from 'svix';

interface ClerkWebhookEvent {
    type: string;
    data: {
        id: string;
        email_addresses?: Array<{ email_addresses: string }>;
        username?: string;
        first_name?: string;
        last_name?: string;
        image_url?: string;
        phone_numbers?: Array<{ phone_numbers: string }>;
    }
}

@Injectable()
export class ClerkService {
    private readonly logger = new Logger(ClerkService.name);
    private readonly WebHook: Webhook;

    constructor(
        private emailService: EmailService
    ){
        
    }
}
