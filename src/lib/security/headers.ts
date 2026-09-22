export function contentSecurityPolicy(nonce: string, development: boolean, https: boolean) {
  return [
    "default-src 'self'", `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${development ? " 'unsafe-eval'" : ""}`,
    `style-src 'self' ${development ? "'unsafe-inline'" : `'nonce-${nonce}'`}`,
    // スコア棒の幅・型カラーだけstyle属性を使用。scriptのunsafe-inlineは許可しない。
    "style-src-attr 'unsafe-inline'", `connect-src 'self'${development ? " ws: wss:" : ""}`,
    "img-src 'self' data: blob:", "font-src 'self'", "object-src 'none'", "base-uri 'self'", "form-action 'self'", "frame-ancestors 'none'", "frame-src 'none'",
    ...(https ? ["upgrade-insecure-requests"] : []),
  ].join("; ");
}
