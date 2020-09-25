// FIXME 開発用のダミーデータ
const debugMissionData = {
    "1" : {
        "mission" : "「第五戦隊」出撃せよ！",
        "mission_type" : "monthly",
        "terms" : "第五戦隊」(「妙高」+「那智」+「羽黒」)3隻+自由枠3隻",
        "area" : {
            "1" : {
                "area_number" : "2-5",
                "achievement_conditions" : "S"
            }
        }
    },
    "2" : {
        "mission" : "海上護衛強化月間",
        "mission_type" : "monthly",
        "terms" : "",
        "area" : {
            "1" : {
                "area_number" : "1-5",
                "achievement_conditions" : "A"
            },
            "2" : {
                "area_number" : "1-5",
                "achievement_conditions" : "A"
            },
            "3" : {
                "area_number" : "1-5",
                "achievement_conditions" : "A"
            },
            "4" : {
                "area_number" : "1-5",
                "achievement_conditions" : "A"
            },
            "5" : {
                "area_number" : "1-5",
                "achievement_conditions" : "A"
            },
            "6" : {
                "area_number" : "1-5",
                "achievement_conditions" : "A"
            },
            "7" : {
                "area_number" : "1-5",
                "achievement_conditions" : "A"
            },
            "8" : {
                "area_number" : "1-5",
                "achievement_conditions" : "A"
            },
            "9" : {
                "area_number" : "1-5",
                "achievement_conditions" : "A"
            },
            "10" : {
                "area_number" : "1-5",
                "achievement_conditions" : "A"
            }
        }
    },
    "3": {
        "mission": "「水上反撃部隊」突入せよ！",
        "mission_type": "monthly",
        "terms": "旗艦「駆逐艦」+重巡1隻+軽巡1隻+駆逐3隻",
        "area": {
            "1": {
                "area_number": "2-5",
                "achievement_conditions": "S"
            }
        }
    }
};

// TODO indexDB のセットアップ
import { openDb, getByKey, putData } from "./IndexDbUtility.js";
import {createProgressData, createDisplayData, pickUpAreaData, checkAreaClearFlag} from "./Utility.js";

window.onload = () => {
    (async() => {
        await getMissionDataJson().then((json) => {
            globalThis.missionData = json;
        });
        console.log(globalThis.missionData);
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

async function getMissionDataJson() {
    const url = "http://localhost:63342/KankoreMissionCheckList/Data/MissionData.json";
    return await (await fetch(url)).json();
}


function resetMissionList() {
    document.getElementById("app").innerHTML = "loading...";
    document.getElementById("app").innerHTML = createListContents(globalThis.displayData);
    document.querySelectorAll("li").forEach((item) => {
        item.addEventListener("click", ()=> {
            // dialog の内容を書き換える
            document.getElementById("information").innerHTML = createDialogContents(
                globalThis.displayData[item.parentElement.dataset.mission_id]
                ,item.parentElement.dataset.mission_id
                ,item.dataset.area_id
                ,pickUpAreaData(globalThis.missionData, item.parentElement.dataset.mission_id, item.dataset.area_number)
            );
            document.getElementById("dialog-close").value = item.parentElement.dataset.mission_id;

            document.querySelectorAll("input").forEach((checkbox) => {
                checkbox.addEventListener("change", () => {
                    dataSave(checkbox, checkbox.dataset.mission_id, checkbox.dataset.area_id);
                });
            });
            document.getElementById("dialog-Menu").showModal();
        });
    });
    document.getElementById("")
    document.getElementById("dialog-Menu").addEventListener("close", () => {
        let modalMissionId = document.getElementById("dialog-Menu").returnValue;
        resetMissionList();
        document.querySelector(`details[data-mission_id="${modalMissionId}"]`).open = true;
    });
}

function createListContents(displayData) {
    let view = "";
    for (let k in displayData) {
        view += `
        <details data-mission_id="${k}">
            <summary>${missionTypeText(displayData[k]["mission_type"])} ${displayData[k]["mission"]}</summary>
            <ul data-mission_id="${k}">
                ${createAreaList(displayData[k]["area"], k)}
            </ul>
        </details>
        <dialog id="dialog-Menu">
            <form method="dialog">
                <div id="information"></div>
                <button id="dialog-close" value="">Close</button>
            </form>
        </dialog>
        `;
    }
    return view;
}

function missionTypeText(type) {
    let text = "";
    switch (type) {
        case "monthly":
            text = "(月)";
            break;
        case "quarterly":
            text = "(他)";
            break;
        case "yearly":
            text = "(年)";
            break;
    }
    return text;
}

function createAreaList (areaData, missionId) {
    let view = "";
    for (let k in areaData) {
        view += `
        <li data-area_id="${k}" data-area_number="${areaData[k]["area_number"]}">
            ${checkAreaClearFlag(globalThis.displayData, missionId, k) ? "<s>" : ""}
            ${areaData[k]["area_number"]} / ${areaData[k]["achievement_conditions"]}
            ${checkAreaClearFlag(globalThis.displayData, missionId, k) ? "</s>" : ""}                
        </li>
        `
    }
    return view;
}

function createDialogContents(selectDisplayData, missionId, areaId, otherAreaData){
    let view = "";
    view = `
    <div>${missionTypeText(selectDisplayData.mission_type)} ${selectDisplayData.mission}</div>
    <div style="color: red">${selectDisplayData.terms}</div>
    <div>
        <input type="checkbox" data-mission_id="${missionId}" data-area_id="${areaId}"
            ${checkAreaClearFlag(globalThis.displayData, missionId, areaId) ? "checked=\"checked\"" : "" }>
        ${selectDisplayData["area"][areaId]["area_number"]} / ${selectDisplayData["area"][areaId]["achievement_conditions"]}
    </div>
    `;
    if (!Object.keys(otherAreaData).length) return view;
    for (let k in otherAreaData) {
        view += `
        <hr></hr>
        <div>${missionTypeText(selectDisplayData.mission_type)} ${otherAreaData[k].mission}</div>
        <div style="color: red">${otherAreaData[k].terms}</div>
        `;
        for (let areaKey in otherAreaData[k]["area"]) {
            view += `
            <div>
                <input type="checkbox" data-mission_id="${k}" data-area_id="${areaKey}" 
                    ${checkAreaClearFlag(globalThis.displayData, k, areaKey) ? "checked=\"checked\"" : ""}>
                ${otherAreaData[k]["area"][areaKey]["area_number"]} 
                / ${otherAreaData[k]["area"][areaKey]["achievement_conditions"]}
            </div>
            `;
        }
    }
    return view;
}

function dataSave(obj, missionId, areaId) {
    globalThis.progressData[missionId]["progress"][areaId]["clear"] = obj.checked;
    globalThis.displayData = createDisplayData(globalThis.missionData, globalThis.displayData);
    putData(globalThis.indexedDBrequests, "progressData", globalThis.progressData);
}

