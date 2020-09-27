import { openDb, getByKey, putData } from "./IndexDbUtility.js";
import {
    createProgressData,
    createDisplayData,
    getMissionDataJson,
    resetProgressData,
    getMissionIdByMissionType,
} from "./Utility.js";
import {setUpReverse} from "./Drawing.js";
import {checkResetTiming} from "./Time.js";

window.onload = () => {
    (async() => {
        await getMissionDataJson().then((json) => {
            globalThis.missionData = json;
        });
        await openDb().then((resolve) => {
            getByKey(resolve,"progressData", "1").then((indexDbProgressData) => {
                globalThis.indexedDBrequests = resolve;
                globalThis.progressData = createProgressData(globalThis.missionData, indexDbProgressData);
                let today = new Date();
                globalThis.progressData = resetProgressData(globalThis.progressData,
                    getMissionIdByMissionType(globalThis.missionData,
                        checkResetTiming(today.getMonth()+1, today.getDay())));
                globalThis.progressData["id"] = "1";
                globalThis.displayData = createDisplayData(globalThis.missionData, globalThis.progressData);
                putData(resolve, "progressData", globalThis.progressData);
                setUpReverse();
            });
        });
    })();
}

