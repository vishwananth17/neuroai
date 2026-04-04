// Middleware for protecting API routes
// Apply to any route that requires authentication

import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken, authenticateRequest } from '@/lib/auth';
import { jsonErrorResponse, AuthError } from '@/lib/api/errors';

export async function requireAuth(
  request: NextRequest,
  handler: (req: NextRequest, auth: { userId: string; email: string }) => Promise<NextResponse>
) {
  try {
    // Extract and verify token
    const auth = await authenticateRequest(request.headers.get('Authorization') ?? undefined);

    if (!auth) {
      throw new AuthError('No valid authentication token provided', {
        userMessage: 'Please sign in to continue.',
        action: 'Go to login',
      });
    }

    // Call handler with auth context
    return await handler(request, auth);
  } catch (error) {
    return jsonErrorResponse(error as Error);
  }
}

// Usage example in a protected route:
//
// export async function GET(request: NextRequest) {
//   return requireAuth(request, async (req, auth) => {
//     const user = await prisma.user.findUnique({
//       where: { id: auth.userId }
//     });
//     return jsonSuccess({ user }, 200);
//   });
// }
