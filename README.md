# 料金シミュレーター (Next.js版)

Web制作のコーディング費用を、依頼者の属性（エンドユーザー直請け／制作会社パートナー）や制作内容に応じて概算できる見積もりシミュレーターです。

**公開URL**: https://pricing-simulator-next.vercel.app

個人事業「L'uoly Web」のポートフォリオ作品として、独立したNext.jsアプリケーションで実装しました。

## 技術スタック

- **フレームワーク**: Next.js 16 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS（ページ全体のレイアウト）／ CSS Modules相当の素のCSS（シミュレーター本体）
- **デプロイ**: Vercel
- **開発支援**: Claude Code

## 機能

- 属性（直請け／パートナー）によって単価テーブルを切り替え
- 制作種別（LP／HP）、下層ページ数、オプション（WordPress構築・フォーム・複雑な実装等）をリアルタイムに反映した概算見積もり表示
- 見積もり内容をクリップボードにコピーし、メール下書き（mailto）で問い合わせを送れる導線

## 元になったプロジェクトについて

もともとはWordPressテーマ内に埋め込む想定で、Vite + React + TypeScriptで実装していたコンポーネントです（WordPressテーマ本体のリポジトリ内で管理・非公開）。今回、独立したNext.jsアプリとして移植し、以下を変更しています。

- WordPressの問い合わせフォーム（同一ページの`#contact`）と連携していた処理を、`mailto:`リンクによる見積もり内容の引き継ぎに変更
- ページ全体のレイアウト・メタデータ・ダークテーマ背景をNext.js側で新規に構築

## AIエージェント（Claude Code）の活用について

本プロジェクトは、要件整理からコンポーネントの移植、Next.jsプロジェクトの構築、GitHub/Vercelへのデプロイまで、一貫してClaude Codeと協働しながら開発しました。

- **どの工程で**: プロジェクトの初期セットアップ（`create-next-app`実行）、既存コンポーネントのApp Router対応（`'use client'`ディレクティブの付与、WordPress依存処理の切り離し）、GitHubリポジトリ作成・Vercelデプロイの一連の操作
- **うまくいった点**: 既存のReactコンポーネントをそのまま流用しつつ、Next.js特有の作法（Server/Client Componentsの切り分け、App Routerのメタデータ定義）への移行を素早く進められた
- **難しかった点**: 元のコンポーネントがWordPress側のDOM（同一ページの問い合わせフォーム）を前提に設計されていたため、独立したアプリとして成立させるには、単純な移植ではなく「何を残し、何を作り直すか」の判断が必要だった。クロスオリジンの制約上、元の仕組み（sessionStorageでの値引き継ぎ）がそのまま使えないと判断し、`mailto`方式に設計変更した

## ローカルでの実行方法

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) で確認できます。

## 作者

[L'uoly Web](https://luolyweb.com/) — 小原 寿俊
