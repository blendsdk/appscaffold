import type { Request, Response, NextFunction } from 'express';

/**
 * OIDC Authentication Plugin for {{PROJECT_NAME}}.
 *
 * Provider-agnostic — configure via settings:
 *   OIDC_ISSUER_URL    — Provider's issuer URL
 *   OIDC_CLIENT_ID     — Application client ID
 *   OIDC_CLIENT_SECRET — Application client secret
 *   OIDC_REDIRECT_URI  — Callback URL
 */

export interface OidcConfig {
    issuerUrl: string;
    clientId: string;
    clientSecret: string;
    redirectUri: string;
}

export function oidcAuthPlugin(config: OidcConfig) {
    return {
        name: 'oidc-auth',
        register: (app: any) => {
            // TODO: Implement OIDC discovery and token validation
            // This is a scaffold — implement provider-specific logic here

            app.use('/api', (req: Request, res: Response, next: NextFunction) => {
                // Skip health endpoint
                if (req.path === '/health' || req.path === '/api/health') {
                    return next();
                }

                const authHeader = req.headers.authorization;
                if (!authHeader || !authHeader.startsWith('Bearer ')) {
                    return res.status(401).json({ error: 'Unauthorized' });
                }

                // TODO: Validate JWT token against OIDC provider
                // const token = authHeader.slice(7);
                // const payload = await verifyToken(token, config);
                // req.user = payload;

                next();
            });
        },
    };
}
