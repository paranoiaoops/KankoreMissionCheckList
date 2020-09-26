import {putData } from "./IndexDbUtility.js";
import {createDisplayData, pickUpAreaData, checkAreaClearFlag, checkAreaData} from "./Utility.js";

/**
 * indexページ用の画面生成処理
 * Domの生成・イベントの設定等行う
 */
export function resetMissionList() {
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
    document.getElementById("dialog-Menu").addEventListener("close", () => {
        let modalMissionId = document.getElementById("dialog-Menu").returnValue;
        resetMissionList();
        document.querySelector(`details[data-mission_id="${modalMissionId}"]`).open = true;
    });
}

/**
 * index ページにおける任務の一覧 dom を作成する処理
 * @param {object} displayData
 * @return {string}
 */
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

/**
 * 任務のタイプ情報からテキストを生成する処理
 * @param {string} type
 * @return {string}
 */
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

/**
 * 任務の対象となる海域の一覧 dom を返す処理
 * @param {object} areaData
 * @param {string} missionId
 * @return {string}
 */
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

/**
 * dialog タグをの内容を生成するための処理
 * @param {object} selectDisplayData
 * @param {string} missionId
 * @param {string} areaId
 * @param {object} otherAreaData
 * @return {string}
 */
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
        <div>${missionTypeText(otherAreaData[k].mission_type)} ${otherAreaData[k].mission}</div>
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

/**
 * indexDB に進行状況のデータを保存&グローバル変数の進行状況を書き換える処理
 * @param {object} obj
 * @param {string} missionId
 * @param {string} areaId
 */
function dataSave(obj, missionId, areaId) {
    globalThis.progressData[missionId]["progress"][areaId]["clear"] = obj.checked;
    globalThis.displayData = createDisplayData(globalThis.missionData, globalThis.displayData);
    putData(globalThis.indexedDBrequests, "progressData", globalThis.progressData);
}

export function setUpReverse() {
    document.getElementById("open-Dialog").addEventListener("click", ()=> {
        // 対応するオブジェクトをリストアップ 存在しないキーを指定し対応するデータ全部を引っこ抜く
        let targetObject = pickUpAreaData(globalThis.missionData, "0", document.getElementById("area_number").value);
        document.getElementById("information").innerHTML = createReverseDialog(targetObject);

        document.querySelectorAll("input").forEach((checkbox) => {
            checkbox.addEventListener("change", () => {
                dataSave(checkbox, checkbox.dataset.mission_id, checkbox.dataset.area_id);
            });
        });
        document.getElementById("dialog-Menu").showModal();
    });
}

/**
 * 逆引きページにおける dialog dom を作成する処理
 * @param {object} missionData
 * @return {string}
 */
function createReverseDialog(missionData) {
    if (!Object.keys(missionData).length) return "<div>対応する任務がありません</div>";

    let view = "", firstFlag = true;
    for (let k in missionData) {
        view += `
        ${firstFlag ? "" : "<hr>"}
        <div>${missionTypeText(missionData[k].mission_type)} ${missionData[k].mission}</div>
        <div style="color: red">${missionData[k].terms}</div>
        `;
        for (let areaKey in missionData[k]["area"]) {
            view += `
            <div>
                <input type="checkbox" data-mission_id="${k}" data-area_id="${areaKey}" 
                    ${checkAreaClearFlag(globalThis.displayData, k, areaKey) ? "checked=\"checked\"" : ""}>
                ${missionData[k]["area"][areaKey]["area_number"]} 
                / ${missionData[k]["area"][areaKey]["achievement_conditions"]}
            </div>
            `;
        }
        firstFlag = false;
    }
    return view;
}