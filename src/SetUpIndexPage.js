import { openDb, getByKey, putData } from "./IndexDbUtility.js";
import {
    createProgressData, createDisplayData, getMissionDataJson,
    resetProgressData, getMissionIdByMissionType} from "./Utility.js";
import {resetMissionList} from "./Drawing.js";
import {checkResetFlag, checkResetTiming} from "./Time.js";

window.onload = () => {
    (async() => {
        await getMissionDataJson().then((json) => {
            globalThis.missionData = json;
        });
        await openDb().then((resolve) => {
            getByKey(resolve,"progressData", "1").then((indexDbProgressData) => {
                globalThis.indexedDBrequests = resolve;
                globalThis.progressData = createProgressData(globalThis.missionData, indexDbProgressData);
                // 任務の進行状態をリセットする処理
                let today = new Date();
                if (globalThis.progressData.hasOwnProperty("reset_year")) {
                    globalThis.progressData["reset_year"] = today.getFullYear() - 1;
                    globalThis.progressData["reset_month"] = today.getMonth()+1;
                }

                if (checkResetFlag(globalThis.progressData["reset_year"], globalThis.progressData["reset_month"],
                    today.getFullYear(), today.getMonth() +1)) {
                    globalThis.progressData = resetProgressData(globalThis.progressData,
                        getMissionIdByMissionType(globalThis.missionData,
                            checkResetTiming(today.getMonth()+1)));
                    globalThis.progressData["reset_year"] = today.getFullYear();
                    globalThis.progressData["reset_month"] = today.getMonth()+1;
                }
                globalThis.progressData["id"] = "1";
                globalThis.displayData = createDisplayData(globalThis.missionData, globalThis.progressData);
                putData(resolve, "progressData", globalThis.progressData);
                resetMissionList();
            });
        });
    })();
}