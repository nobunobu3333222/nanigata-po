# Web版の試験公開

2026-09-21。Web版から開始する方針。まだデプロイ・有料契約・ドメイン購入はしていません。

## 初期構成

- 個人・非商用の試験公開ならVercel Hobby、Supabase Freeを候補にする。事業目的での利用はHobby対象とは限らないため、公開用途を確認する。
- 最初はVercelの提供URLを使用し、独自ドメインは購入しない。
- Rate Limitは既存実装の `quiz-results` 1ルール。IP単位10回/600秒、超過429を目安に設定。ルール不明や保護障害時には保存を停止する現行実装を維持する。
- Hobbyの1ルール制約に合わせ、別のエッジRate Limitは同時作成しない。使用量と異常アクセスを確認する。リージョンをまたぐアクセスや分散Botへの完全防御ではない。
- Vercel/Supabaseの無料枠を超えても自動的に有料契約へ変更しない。有料オプションの購入は別途判断する。

## 公開の順序

1. GitHub・Vercel・Supabaseのアカウント作成状況を確認。
2. ソースをGitHubの非公開リポジトリへ登録し、CIを実行。秘密情報を含めない。
3. Supabaseプロジェクトを作成し、migration・権限試験を実施。
4. Vercelへ接続し、提供URLをNEXT_PUBLIC_SITE_URLに設定。Supabase URL/SecretはVercelのサーバー側設定へ直接入力する。Secretをチャットで共有しない。
5. FirewallのSDKルール・利用可能なBot対策を設定。再デプロイ後に保存成功・429・保存失敗時の結果維持を確認。
6. 運営者/問い合わせ先/データ保持運用をPrivacy/Aboutへ反映し、iPhone/Androidで確認して試験公開。

現在、作業フォルダにVercelの接続設定はありません。利用者のアカウントの有無は未確認です。登録時の規約同意や本人確認、Secret入力は利用者が管理します。

詳細な設定・検証手順はREADME.md。2026-09-21時点の公式資料: [Hobby用途](https://vercel.com/docs/plans/hobby)、[Rate Limit上限](https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting)、[SDK設定](https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting-sdk)、[Supabase料金](https://supabase.com/pricing)。
