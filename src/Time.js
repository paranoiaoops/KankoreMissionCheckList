/**
 * 任務のリセットタイミングならば対応する mission_type の配列を返す処理
 * @param {int} month
 * @param {int} day
 * @return {array}
 */
export function checkResetTiming(month, day) {
    if (day !== 1) return [];
    let val = ["monthly"], quarterlyRestTiming = [3, 6, 9, 12];
    if (quarterlyRestTiming.includes(month)) val.push("quarterly");
    return val;
}

/**
 * リセットした年月データと現在の年月を開くしてリセットすべきか判定する処理
 * @param {int} resetYear
 * @param {int} resetMonth
 * @param {int} nowYear
 * @param {int} nowMonth
 * @return {boolean}
 */
export function checkResetFlag(resetYear, resetMonth, nowYear, nowMonth) {
    let resetDateObject = new Date(), nowDateObject = new Date();
    resetDateObject.setFullYear(resetYear);
    resetDateObject.setMonth(resetMonth);
    resetDateObject.setDate(1);

    nowDateObject.setFullYear(nowYear);
    nowDateObject.setMonth(nowMonth);
    nowDateObject.setDate(1);
    if (resetDateObject < nowDateObject) return true;
    return false;
}