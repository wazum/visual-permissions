export const sudoModeInterceptor = async (
  request: unknown,
  next: (request: unknown) => Promise<unknown>,
): Promise<unknown> => next(request)
