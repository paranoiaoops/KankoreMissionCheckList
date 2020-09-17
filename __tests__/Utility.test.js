import {test, describe, expect} from "@jest/globals";
import {createProgressData}from "../src/Utility";

describe("任務用のJSONから進捗管理用のJSONする処理", () =>{

    const sampleMissionData = {
        "1" : {
            "mission" : "サンプル",
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
                }
            }
        },
        "2" : {
            "mission" : "サンプル2",
            "mission_type" : "quarterly",
            "terms" : "軽巡旗艦",
            "area" : {
                "1" : {
                    "area_number" : "1-5",
                    "achievement_conditions" : "A"
                },
                "2" : {
                    "area_number" : "2-5",
                    "achievement_conditions" : "A"
                }
            }
        }};

    test("進行状況のデータがない場合の処理", () =>{

        const toBeObject = {
            "1" : {
                "progress" : {
                    "1" : {
                        "clear" : false,
                        "url" : ""
                    },
                    "2" : {
                        "clear" : false,
                        "url" : ""
                    },
                    "3" : {
                        "clear" : false,
                        "url" : ""
                    }
                }
            },
            "2" : {
                "progress" : {
                    "1" : {
                        "clear" : false,
                        "url" : ""
                    },
                    "2" : {
                        "clear" : false,
                        "url" : ""
                    }
                }
            }
        };
        expect(createProgressData(sampleMissionData, {})).toStrictEqual(toBeObject);

    });

    test("すでにデータが存在する場合", () => {
        const toBeObject = {
            "1" : {
                "progress" : {
                    "1" : {
                        "clear" : true,
                        "url" : ""
                    },
                    "2" : {
                        "clear" : true,
                        "url" : ""
                    },
                    "3" : {
                        "clear" : false,
                        "url" : ""
                    }
                }
            },
            "2" : {
                "progress" : {
                    "1" : {
                        "clear" : false,
                        "url" : ""
                    },
                    "2" : {
                        "clear" : false,
                        "url" : ""
                    }
                }
            }
        };
        expect(createProgressData(sampleMissionData, toBeObject)).toStrictEqual(toBeObject);
    });

    test("任務データが追加になった時(進行状況に一部データがある場合の対応)", () => {
        const testData = {
            "1" : {
                "progress" : {
                    "1" : {
                        "clear" : true,
                        "url" : ""
                    },
                    "2" : {
                        "clear" : true,
                        "url" : ""
                    },
                    "3" : {
                        "clear" : false,
                        "url" : ""
                    }
                }
            }
        };

        const toBeObject = {
            "1" : {
                "progress" : {
                    "1" : {
                        "clear" : true,
                        "url" : ""
                    },
                    "2" : {
                        "clear" : true,
                        "url" : ""
                    },
                    "3" : {
                        "clear" : false,
                        "url" : ""
                    }
                }
            },
            "2" : {
                "progress" : {
                    "1" : {
                        "clear" : false,
                        "url" : ""
                    },
                    "2" : {
                        "clear" : false,
                        "url" : ""
                    }
                }
            }
        }

        expect(createProgressData(sampleMissionData, testData)).toStrictEqual(toBeObject);
    });
});