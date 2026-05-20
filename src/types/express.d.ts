import "express";

declare module "express-serve-static-core" {
  interface Response {
    success: (params: {
      message?: string | null;
      data?: unknown;
    }) => Response;
    error: (params: {
      errorCode?: string | null;
      message?: string | null;
      data?: unknown;
    }) => Response;
  }
}