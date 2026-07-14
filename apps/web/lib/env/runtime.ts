export function getPublicAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

export function isVapiEnabled(): boolean {
  return process.env.NEXT_PUBLIC_VAPI_ENABLED === "true";
}
