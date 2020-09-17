
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
                "progress" : progressDataObject
            }
        }
    }
    return progressData;
}