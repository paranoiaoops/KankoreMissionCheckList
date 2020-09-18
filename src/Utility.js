
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
    return missionData;
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