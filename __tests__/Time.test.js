import {test, describe, expect} from "@jest/globals";
import {checkResetTiming, checkResetFlag} from "../src/Time.js"

describe("任務のリセットタイミングのテスト", () => {
    test("マンスリー", () => {
        expect(checkResetTiming(1, 1)).toStrictEqual(["monthly"]);
        expect(checkResetTiming(2, 1)).toStrictEqual(["monthly"]);
        expect(checkResetTiming(4, 1)).toStrictEqual(["monthly"]);
        expect(checkResetTiming(5, 1)).toStrictEqual(["monthly"]);
        expect(checkResetTiming(7, 1)).toStrictEqual(["monthly"]);
        expect(checkResetTiming(8, 1)).toStrictEqual(["monthly"]);
        expect(checkResetTiming(10, 1)).toStrictEqual(["monthly"]);
        expect(checkResetTiming(11, 1)).toStrictEqual(["monthly"]);
    });

    test("マンスリー&クォータリー", () => {
        expect(checkResetTiming(12, 1)).toStrictEqual(["monthly", "quarterly"]);
        expect(checkResetTiming(3, 1)).toStrictEqual(["monthly", "quarterly"]);
        expect(checkResetTiming(6, 1)).toStrictEqual(["monthly", "quarterly"]);
        expect(checkResetTiming(9, 1)).toStrictEqual(["monthly", "quarterly"]);
    });

    test("更新なし", () => {
        expect(checkResetTiming(12, 2)).toStrictEqual([]);
        expect(checkResetTiming(1, 2)).toStrictEqual([]);
        expect(checkResetTiming(3, 15)).toStrictEqual([]);
        expect(checkResetTiming(4, 15)).toStrictEqual([]);
        expect(checkResetTiming(6, 30)).toStrictEqual([]);
    })
});

describe("任務のリセットタイミングについてのテスト", () => {
   test("True", ()=> {
       expect(checkResetFlag(2020, 1, 2020, 9)).toBeTruthy();
       expect(checkResetFlag(2020, 8, 2020, 9)).toBeTruthy();
       expect(checkResetFlag(2019, 9, 2020, 9)).toBeTruthy();
   });

   test("False", () => {
       expect(checkResetFlag(2020, 9, 2020, 9)).toBeFalsy();
       expect(checkResetFlag(2020, 10, 2020, 9)).toBeFalsy();
   });
});