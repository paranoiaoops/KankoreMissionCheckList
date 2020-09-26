import {test, describe, expect} from "@jest/globals";
import {createProgressData, createDisplayData, pickUpAreaData, checkAreaData, checkAreaClearFlag, getMissionIdByMissionType}from "../src/Utility";

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
                },
                "display_flag" : false
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
                },
                "display_flag" : false
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
                },
                "display_flag" : false
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
                },
                "display_flag" : false
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
                },
                "display_flag" : false
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
                },
                "display_flag" : false
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
                },
                "display_flag" : false
            }
        }

        expect(createProgressData(sampleMissionData, testData)).toStrictEqual(toBeObject);
    });
});


describe("HTML描画用のデータ整形処理", () => {
   test("ソートされた状態ででてくる", () => {
       const missionData = {
           "1" : {
               "mission" : "サンプル",
               "mission_type" : "yearly",
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
           },
           "3" : {
               "mission" : "サンプル3",
               "mission_type" : "monthly",
               "terms" : "",
               "area" : {
                   "1" : {
                       "area_number" : "5-4",
                       "achievement_conditions" : "S"
                   },
                   "2" : {
                       "area_number" : "5-5",
                       "achievement_conditions" : "S"
                   }
               }
           }
       };
       const progressData = {
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
               },
               "display_flag" : false
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
               },
               "display_flag" : false
           },
           "3" : {
               "progress" : {
                   "1" : {
                       "clear" : false,
                       "url" : ""
                   },
                   "2" : {
                       "clear" : false,
                       "url" : ""
                   }
               },
               "display_flag" : false
           }
       };

       const toBeObject = {
           "3" : {
               "mission" : "サンプル3",
               "mission_type" : "monthly",
               "terms" : "",
               "area" : {
                   "1" : {
                       "area_number" : "5-4",
                       "achievement_conditions" : "S"
                   },
                   "2" : {
                       "area_number" : "5-5",
                       "achievement_conditions" : "S"
                   }
               },
               "progress" : {
                   "1" : {
                       "clear" : false,
                       "url" : ""
                   },
                   "2" : {
                       "clear" : false,
                       "url" : ""
                   }
               },
               "display_flag" : false
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
               },
               "progress" : {
                   "1" : {
                       "clear" : false,
                       "url" : ""
                   },
                   "2" : {
                       "clear" : false,
                       "url" : ""
                   }
               },
               "display_flag" : false
           },
           "1" : {
               "mission" : "サンプル",
               "mission_type" : "yearly",
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
               },
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
               },
               "display_flag" : false
           }
       }

       expect(createDisplayData(missionData, progressData)).toStrictEqual(toBeObject);
   });
});

