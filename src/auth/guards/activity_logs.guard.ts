import { Injectable, CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import { ActivityLog } from 'src/activity-logs/models/activity-logs.model';
import { InjectModel } from '@nestjs/sequelize';
import * as requestIp from 'request-ip';

@Injectable()
export class ActivityLogsGuard implements CanActivate {

    private readonly logger = new Logger(ActivityLogsGuard.name);

    constructor(
        @InjectModel(ActivityLog)
        private readonly activityLog: typeof ActivityLog,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {

        try {

            const request = context.switchToHttp().getRequest();

            let { method, url, body } = request;

            let clonedBody = { ...body };

            const userEmail = request.user ? request.user.email : 'Unknown';

            const ip = requestIp.getClientIp(request);

            let logMessage = `User: ${userEmail} accessed ${method} ${url} on ${new Date().toISOString()}`;

            if (url.includes('auth/login') && clonedBody) {
                clonedBody = this.maskPassword(clonedBody);
                const user = this.extractUser(clonedBody);
                logMessage = `User: ${user} logged in on ${new Date().toISOString()}`;
            }

            this.logActivity(method, url, ip, logMessage, clonedBody);

        } catch (error) {
            this.logger.error(`Error logging activity: ${error.message}`, error.stack);
        }

        return true;
    }

    private maskPassword(bodyObj: any): string {
        if (bodyObj.password) {
            bodyObj.password = '***';
        }
        return bodyObj;
    }

    private extractUser(bodyObj: any): string {
        return bodyObj.username || bodyObj.email || 'Unknown';
    }

    private async logActivity(method: string, url: string, ipAddress: string, message: string,body:any): Promise<void> {
        await this.activityLog.create({
            message,
            method,
            url,
            ip_address: ipAddress,
            body: JSON.stringify(body)
        });
    }
}
