
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