describe("同一海域情報を抽出する処理", () => {

    test("areaデータで同一データがあるかどうかをチェックするための処理", () => {
        const areaTestData = {
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

        expect(checkAreaData(areaTestData, "1-5")).toStrictEqual(["1", "2", "3"]);
        expect(checkAreaData(areaTestData, "1-3")).toStrictEqual([]);
        expect(checkAreaData({
            "1" : {
                "area_number" : "2-4",
                "achievement_conditions" : "A"
            },
            "2" : {
                "area_number" : "2-3",
                "achievement_conditions" : "A"
            }
        }, "1-5")).toStrictEqual([]);
        expect(checkAreaData({
            "1" : {
                "area_number" : "2-4",
                "achievement_conditions" : "A"
            },
            "2" : {
                "area_number" : "2-3",
                "achievement_conditions" : "A"
            }
        }, "2-3")).toStrictEqual(["2"]);
    });

    test("同一海域がある場合の処理", () =>{
        const missionTestData = {
            "1" : {
                "mission" : "サンプル",
                "mission_type" : "yearly",
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
            },
            "3" : {
                "mission" : "サンプル3",
                "mission_type" : "monthly",
                "terms" : "",
                "area" : {
                    "1" : {
                        "area_number" : "5-4",
                        "achievement_conditions" : "S"
                    },
                    "2" : {
                        "area_number" : "5-5",
                        "achievement_conditions" : "S"
                    }
                }
            }
        };


        expect(pickUpAreaData(missionTestData,"1", "1-5")).toStrictEqual(
            {
                "2" : {
                    "mission" : "サンプル2",
                    "mission_type" : "quarterly",
                    "terms" : "軽巡旗艦",
                    "area" : {
                        "1" : {
                            "area_number" : "1-5",
                            "achievement_conditions" : "A"
                        }
                    }
                }
            }
        );

        expect(pickUpAreaData(missionTestData,"2", "1-5")).toStrictEqual(
            {
                "1" : {
                    "mission" : "サンプル",
                    "mission_type" : "yearly",
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
                }
            }
        );

        expect(pickUpAreaData(missionTestData,"3", "5-5")).toStrictEqual({});
    });
});

describe("表示用データからクリア状況を抽出する処理", () => {
    test("テスト", () => {
       const testDisplayData = {
           "1" : {
               "mission" : "サンプル",
               "mission_type" : "yearly",
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
               },
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
                       "clear" : true,
                       "url" : ""
                   }
               },
               "display_flag" : false
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
               },
               "progress" : {
                   "1" : {
                       "clear" : true,
                       "url" : ""
                   },
                   "2" : {
                       "clear" : false,
                       "url" : ""
                   }
               },
               "display_flag" : false
           },
           "3" : {
               "mission" : "サンプル3",
               "mission_type" : "monthly",
               "terms" : "",
               "area" : {
                   "1" : {
                       "area_number" : "5-4",
                       "achievement_conditions" : "S"
                   },
                   "2" : {
                       "area_number" : "5-5",
                       "achievement_conditions" : "S"
                   }
               },
               "progress" : {
                   "1" : {
                       "clear" : false,
                       "url" : ""
                   },
                   "2" : {
                       "clear" : false,
                       "url" : ""
                   }
               },
               "display_flag" : false
           }
       };
       expect(checkAreaClearFlag(testDisplayData, "1", "3")).toBeTruthy();
       expect(checkAreaClearFlag(testDisplayData, "1", "2")).toBeFalsy();
    });
});

describe("特定のミッションタイプのデータを抽出する処理", () => {
    const testMissionData = {
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
            "mission": "「潜水艦隊」出撃せよ！",
            "mission_type": "monthly",
            "terms": "",
            "area": {
                "1" : {
                    "area_number": "6-1",
                    "achievement_conditions": "S"
                },
                "2" : {
                    "area_number": "6-1",
                    "achievement_conditions": "S"
                },
                "3" : {
                    "area_number": "6-1",
                    "achievement_conditions": "S"
                }
            }
        },
        "9" : {
            "mission" : "沖ノ島海域迎撃戦",
            "mission_type" : "quarterly",
            "terms" : "",
            "area" : {
                "1" : {
                    "area_number" : "2-4",
                    "achievement_conditions" : "S"
                },
                "2" : {
                    "area_number" : "2-4",
                    "achievement_conditions" : "S"
                }
            }
        },
        "12" : {
            "mission" : "前線の航空偵察を実施せよ！",
            "mission_type" : "quarterly",
            "terms" : "水母1隻+軽巡2隻+自由枠3隻",
            "area" : {
                "1" : {
                    "area_number" : "6-3",
                    "achievement_conditions" : "A"
                },
                "2" : {
                    "area_number" : "6-3",
                    "achievement_conditions" : "A"
                }
            }
        },
        "23" : {
            "mission" : "(2月) 「海防艦」、海を護る！",
            "mission_type" : "yearly",
            "terms" : "海防艦3隻+自由枠2隻の5隻以下の編成",
            "area" : {
                "1" : {
                    "area_number" : "1-1",
                    "achievement_conditions" : "A"
                },
                "2" : {
                    "area_number" : "1-2",
                    "achievement_conditions" : "A"
                },
                "3" : {
                    "area_number" : "1-3",
                    "achievement_conditions" : "A"
                },
                "4" : {
                    "area_number" : "1-4",
                    "achievement_conditions" : "A"
                },
                "5" : {
                    "area_number" : "1-6",
                    "achievement_conditions" : "ゴール"
                }
            }
        }
    };
    test("対象があるとき", () => {
        expect(getMissionIdByMissionType(testMissionData, ["monthly"])).toStrictEqual(["1", "2"]);
        expect(getMissionIdByMissionType(testMissionData, ["monthly", "quarterly"])).toStrictEqual(["1", "2", "9", "12"]);
        expect(getMissionIdByMissionType(testMissionData, ["quarterly"])).toStrictEqual(["9", "12"]);
    });

    test("対象がないとき",　() => {
        expect(getMissionIdByMissionType(testMissionData, [])).toStrictEqual([]);
    })
});