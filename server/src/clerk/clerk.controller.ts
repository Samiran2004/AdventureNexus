import * as common from '@nestjs/common';
import { Request } from 'express';

@common.Controller('/api/clerk')
export class ClerkController {
    private readonly logger = new common.Logger(ClerkController.name);

    @common.Post()
    async handleWebhook(
        @common.Req() req: common.RawBodyRequest<Request>,
        @common.Headers('svix-id') svixId: string,
        @common.Headers('svix-timestamp') svixTimestamp: string,
        @common.Headers('svix-signature') svixSignature: string
    ) {
        try {
            this.logger.log('Received Clerk webhook');
            const isValid = await 
        } catch (error) {
            this.logger.error('Webhook Processing Error: ', error);
            throw new common.HttpException(
                error.message || 'Internal Server Error',
                error.status || common.HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
