
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
 * @param missionData
 * @param progressData
 * @return object
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

export function checkAreaData (areaData, areaId) {
    let returnArray = [];
    for (let k in areaData) {
        if (areaData[k]["area_number"] === areaId) returnArray.push(k);
    }
    return returnArray;
}

export function checkAreaClearFlag(displayData, missionId, areaId) {
    return displayData[missionId]["progress"][areaId]["clear"];
}

/**
 * 任務データを取得する処理
 * FIXME url の差し替え
 * @return {Promise<any>}
 */
export async function getMissionDataJson() {
    const url = "http://localhost:63342/KankoreMissionCheckList/Data/MissionData.json";
    return await (await fetch(url)).json();
}