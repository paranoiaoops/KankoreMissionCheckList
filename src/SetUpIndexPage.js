import { openDb, getByKey, putData } from "./IndexDbUtility.js";
import {createProgressData, createDisplayData, getMissionDataJson} from "./Utility.js";
import {resetMissionList} from "./Drawing.js";

window.onload = () => {
    (async() => {
        await getMissionDataJson().then((json) => {
            globalThis.missionData = json;
        });
        await openDb().then((resolve) => {
            getByKey(resolve,"progressData", "1").then((indexDbProgressData) => {
                globalThis.indexedDBrequests = resolve;
                globalThis.progressData = createProgressData(globalThis.missionData, indexDbProgressData);
                globalThis.progressData["id"] = "1";
                globalThis.displayData = createDisplayData(globalThis.missionData, globalThis.progressData);
                putData(resolve, "progressData", globalThis.progressData);
                resetMissionList();
            });
        });
    })();
}