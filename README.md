# Vibe Coding Festival - CDK フルスタックアーキテクチャ

## アーキテクチャ概要

このプロジェクトは、AWS CDK を使用したフルスタック開発環境です：

- **認証**: Amazon Cognito User Pool
- **API**: AWS AppSync (GraphQL)
- **データベース**: Amazon DynamoDB
- **関数**: AWS Lambda
- **フロントエンド**: AWS Amplify

## セットアップ

```bash
# 依存関係のインストール
npm install

# CDK のブートストラップ（初回のみ）
npx cdk bootstrap

# スタックのデプロイ
npx cdk deploy
```

## 開発コマンド

```bash
# TypeScript のビルド
npm run build

# CDK の差分確認
npx cdk diff

# スタックの削除
npx cdk destroy
```

## 機能

- ユーザー認証・認可
- リアルタイム GraphQL API
- 投稿の CRUD 操作
- ユーザー管理
- リアルタイム購読

## 次のステップ

1. GitHub リポジトリの設定
2. フロントエンドアプリケーションの作成
3. Lambda 関数の実装
4. GraphQL リゾルバーの設定