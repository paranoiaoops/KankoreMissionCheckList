/**
 * IndexDbを開くための処理
 * @return {Promise<unknown>}
 */
export async function openDb() {

    const DB_NAME = "KankoreMissionCheckList";
    const DB_STORE_NAME = "progressData";
    const DB_VERSION = 1;

    return new Promise(function (resolve) {
        console.log("openDb ...");
        // スコープ的な問題で、thisが参照できないのか
        let req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onsuccess = function (evt) {
            // ガベージコレクションの問題を避けるため、結果を得る際は
            // "req" より "this" を使用する方がよい
            // db = req.result;
            console.log("openDb DONE");
            return resolve(this.result);
        };
        req.onerror = function (evt) {
            console.error("openDb:", evt.target.errorCode);
        };

        req.onupgradeneeded = function (evt) {
            console.log("openDb.onupgradeneeded");
            let db2 = evt.target.result;
            let store = evt.target.result.createObjectStore(
                DB_STORE_NAME, {keyPath: 'id', autoIncrement: true});
        };
    })
}

/**
 * 指定したデータを取得する処理
 * @param {indexedDB} db
 * @param {string} storeName
 * @param {any} key
 * @return {Promise<unknown>}
 */
export async function getByKey (db, storeName, key) {
    return new Promise((resolve, reject) => {
        const tr = db.transaction([storeName]);
        const store = tr.objectStore(storeName);
        const request = store.get(key);
        request.onsuccess = (ev) => request.result === undefined ? resolve({}) : resolve(request.result);
        request.onerror = (err) => reject(err);
    });
}

/**
 * indexDBにデータを保存する処理
 * @param {indexedDB} db
 * @param {string} storeName
 * @param {any} value
 * @return {Promise<unknown>}
 */
export async function putData(db, storeName, value) {
    return new Promise((resolve, reject) => {
        const tr = db.transaction([storeName], "readwrite");
        const store = tr.objectStore(storeName);
        // ここでデータを追加
        const request = store.put(value);

        tr.oncomplete = () => resolve();
        tr.onerror = (err) => reject(err);
    });
}

