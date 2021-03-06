import {test, describe, expect} from "@jest/globals";
import {checkResetTiming, checkResetFlag} from "../src/Time.js"

describe("任務のリセットタイミングのテスト", () => {
    test("マンスリー", () => {
        expect(checkResetTiming(1)).toStrictEqual(["monthly"]);
        expect(checkResetTiming(2)).toStrictEqual(["monthly"]);
        expect(checkResetTiming(4)).toStrictEqual(["monthly"]);
        expect(checkResetTiming(5)).toStrictEqual(["monthly"]);
        expect(checkResetTiming(7)).toStrictEqual(["monthly"]);
        expect(checkResetTiming(8)).toStrictEqual(["monthly"]);
        expect(checkResetTiming(10)).toStrictEqual(["monthly"]);
        expect(checkResetTiming(11)).toStrictEqual(["monthly"]);
    });

    test("マンスリー&クォータリー", () => {
        expect(checkResetTiming(12)).toStrictEqual(["monthly", "quarterly"]);
        expect(checkResetTiming(3)).toStrictEqual(["monthly", "quarterly"]);
        expect(checkResetTiming(6)).toStrictEqual(["monthly", "quarterly"]);
        expect(checkResetTiming(9)).toStrictEqual(["monthly", "quarterly"]);
    });

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