/**
 * 任務データと現行の進行データを渡して足りないデータを作成する処理
 * 将来的に任務が追加されるときに進行データを作成するための処理
 * @param {object} missionData
 * @param {object} progressData
 * @return {object}
 */
export function createProgressData (missionData, progressData) {
    for (let k in missionData) {
        if (!(k in progressData)) {
            let progressDataObject = {};
            for (let areaDataKey in missionData[k]["area"]) {
                progressDataObject[areaDataKey] = {
                    "clear" : false,
                    "url" : ""
                }
            }
            progressData[k] = {
                "progress" : progressDataObject,
                "display_flag" : false
            }
        }
    }
    return progressData;
}

/**
 * HTMLの表示のためにデータ整形する処理
 * @param {object} missionData
 * @param {object} progressData
 * @return {object}
 */
export function createDisplayData (missionData, progressData) {
    for (let k in missionData) {
        missionData[k]["progress"] = progressData[k]["progress"];
        missionData[k]["display_flag"] = progressData[k]["display_flag"];
    }
    // ソート (マンスリー, クオータリィー, イヤーリィー)
    let monthly = {}, quarterly ={}, yearly ={};
    for (let k2 in missionData) {
        switch (missionData[k2]["mission_type"]) {
            case "monthly":
                monthly[k2] = missionData[k2];
                break;
            case "quarterly":
                quarterly[k2] = missionData[k2];
                break;
            case "yearly":
                yearly[k2] = missionData[k2];
                break;
        }

    }
    return {...yearly, ...quarterly, ...monthly};
}

/**
 * 任務データから missionId を除いた areaId の海域情報を抽出する処理
 * @param {object} missionData
 * @param {string} missionId 選択しているミッションID
 * @param {string} areaId 海域番号
 * @return {object}
 */
export function pickUpAreaData (missionData, missionId, areaId) {
    let returnObject = {};
    for (let k in missionData) {
        if (k === missionId) continue;

        let areaKeys = checkAreaData(missionData[k]["area"], areaId);
        if (!areaKeys.length) continue;

        let areaData = {};
        for (let i in areaKeys) {
            areaData[areaKeys[i]] = missionData[k]["area"][areaKeys[i]];
        }

        returnObject[k] = {
            "mission" : missionData[k]["mission"],
            "mission_type" : missionData[k]["mission_type"],
            "terms" : missionData[k]["terms"],
            "area" : areaData
        }
    }
    return returnObject;
}

/**
 * 任務の対象となる海域のオブジェクトから、areaIdが一致する海域のidをリストアップする処理
 * @param {object} areaData
 * @param {string} areaId
 * @return {array}
 */
export function checkAreaData (areaData, areaId) {
    let returnArray = [];
    for (let k in areaData) {
        if (areaData[k]["area_number"] === areaId) returnArray.push(k);
    }
    return returnArray;
}

/**
 * クリアかどうかをチェックするための関数
 * @param {object} displayData
 * @param {string} missionId
 * @param {string} areaId
 * @return {boolean}
 */
export function checkAreaClearFlag(displayData, missionId, areaId) {
    return displayData[missionId]["progress"][areaId]["clear"];
}

/**
 * 任務データを取得する処理
 * @return {Promise<any>}
 */
export async function getMissionDataJson() {
    const url = "https://paranoiaoops.github.io/KankoreMissionCheckList/Data/MissionData.json";
    return await (await fetch(url)).json();
}

/**
 * 特定のミッションタイプのIDを抽出する処理
 * @param {object} missionData
 * @param {array} targetMissionType
 * @return {array}
 */
export function getMissionIdByMissionType(missionData, targetMissionType) {
    if (!targetMissionType.length) return [];
    let val = [];
    for (let k in missionData) {
        if (targetMissionType.includes(missionData[k]["mission_type"])) val.push(k);
    }
    return val;
}