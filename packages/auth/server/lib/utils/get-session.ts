import fs from 'node:fs';
import path from 'node:path';

import { AppError } from '@documenso/lib/errors/app-error';
import { prisma } from '@documenso/prisma';
import type { Session } from '@prisma/client';
import type { Context } from 'hono';

import { AuthenticationErrorCode } from '../errors/error-codes';
import type { SessionValidationResult } from '../session/session';
import { validateSessionToken } from '../session/session';
import { getSessionCookie } from '../session/session-cookies';

export const getDemoLoginEmail = (): string | undefined => {
  if (process.env.DEMO_LOGIN_EMAIL) {
    return process.env.DEMO_LOGIN_EMAIL;
  }

  if (process.env.NEXT_PRIVATE_DEMO_LOGIN_EMAIL) {
    return process.env.NEXT_PRIVATE_DEMO_LOGIN_EMAIL;
  }

  try {
    const candidatePaths = [
      path.resolve(process.cwd(), '.env'),
      path.resolve(process.cwd(), '../../.env'),
      path.resolve(process.cwd(), '../.env'),
    ];

    for (const envPath of candidatePaths) {
      if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf-8');
        const match = content.match(/^(?:NEXT_PRIVATE_)?DEMO_LOGIN_EMAIL=["']?([^"'\r\n]+)["']?/m);

        if (match?.[1]) {
          return match[1].trim();
        }
      }
    }
  } catch {
    // Ignore
  }

  return undefined;
};

export const getSession = async (c: Context | Request) => {
  const { session, user } = await getOptionalSession(mapRequestToContextForCookie(c));

  if (session && user) {
    return { session, user };
  }

  if (c instanceof Request) {
    throw new Error('Unauthorized');
  }

  throw new AppError(AuthenticationErrorCode.Unauthorized);
};

export const getOptionalSession = async (c: Context | Request): Promise<SessionValidationResult> => {
  const sessionId = await getSessionCookie(mapRequestToContextForCookie(c));

  if (sessionId) {
    const sessionResult = await validateSessionToken(sessionId);

    if (sessionResult.isAuthenticated) {
      return sessionResult;
    }
  }

  const demoLoginEmail = getDemoLoginEmail();

  if (demoLoginEmail) {
    const isAnyUser = demoLoginEmail.toLowerCase() === 'true' || demoLoginEmail.toLowerCase() === 'enabled';

    const user = await prisma.user.findFirst({
      where: isAnyUser
        ? { emailVerified: { not: null }, disabled: false }
        : { email: demoLoginEmail.toLowerCase(), disabled: false },
    });

    if (user) {
      const session = await prisma.session.upsert({
        where: {
          id: `demo_session_${user.id}`,
        },
        update: {
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
        },
        create: {
          id: `demo_session_${user.id}`,
          sessionToken: `demo_token_${user.id}`,
          userId: user.id,
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
          ipAddress: '127.0.0.1',
          userAgent: 'Demo Bypass',
        },
      });

      return {
        isAuthenticated: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
          avatarImageId: user.avatarImageId,
          twoFactorEnabled: user.twoFactorEnabled,
          roles: user.roles,
          signature: user.signature,
          disabled: user.disabled,
        },
        session,
      };
    }
  }

  return {
    isAuthenticated: false,
    session: null,
    user: null,
  };
};

export type ActiveSession = Omit<Session, 'sessionToken'>;

export const getActiveSessions = async (c: Context | Request): Promise<ActiveSession[]> => {
  const { user } = await getSession(c);

  return await prisma.session.findMany({
    where: {
      userId: user.id,
      expiresAt: {
        gt: new Date(),
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
    select: {
      id: true,
      userId: true,
      expiresAt: true,
      updatedAt: true,
      createdAt: true,
      ipAddress: true,
      userAgent: true,
    },
  });
};

/**
 * Todo: (RR7) Rethink, this is pretty sketchy.
 */
const mapRequestToContextForCookie = (c: Context | Request) => {
  if (c instanceof Request) {
    const partialContext = {
      req: {
        raw: c,
      },
    };

    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return partialContext as unknown as Context;
  }

  return c;
};
