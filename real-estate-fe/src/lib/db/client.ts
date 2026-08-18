import 'server-only';

import { MongoClient, ServerApiVersion } from 'mongodb';

import { serverEnv } from '@/config/env.server';

import type { Db, MongoClientOptions } from 'mongodb';

/**
 * Kết nối MongoDB cho môi trường serverless.
 *
 * Mỗi lambda là một tiến trình riêng. Tạo MongoClient mới mỗi request sẽ làm
 * cạn connection pool của Atlas (M0 chỉ cho 500 kết nối) và mỗi request phải
 * chịu thêm ~100ms bắt tay TLS. Vì vậy client được cache vào biến global và
 * tái dùng qua các lần gọi nóng của cùng một lambda.
 *
 * Cache phải nằm ở `globalThis` chứ không phải biến module: ở dev, Next hot
 * reload sẽ nạp lại module liên tục, biến module bị reset và ta lại rò kết nối
 * sau mỗi lần sửa file.
 */

const MONGO_OPTIONS: MongoClientOptions = {
  // Serverless: mỗi instance chỉ cần vài kết nối. Để mặc định (100) thì chỉ
  // cần dăm lambda chạy song song là chạm trần của Atlas.
  maxPoolSize: 10,
  minPoolSize: 0,
  // Đóng kết nối rỗi sớm để lambda ngủ đông không giữ slot.
  maxIdleTimeMS: 30_000,
  // Thà lỗi nhanh còn hơn treo request 30s mặc định.
  serverSelectionTimeoutMS: 8_000,
  socketTimeoutMS: 45_000,
  retryWrites: true,
  serverApi: {
    version: ServerApiVersion.v1,
    strict: false,
    deprecationErrors: true,
  },
};

declare global {
   
  var __mongoClientPromise: Promise<MongoClient> | undefined;
}

function createClientPromise(): Promise<MongoClient> {
  const client = new MongoClient(serverEnv.MONGODB_URI, MONGO_OPTIONS);
  return client.connect();
}

/**
 * Promise của client — cố tình cache PROMISE chứ không cache client đã kết nối.
 * Nếu cache client, hai request đến cùng lúc lúc lambda mới khởi động sẽ cùng
 * thấy cache rỗng và cùng tạo kết nối. Cache promise thì request thứ hai chờ
 * đúng promise của request thứ nhất.
 */
function getClientPromise(): Promise<MongoClient> {
  if (!globalThis.__mongoClientPromise) {
    globalThis.__mongoClientPromise = createClientPromise().catch((err) => {
      // Kết nối hỏng thì phải xoá cache, nếu không mọi request sau đều nhận lại
      // đúng promise đã reject và app chết vĩnh viễn cho tới khi redeploy.
      globalThis.__mongoClientPromise = undefined;
      throw err;
    });
  }
  return globalThis.__mongoClientPromise;
}

export async function getMongoClient(): Promise<MongoClient> {
  return getClientPromise();
}

export async function getDb(): Promise<Db> {
  const client = await getClientPromise();
  return client.db(serverEnv.MONGODB_DB);
}

/** Kiểm tra sức khoẻ kết nối — dùng cho /api/health. */
export async function pingDb(): Promise<{ ok: boolean; latencyMs: number }> {
  const started = Date.now();
  try {
    const db = await getDb();
    await db.command({ ping: 1 });
    return { ok: true, latencyMs: Date.now() - started };
  } catch {
    return { ok: false, latencyMs: Date.now() - started };
  }
}
