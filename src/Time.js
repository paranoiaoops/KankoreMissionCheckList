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