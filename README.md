# 勉強会 2024/6/8

## 起動方法

### 1. Dockerインストール

<https://docs.docker.com/get-docker/>

### 2. 起動

```sh
# コンテナ起動
docker-compose up -d

# コンテナに入る
docker-compose exec js /bin/sh
```

### 3. 実行

```sh
node index.js
node refactored.js
```
