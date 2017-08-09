var ARGA_API = null;
var Url_Query = null;
var Local_Start_Time = null;
var ARGA_CALL_COUNTER = 1;
var ARGA_VARS = function() {
    var c = new Object();
    var a = window.location.search.substr(1).split("&");
    for (var b = 0; b < a.length; ++b) {
        var d = a[b].split("=");
        if (d.length == 2) {
            c[d[0].toLowerCase()] = d[1]
        } else {
            c[("un" + b)] = a[b]
        }
    }
    return {
        GET_FN: function(f) {
            return c[f.toLowerCase()]
        },
        ARGA_version: "4.0",
        ARGA_debug: true,
        ARGA_initialized: false
    }
}();

function Initialize_ARGA_Session(a) {
    ARGA_API = new Object();
    ARGA_API.data = new Array();
    return ARGA_Private_Fns.Get_Data_From_LMS(ARGA_API, a)
}

function GetSectionSummary() {
    return ARGA_Private_Fns.GetSectionSummary()
}

function Set_ARGA_Data(b, c) {
    if (!ARGA_VARS.ARGA_initialized) {
        ARGA_Private_Fns.ReportErrorToPx("Arga not initialized");
        return false
    }
    var a = ARGA_API.arbitraryDataIndex[b];
    if (a == null) {
        a = ARGA_API.next_arb_data_index;
        ARGA_API.arbitraryDataIndex[b] = a;
        ++ARGA_API.next_arb_data_index
    }
    ARGA_Private_Fns.SetValue("cmi.comments_from_learner." + a + ".location", b);
    ARGA_Private_Fns.SetValue("cmi.comments_from_learner." + a + ".comment", c);
    ARGA_Private_Fns.Report("Set_ARGA_Data successful: key=" + b + " / value=" + c);
    return true
}

function Get_ARGA_Data(b, a) {
    if (!ARGA_VARS.ARGA_initialized) {
        return false
    }
    var c;
    if (a != null) {
        c = ARGA_Private_Fns.Get_API_For_Learner(a)
    } else {
        c = ARGA_API
    }
    if (c == null) {
        return ""
    }
    switch (b) {
        case "learner_name":
            return c.learner_name;
        case "learner_id":
            return c.learner_id;
        case "course_id":
            return c.course_id;
        case "user_rights":
            return c.user_rights;
        case "user_due_date":
            return c.user_due_date;
        case "due_date_has_passed":
            return c.due_date_has_passed
    }
    var d = c.arbitraryDataIndex[b];
    return ARGA_Private_Fns.GetValue(c, "cmi.comments_from_learner." + d + ".comment")
}

function Get_ARGA_Data_Class(c) {
    if (!ARGA_VARS.ARGA_initialized) {
        return []
    }
    if (ARGA_API.class_info == null) {
        return []
    }
    var a = new Array();
    for (var b = 0; b < ARGA_API.class_info.length; ++b) {
        a[b] = "";
        switch (c) {
            case "learner_name":
                a[b] = ARGA_API.class_info[b].learner_name;
                continue;
            case "learner_id":
                a[b] = ARGA_API.class_info[b].learner_id;
                continue;
            case "learner_email":
                a[b] = ARGA_API.class_info[b].learner_email;
                continue;
            case "course_id":
                a[b] = ARGA_API.course_id;
                continue;
            case "user_rights":
                a[b] = ARGA_API.class_info[b].user_rights;
                continue;
            case "user_due_date":
                a[b] = ARGA_API.class_info[b].user_due_date;
                continue;
            case "due_date_has_passed":
                a[b] = ARGA_API.class_info[b].due_date_has_passed;
                continue
        }
        var d = "cmi.comments_from_learner." + ARGA_API.class_info[b].arbitraryDataIndex[c] + ".comment";
        a[b] = ARGA_API.class_info[b].data[d]
    }
    return a
}

function Set_ARGA_Question_Response(l, f, g, c, h, j, d, m) {
    if (!ARGA_VARS.ARGA_initialized) {
        ARGA_Private_Fns.ReportErrorToPx("Arga not initialized");
        return false
    }
    if (typeof arguments[0] == "object") {
        var k = arguments[0];
        f = k.questionType;
        g = k.questionText;
        c = k.correctAnswer;
        h = k.learnerResponse;
        j = k.questionGrade;
        d = k.questionWeight;
        m = k.questionData;
        l = k.questionNum
    }
    if (c == null) {
        c = ""
    }
    var b = ARGA_API.questionIndex[l];
    if (b == null) {
        b = ARGA_API.next_scorm_index;
        ARGA_API.questionIndex[l] = b;
        ++ARGA_API.next_scorm_index
    }
    var i = "cmi.interactions." + b + ".";
    ARGA_Private_Fns.SetValue(i + "id", l);
    ARGA_Private_Fns.SetValue(i + "type", "other");
    ARGA_Private_Fns.SetValue(i + "displaytype", f);
    ARGA_Private_Fns.SetValue(i + "description", g);
    ARGA_Private_Fns.SetValue(i + "correct_responses.0.pattern", c);
    ARGA_Private_Fns.SetValue(i + "learner_response", h);
    j = j * 1;
    if (isNaN(j)) {
        j = 0
    } else {
        if (j == -1) {
            j = ""
        } else {
            j = j / 100
        }
    }
    ARGA_Private_Fns.SetValue(i + "result", j);
    ARGA_Private_Fns.SetValue(i + "weighting", d);
    ARGA_Private_Fns.SetValue(i + "tag", m);
    return true
}

function Get_ARGA_LearnerResponse(b, a) {
    return ARGA_Private_Fns.GetQuestionData("learnerResponse", b, a)
}

function Get_ARGA_LearnerResponse_Class(c) {
    if (!ARGA_VARS.ARGA_initialized) {
        ARGA_Private_Fns.ReportErrorToPx("Arga not initialized");
        return []
    }
    var a = new Array();
    if (ARGA_API.class_info == null) {
        return ""
    }
    for (var b = 0; b < ARGA_API.class_info.length; ++b) {
        a[b] = "";
        var d = "cmi.interactions." + ARGA_API.class_info[b].questionIndex[c] + ".learner_response";
        a[b] = ARGA_API.class_info[b].data[d]
    }
    return a
}

function Get_ARGA_QuestionData(b, a) {
    return ARGA_Private_Fns.GetQuestionData("questionData", b, a)
}

function Get_ARGA_QuestionGrade(c, a) {
    var b = ARGA_Private_Fns.GetQuestionData("questionGrade", c, a);
    if (b == "" || b == null) {
        return -1
    } else {
        return b * 100
    }
}

function Set_ARGA_Grade(f) {
    if (!ARGA_VARS.ARGA_initialized) {
        ARGA_Private_Fns.ReportErrorToPx("Arga not initialized");
        return false
    }
    if (Get_ARGA_Data("complete") == "no") {
        ARGA_API.grade = -2
    } else {
        if (f != null) {
            ARGA_API.grade = f
        } else {
            var g = 0;
            var a = 0;
            for (var d = 0; d < 1000; ++d) {
                var h = ARGA_Private_Fns.GetValue(ARGA_API, "cmi.interactions." + d + ".id");
                if (h == "") {
                    break
                }
                var b = parseInt(ARGA_Private_Fns.GetValue(ARGA_API, "cmi.interactions." + d + ".weighting"));
                if (!isNaN(b)) {
                    if (b == -1) {
                        b = 10
                    }
                    var c = ARGA_Private_Fns.GetValue(ARGA_API, "cmi.interactions." + d + ".result");
                    if (c == null || c === "" || c == -1) {
                        if (Get_ARGA_Data("grade_partial") != "yes") {
                            ARGA_API.grade = -1;
                            return true
                        }
                    } else {
                        c *= 100;
                        g += (c * b);
                        a += b
                    }
                }
            }
            if (a == 0) {
                ARGA_API.grade = 0
            } else {
                ARGA_API.grade = Math.round(g / a)
            }
        }
    }
    return true
}

function Get_ARGA_Grade(a) {
    if (!ARGA_VARS.ARGA_initialized) {
        ARGA_Private_Fns.ReportErrorToPx("Arga not initialized");
        return -1
    }
    var b;
    if (a != null) {
        b = ARGA_Private_Fns.Get_API_For_Learner(a)
    } else {
        b = ARGA_API
    }
    if (b == null || b.grade == "" || b.grade == null) {
        return -1
    } else {
        return b.grade
    }
}

function Get_ARGA_Grade_Class() {
    if (!ARGA_VARS.ARGA_initialized) {
        return []
    }
    if (ARGA_API.class_info == null) {
        return []
    }
    var a = new Array();
    for (var b = 0; b < ARGA_API.class_info.length; ++b) {
        a[b] = ARGA_API.class_info[b].grade
    }
    return a
}

function Save_ARGA_Data(a) {
    if (!ARGA_VARS.ARGA_initialized) {
        ARGA_Private_Fns.ReportErrorToPx("Arga not initialized");
        return false
    }
    return ARGA_Private_Fns.Save_Data_To_LMS(a)
}

function Get_ARGA_QuestionData_For_PageId(a) {
    var b = new Object();
    b.learner_id = ARGA_API.learner_id;
    b.course_id = ARGA_API.course_id;
    b.page_id = a;
    b.data = new Array();
    ARGA_Private_Fns.Get_Data_From_LMS(b)
}
var ARGA_Private_Fns = function() {
    var c = 15000;
    var a = 60000;
    var f = 5000;
    var b = 15000;
    var g = null;
    var d = false;

    function i(j) {
        if ((j & 16777216) > 0) {
            return "3_instructor"
        } else {
            return "1_student"
        }
    }

    function h() {
        var j = document.getElementById("ARGA_ajax_save_div");
        if (j != null) {
            j.style.display = "block"
        } else {
            var k = document.createElement("div");
            k.setAttribute("id", "ARGA_ajax_save_div");
            k.innerHTML = "<div style='position:fixed; left:0px; top:0px; width:100%; height:100%; z-index:99999;'><div style='position:fixed; left:0px; top:0px; width:100%; height:100%; background-color:#fff; opacity: .7; filter:Alpha(Opacity=70);'></div><div style='position:fixed; left:0px; top:0px; width:100%; height:100%'><div style='margin-top:150px; margin-left:auto; margin-right:auto; width:160px; text-align:center; background-color:#000; opacity: 1; filter:Alpha(Opacity=100); border:1px solid #000; border-radius:8px; padding:10px; color:#fff; font-weight:bold; font-family:Verdana, sans-serif; font-size:14px;'><img border='0' src='http://ajax.aspnetcdn.com/ajax/jquery.mobile/1.1.0/images/ajax-loader.gif' width='20' height='20' align='absbottom'> Saving data...</div></div>";
            document.body.appendChild(k)
        }
    }
    return {
        CalculateDueDateGrace: function(j, m) {
            if (!j) {
                return null
            }
            if (Url_Query && Url_Query.dueDate > 0) {
                j = new Date((Url_Query.dueDate))
            } else {
                if (isNaN(Date.parse(j))) {
                    j = ARGA_Private_Fns.ParseDate(j)
                } else {
                    j = new Date(j)
                }
            }
            if (!m) {
                return j
            } else {
                if (m == -1) {
                    var k = new Date("1/1/2999");
                    return k
                } else {
                    var k;
                    try {
                        k = new Date(j.getTime() + (m * 60000))
                    } catch (l) {
                        ARGA_Private_Fns.ReportErrorToPx("CalculateDueDateGrace() error : dueDate = " + j + ", gracePeriod = " + m)
                    }
                    return k
                }
            }
        },
        ParseDate: function(k) {
            var j = k.match(/(\d+)-(\d+)-(\d+) (\d+):(\d+):(\d+)/);
            return new Date(j[1], j[2] - 1, j[3], j[4], j[5], j[6])
        },
        Get_API_For_Learner: function(l) {
            for (var k = 0; k < ARGA_API.class_info.length; ++k) {
                if (ARGA_API.class_info[k].learner_id == l) {
                    return ARGA_API.class_info[k]
                }
            }
            return null
        },
        GetValue: function(j, k, m) {
            if (m == null && j && j.dejs_data) {
                for (var l = 0; l < j.dejs_data.length; ++l) {
                    var n = j.dejs_data[l];
                    if (n.name == k) {
                        return n.value
                    }
                }
            } else {
                if (m != null) {
                    for (key in m) {
                        if (key == k) {
                            return m[key]
                        }
                    }
                }
            }
            return ""
        },
        GetQuestionData: function(n, m, k) {
            if (!ARGA_VARS.ARGA_initialized) {
                ARGA_Private_Fns.ReportErrorToPx("Arga not initialized");
                return ""
            }
            var l;
            if (k != null) {
                l = ARGA_Private_Fns.Get_API_For_Learner(k)
            } else {
                l = ARGA_API
            }
            if (l == null) {
                return ""
            }
            var j = l.questionIndex[m];
            if (j != null) {
                var o = "cmi.interactions." + j;
                if (n == "learnerResponse") {
                    o += ".learner_response"
                } else {
                    if (n == "questionData") {
                        o += ".tag"
                    } else {
                        if (n == "questionGrade") {
                            o += ".result"
                        }
                    }
                }
                return ARGA_Private_Fns.GetValue(l, o)
            } else {
                return ""
            }
        },
        SetValue: function(j, m) {
            for (var k = 0; k < ARGA_API.dejs_data.length; ++k) {
                var n = ARGA_API.dejs_data[k];
                if (n.name == j) {
                    n.value = m;
                    n.dirty = true;
                    return
                }
            }
            var l = ARGA_API.dejs_data.length;
            n = ARGA_API.dejs_data[l] = new Object();
            n.name = j;
            n.value = m;
            n.dirty = true
        },
        GetSectionSummary: function() {
            g = $.Deferred();
            var j = new Object();
            j.tempAPI = ARGA_API;
            j.timeout = f;
            j.callback = ARGA_Private_Fns.GetSectionSummaryCallback;
            if (JSONP.sameHost() && parent.ArgaServices && !Url_Query.api_mode) {
                var k = parent.ArgaServices.getClassScoData(null, Url_Query.itemid, f);
                k.done(function(l) {
                    ARGA_Private_Fns.GetSectionSummaryCallback.apply(window, [j, l.success, l.data])
                })
            } else {
                DEJS_API.getSectionData(j)
            }
            return g.promise()
        },
        Get_Data_From_LMS: function(n, k) {
            if (k == null) {
                k = new Object()
            }
            k.tempAPI = n;
            var j = DEJS_API.initialize();
            if (!j) {
                ARGA_Private_Fns.ReportErrorToPx("DEJS_API failed to initialize");
                return false
            }
            if (k.retrieve_class_data == true || k.retrieve_class_data == "1") {
                if (k.retrieve_class_data_rights != null) {
                    var l = new Object();
                    l.tempAPI = n;
                    l.timeout = a;
                    l.callback = ARGA_Private_Fns.Get_Section_Data_AJAX_Callback;
                    l.cancel_initialization_alert = k.cancel_initialization_alert;
                    l.dueDateTimeTrackConfig = k.dueDateTimeTrackConfig;
                    var m = DEJS_API.getSectionData(l);
                    if (!m) {
                        ARGA_Private_Fns.ReportErrorToPx("DEJS_API getSectionData failed to run");
                        return false
                    }
                } else {
                    k.callback = ARGA_Private_Fns.Get_Data_From_LMS_Callback;
                    k.timeout = c;
                    j = DEJS_API.getData(k);
                    if (!j) {
                        ARGA_Private_Fns.ReportErrorToPx("DEJS_API getData failed to run");
                        return false
                    }
                }
            } else {
                k.callback = ARGA_Private_Fns.Get_Data_From_LMS_Callback;
                k.timeout = c;
                j = DEJS_API.getData(k);
                if (!j) {
                    ARGA_Private_Fns.ReportErrorToPx("DEJS_API getData failed to run");
                    return false
                }
            }
            return true
        },
        Get_Data_From_LMS_Callback: function(s, w, p) {
            if (!w) {
                ARGA_Private_Fns.ReportErrorToPx("DEJS_API getData's ajax call failed");
                return false
            }
            var n = s.tempAPI;
            n.dejs_data = p;
            n.learner_id = ARGA_Private_Fns.GetValue(n, "bh.user_id");
            n.learner_name = ARGA_Private_Fns.GetValue(n, "bh.user_display");
            n.course_id = ARGA_Private_Fns.GetValue(n, "bh.course_id");
            n.user_rights = i(ARGA_Private_Fns.GetValue(n, "bh.enrollment_rights"));
            n.user_due_date = ARGA_Private_Fns.GetValue(n, "bh.item_due_date");
            if (n.user_due_date && isNaN(Date.parse(n.user_due_date)) && n.user_due_date.indexOf("%") != -1) {
                var z = decodeURIComponent(n.user_due_date);
                n.user_due_date = z
            }
            if (Url_Query && Url_Query.dueDate != null) {
                Url_Query.dueDate = Url_Query.dueDate * 1
            } else {
                Url_Query.dueDate = null
            }
            n.user_grace = ARGA_Private_Fns.GetValue(n, "bh.custom.duedategrace");
            n.user_due_date_grace = ARGA_Private_Fns.CalculateDueDateGrace(n.user_due_date, n.user_grace);
            n.submission_grade_action = ARGA_Private_Fns.GetValue(n, "bh.custom.submissiongradeaction");
            var t = ARGA_Private_Fns.GetValue(n, "cmi.score.scaled");
            if (t == "") {
                var l = ARGA_Private_Fns.GetValue(n, "cmi.exit");
                if (l == "") {
                    n.grade = ""
                } else {
                    var q = ARGA_Private_Fns.GetValue(n, "cmi.completion_status");
                    if (q == "completed") {
                        n.grade = "-1"
                    } else {
                        if (q == "incomplete") {
                            n.grade = "-2"
                        } else {
                            n.grade = ""
                        }
                    }
                }
            } else {
                n.grade = t * 100
            }
            ARGA_Private_Fns.SetDueDateInfo(s, n);
            n.questionIndex = new Object();
            for (var o = 0; o < 1000; ++o) {
                var k = ARGA_Private_Fns.GetValue(n, "cmi.interactions." + o + ".id");
                if (k == "") {
                    break
                }
                n.questionIndex[k] = o
            }
            n.next_scorm_index = o;
            n.arbitraryDataIndex = new Object();
            var j = ARGA_Private_Fns.GetValue(n, "cmi.comments_from_learner._count");
            if (j == "" || parseFloat(j) > 0) {
                for (var u = 0; u < 1000; ++u) {
                    var v = ARGA_Private_Fns.GetValue(n, "cmi.comments_from_learner." + u + ".location");
                    if (v == "") {
                        break
                    }
                    n.arbitraryDataIndex[v] = u
                }
                n.next_arb_data_index = u
            } else {
                n.next_arb_data_index = 0
            }
            ARGA_VARS.ARGA_initialized = true;
            ARGA_Private_Fns.Report("Initialize_ARGA_Session successful");
            var r = ARGA_Private_Fns.GetValue(n, "bh.item_subtype");
            var y = (r && r.toLowerCase() == "learningcurve") ? true : false;
            if (y || (s.cancel_initialization_alert != true && s.cancel_initialization_alert != 1 && (!n.user_rights || n.user_rights.indexOf("instructor") === -1))) {
                var m = "";
                if (n.due_date_has_passed == 0) {
                    if (n.grade != "" && parseFloat(n.grade) >= 0) {
                        m += "You have completed this activity."
                    }
                } else {
                    if (n.due_date_has_passed == 1) {
                        if (Url_Query && Url_Query.dueDate === 0) {
                            m += "This activity has not been assigned. You may review the materials in the activity, but you will not receive a grade for submitting answers."
                        } else {
                            if ((n.grade == "" || parseFloat(n.grade) < 0)) {
                                m += "The due date for this assignment has now passed. You may review the materials in the activity, but you will not receive a grade for submitting answers."
                            } else {
                                if (parseFloat(n.grade) >= 0) {
                                    m += "You have completed this activity. The due date for this assignment has now passed.  You may review the materials in the activity, but further submissions will not be recorded."
                                }
                            }
                        }
                    }
                }
                if (m != "") {
                    alert(m)
                }
            }
            window.onbeforeunload = ARGA_Private_Fns.OnBeforeUnload;
            if (window.Initialize_ARGA_Session_Callback != null) {
                Initialize_ARGA_Session_Callback(true)
            }
            Local_Start_Time = Date && Date.now ? Date.now() : new Date().getTime();
            return true
        },
        populateClassData: function(n, o) {
            for (var t = 0; t < o.length; t++) {
                var m = o[t];
                var l = new Object();
                try {
                    l.learner_id = m.id;
                    l.learner_name = m.first + " " + m.last;
                    l.learner_email = m.email == null ? null : decodeURIComponent(m.email);
                    l.course_id = ARGA_Private_Fns.GetValue(n, "bh.course_id");
                    l.user_rights = "1_student";
                    l.user_due_date = ARGA_Private_Fns.GetValue(l, "bh.item_due_date");
                    l.due_date_has_passed = 0;
                    var r = m.score;
                    if (r == "") {
                        l.grade = ""
                    } else {
                        l.grade = r * 100
                    }
                    l.data = m.scorm;
                    l.questionIndex = new Object();
                    for (var p = 0; p < 1000; ++p) {
                        var k = ARGA_Private_Fns.GetValue(null, "cmi.interactions." + p + ".id", m.scorm);
                        if (k == "") {
                            break
                        }
                        l.questionIndex[k] = p
                    }
                    l.next_scorm_index = p;
                    l.arbitraryDataIndex = new Object();
                    var j = ARGA_Private_Fns.GetValue(null, "cmi.comments_from_learner._count", m.scorm);
                    if (j == "" || parseFloat(j) > 0) {
                        for (var s = 0; s < 1000; ++s) {
                            var u = ARGA_Private_Fns.GetValue(null, "cmi.comments_from_learner." + s + ".location", m.scorm);
                            if (u == "") {
                                break
                            }
                            l.arbitraryDataIndex[u] = s
                        }
                        l.next_arb_data_index = s
                    } else {
                        l.next_arb_data_index = 0
                    }
                    n.class_info.push(l)
                } catch (q) {
                    console.log("error Get_Section_Data_AJAX_Callback(): " + q.message ? q.message : q);
                    ARGA_Private_Fns.Report("Get section data callback error:" + q.message)
                }
            }
        },
        Get_Section_Data_AJAX_Callback: function(j, l, k) {
            if (!l) {
                ARGA_Private_Fns.ReportErrorToPx("DEJS_API getData's ajax call failed");
                return
            }
            var m = j.tempAPI;
            m.dejs_class_data = k;
            if (m.class_info == null) {
                m.class_info = new Array()
            }
            ARGA_Private_Fns.populateClassData(m, k);
            j.callback = ARGA_Private_Fns.Get_Data_From_LMS_Callback;
            j.timeout = c;
            result = DEJS_API.getData(j);
            if (!result) {
                ARGA_Private_Fns.Report("DEJS_API getData failed to run");
                return
            }
        },
        GetSectionSummaryCallback: function(j, l, k) {
            if (!l) {
                ARGA_Private_Fns.ReportErrorToPx("DEJS_API getData's ajax call failed");
                return
            }
            var m = j.tempAPI;
            m.dejs_class_data = k;
            if (m.class_info == null) {
                m.class_info = new Array()
            }
            ARGA_Private_Fns.populateClassData(m, k);
            if (g) {
                g.resolve()
            }
        },
        Save_Data_To_LMS: function(k) {
            if (ARGA_API.grade == -2 || ARGA_API.grade === "" || ARGA_API.grade == null) {
                ARGA_Private_Fns.SetValue("cmi.completion_status", "incomplete")
            } else {
                if (ARGA_API.grade == -1) {
                    ARGA_Private_Fns.SetValue("cmi.completion_status", "completed")
                } else {
                    if (ARGA_API.due_date_has_passed != 1) {
                        if (ARGA_API.submission_grade_action == "Full_Credit") {
                            ARGA_Private_Fns.SetValue("cmi.score.scaled", 1)
                        } else {
                            ARGA_Private_Fns.SetValue("cmi.score.scaled", ARGA_API.grade / 100)
                        }
                    }
                    if (!ARGA_API.completion_status) {
                        ARGA_Private_Fns.SetValue("cmi.completion_status", "completed")
                    } else {
                        ARGA_Private_Fns.SetValue("cmi.completion_status", ARGA_API.completion_status)
                    }
                }
            }
            var l = Url_Query && Url_Query.track == "true";
            if (Local_Start_Time != null && l) {
                var m = Date && Date.now ? Date.now() : new Date().getTime();
                var j = Math.round((m - Local_Start_Time) / 1000);
                ARGA_Private_Fns.SetValue("cmi.session_time", "PT" + j + "S")
            }
            ARGA_Private_Fns.SetValue("cmi.exit", "suspend");
            if (k != null && k.show_progress == true) {
                h()
            }
            DEJS_API.putData({
                callback: ARGA_Private_Fns.Save_Data_To_LMS_Callback,
                timeout: b,
                data: ARGA_API.dejs_data,
                retry: false
            });
            d = true;
            return (true)
        },
        Save_Data_To_LMS_Callback: function(j, o, l) {
            var n = document.getElementById("ARGA_ajax_save_div");
            if (n != null) {
                n.style.display = "none"
            }
            d = false;
            if (!o) {
                ARGA_Private_Fns.Report("Save_Data_To_LMS error:");
                ARGA_Private_Fns.Report(l);
                if (j.retry == false) {
                    h();
                    d = true;
                    j.retry = true;
                    if (l && (l.indexOf("Access Denied") === -1)) {
                        j.dataNeedReEncoding = true;
                        DEJS_API.putData(j)
                    } else {
                        if (JSONP.sameHost() && parent.sessionKeepAlive) {
                            parent.sessionKeepAlive();
                            setTimeout(function() {
                                DEJS_API.putData(j)
                            }, 2000)
                        } else {
                            DEJS_API.putData(j)
                        }
                    }
                    return
                } else {
                    alert("We were again unable to save your activity data. This may be due to a poor internet connection. Try refreshing your browser window and attempting the activity again, or try again later.\n\nIf you encounter this message consistently and report the incident to technical support, please pass on the following information:\n\nError message: " + l);
                    return
                }
            }
            for (var k = 0; k < ARGA_API.dejs_data.length; k++) {
                ARGA_API.dejs_data[k].dirty = null
            }
            if (ARGA_API.grade !== "" && ARGA_API.grade != null && ARGA_API.grade * 1 >= -1) {
                try {
                    if (ARGA_API.previousGrade == null || ARGA_API.previousGrade !== ARGA_API.grade) {
                        arga_rpc.argacomplete(ARGA_API.grade);
                        ARGA_Private_Fns.Report("called rpc.argacomplete; grade=" + ARGA_API.grade);
                        ARGA_API.previousGrade = ARGA_API.grade
                    }
                } catch (m) {
                    console.log("error Save_Data_To_LMS(): " + m.message ? m.message : m)
                }
            }
            if (window.Save_ARGA_Data_Callback) {
                Save_ARGA_Data_Callback(true)
            }
        },
        Report: function(j) {
            if (ARGA_VARS.ARGA_debug) {
                try {
                    console.log(j)
                } catch (k) {
                    console.log("error Report(): " + k.message ? k.message : k)
                }
            }
            var l = document.getElementById("ARGA_debug_div");
            if (l) {
                l.innerHTML += "<div style='border-top:1px solid #666; padding-top:3px; margin-top:3px'>" + j + "</div>"
            }
        },
        ReportErrorToPx: function(j) {
            ARGA_Private_Fns.Report(j);
            if (JSONP.sameHost() && parent.PxPage) {
                $.post(parent.PxPage.Routes.log_javascript_errors, {
                    errorName: "Arga Activity Error",
                    errorMessage: j
                })
            }
        },
        SetDueDateInfo: function(l, w) {
            var z = l.dueDateTimeTrackConfig;
            var B;
            if (z != null && !!z.startTime) {
                B = z.startTime
            } else {
                if (Url_Query && Url_Query.startTime) {
                    B = Url_Query.startTime * 1
                } else {
                    B = new Date().getTime()
                }
            }
            var j;
            var E, A, m, x, t;
            if (Url_Query && Url_Query.dueDate > 0) {
                var D = new Date(Url_Query.dueDate);
                E = D.getMonth();
                A = D.getDate();
                m = D.getHours();
                x = D.getMinutes();
                t = D.getFullYear();
                if (Url_Query.dueDate < B && (w.user_due_date_grace == null || isNaN(w.user_due_date_grace) || (w.user_due_date_grace < B))) {
                    w.due_date_has_passed = 1
                } else {
                    w.due_date_has_passed = 0
                }
            } else {
                if ((j = w.user_due_date.match(/(\d\d\d\d)-(\d\d)-(\d\d) (\d\d):(\d\d):(\d\d)/)) != null) {
                    t = j[1] * 1;
                    E = j[2] * 1 - 1;
                    A = j[3] * 1;
                    m = j[4] * 1;
                    x = j[5] * 1;
                    var u = j[6] * 1;
                    var q = 0;
                    var C = new Date(t, E, A, m, x, u, q);
                    if (C.getTime() < B && (w.user_due_date_grace == null || isNaN(w.user_due_date_grace) || (w.user_due_date_grace < B))) {
                        w.due_date_has_passed = 1
                    } else {
                        w.due_date_has_passed = 0
                    }
                } else {
                    w.due_date_has_passed = 0
                }
            }
            if (t == 9999) {
                w.user_due_date = ""
            } else {
                if (E != null) {
                    var o = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                    var n = o[E] + " " + A + " at ";
                    if (m < 12) {
                        if (m == 0) {
                            m = 12
                        }
                        n += m + ":" + (x < 10 ? "0" : "") + x + " AM"
                    } else {
                        n += m + ":" + (x < 10 ? "0" : "") + x + " PM"
                    }
                    w.user_due_date = n
                }
            }
            var k = w.user_due_date_grace == null ? NaN : w.user_due_date_grace.getTime();
            if (z && !w.due_date_has_passed && !isNaN(k) && w.grade !== 100) {
                if (z.dueTimeExpired) {
                    var y = k - B;
                    var p = function() {
                        ARGA_Private_Fns.AlertUserDueDateHasPassed(z.dueTimeExpired.showAlert, w);
                        if (z.alertCallback && typeof(z.alertCallback) === "function") {
                            z.alertCallback()
                        }
                    };
                    ARGA_Private_Fns.SetUpTimeTrack(y, p)
                }
                if (z.dueTimeReminder) {
                    var r = k - B;
                    var v = r - 600000;
                    var s = function() {
                        ARGA_Private_Fns.AlertUserDueDateSoonPass(z.dueTimeReminder.showAlert, r < 600000 ? r : 600000);
                        if (z.reminderCallback && typeof(z.reminderCallback) === "function") {
                            z.reminderCallback()
                        }
                    };
                    ARGA_Private_Fns.SetUpTimeTrack((r < 600000 ? 100 : v), s)
                }
            }
        },
        SetUpTimeTrack: function(k, j) {
            if (k < 10 || k > 2147483647) {
                return
            }
            setTimeout(j, k)
        },
        AlertUserDueDateHasPassed: function(k, j) {
            j.due_date_has_passed = 1;
            if (k) {
                alert("The due time has expired. You can continue to work on the activity, but your grade will no longer be updated.")
            }
        },
        AlertUserDueDateSoonPass: function(l, j) {
            var k = Math.ceil(j / 60000);
            if (l && !isNaN(k)) {
                alert("The activity is going to be due in less than " + k + (k === 1 ? " minute." : " minutes."))
            }
        },
        OnBeforeUnload: function(j) {
            if (d == true) {
                var k = "Your activity data is currently in the process of being saved.";
                var j = j || window.event;
                if (j) {
                    j.returnValue = k
                }
                return k
            }
        }
    }
}();

function Initialize_SCORM_Session() {
    return Initialize_ARGA_Session()
}

function Set_SCORM_Data(a, b) {
    return Set_ARGA_Data(a, b)
}

function Get_SCORM_Data(a) {
    return Get_ARGA_Data(a)
}

function Set_SCORM_Question_Response(g, b, i, h, f, a, d, c) {
    return Set_ARGA_Question_Response(g, b, i, h, f, a, d, c)
}

function Get_SCORM_LearnerResponse(a) {
    return Get_ARGA_LearnerResponse(a)
}

function Get_SCORM_QuestionData(a) {
    return Get_ARGA_QuestionData(a)
}

function Set_SCORM_Grade(a) {
    return Set_ARGA_Grade(a)
}

function Set_ARGA_Completion_Status(a) {
    ARGA_API.completion_status = a
}

function Get_SCORM_Grade() {
    return Get_ARGA_Grade()
}

function Save_SCORM_Data() {
    return Save_ARGA_Data()
}
window.undefined = window.undefined;
var JSONP = function() {
    var h = [];
    var i = 0;
    var a = 30000;
    var g = !!{}.hasOwnProperty;

    function f(o) {
        var m = h[o];
        if (m != null && m.timeout != -1) {
            clearTimeout(m.timeout);
            m.timeout = -1
        }
        h[o] = null;
        return m
    }

    function j(o) {
        var m = h[o];
        if (m != null && m.options && !m.options.haveBeenRetried) {
            if (JSONP.sameHost() && parent.sessionKeepAlive) {
                parent.sessionKeepAlive();
                setTimeout(function() {
                    h[o] = null;
                    m.options.haveBeenRetried = true;
                    JSONP.request(m.options)
                }, 2000);
                return
            }
        }
        JSONP.callback(o, null)
    }

    function l(m) {
        return m && typeof m.getFullYear == "function"
    }
    var d = {
        "\b": "\\b",
        "\t": "\\t",
        "\n": "\\n",
        "\f": "\\f",
        "\r": "\\r",
        '"': '\\"',
        "\\": "\\\\"
    };

    function k(m) {
        if (/["\\\x00-\x1f]/.test(m)) {
            return '"' + m.replace(/([\x00-\x1f\\"])/g, function(p, o) {
                var q = d[o];
                if (q) {
                    return q
                }
                q = o.charCodeAt();
                return "\\u00" + Math.floor(q / 16).toString(16) + (q % 16).toString(16)
            }) + '"'
        }
        return '"' + m + '"'
    }

    function b(t) {
        var q = ["["],
            m, s, p = t.length,
            r;
        for (s = 0; s < p; s += 1) {
            r = t[s];
            switch (typeof r) {
                case "undefined":
                case "function":
                case "unknown":
                    break;
                default:
                    if (m) {
                        q.push(",")
                    }
                    q.push(r === null ? "null" : JSONP.encode(r));
                    m = true
            }
        }
        q.push("]");
        return q.join("")
    }

    function c(m) {
        return m < 10 ? "0" + m : m
    }

    function n(m) {
        return '"' + m.getFullYear() + "-" + c(m.getMonth() + 1) + "-" + c(m.getDate()) + "T" + c(m.getHours()) + ":" + c(m.getMinutes()) + ":" + c(m.getSeconds()) + '"'
    }
    return {
        request: function(r) {
            if (JSONP.isEmpty(r) || JSONP.isEmpty(r.url)) {
                return
            }
            var m = h.length;
            r.params = r.params || {};
            r.params.i = m.toString(10);
            var p = document.createElement("script");
            p.type = "text/javascript";
            var q = {
                script: p,
                options: r,
                timeout: -1
            };
            h.push(q);
            p.src = r.url + "?" + JSONP.urlEncode(r.params);
            q.timeout = setTimeout(function() {
                j(m)
            }, r.timeout || a);
            document.getElementsByTagName("head")[0].appendChild(p)
        },
        callback: function(q, m) {
            if (q == -1 || h[q] == null) {
                return
            }
            var o = f(q);
            if (o != null && !JSONP.isEmpty(o.options.callback)) {
                try {
                    o.options.callback.apply(o.options.scope || window, [o.options, m])
                } catch (p) {
                    console.log("error callback(): " + p.message ? p.message : p)
                }
                document.getElementsByTagName("head")[0].removeChild(o.script)
            }
        },
        getUrlLength: function(o, p) {
            p.apiIndex = "99999";
            var m = o + "?" + JSONP.urlEncode(p);
            return m.length
        },
        apply: function(r, s, q) {
            if (q) {
                apply(r, q)
            }
            if (r && s && typeof s == "object") {
                for (var m in s) {
                    r[m] = s[m]
                }
            }
            return r
        },
        isObject: function(m) {
            return m && typeof m == "object"
        },
        isArray: function(m) {
            return m && typeof m.length == "number" && typeof m.splice == "function"
        },
        isEmpty: function(m) {
            return m === null || m === "" || typeof m == "undefined"
        },
        encode: function(s) {
            if (typeof s == "undefined" || s === null) {
                return "null"
            } else {
                if (JSONP.isArray(s)) {
                    return b(s)
                } else {
                    if (l(s)) {
                        return n(s)
                    } else {
                        if (typeof s == "string") {
                            return k(s)
                        } else {
                            if (typeof s == "number") {
                                return isFinite(s) ? String(s) : "null"
                            } else {
                                if (typeof s == "boolean") {
                                    return String(s)
                                } else {
                                    var p = ["{"],
                                        m, r, q;
                                    for (r in s) {
                                        if (!g || s.hasOwnProperty(r)) {
                                            q = s[r];
                                            switch (typeof q) {
                                                case "undefined":
                                                case "function":
                                                case "unknown":
                                                    break;
                                                default:
                                                    if (m) {
                                                        p.push(",")
                                                    }
                                                    p.push(JSONP.encode(r), ":", q === null ? "null" : JSONP.encode(q));
                                                    m = true
                                            }
                                        }
                                    }
                                    p.push("}");
                                    return p.join("")
                                }
                            }
                        }
                    }
                }
            }
        },
        urlEncode: function(m) {
            if (!m) {
                return ""
            }
            var p = [];
            for (var w in m) {
                var q = m[w],
                    r = encodeURIComponent(w);
                var v = typeof q;
                if (v == "undefined") {
                    p.push(r, "=&")
                } else {
                    if (v != "function" && v != "object") {
                        p.push(r, "=", encodeURIComponent(q), "&")
                    } else {
                        if (l(q)) {
                            var x = encode(q).replace(/"/g, "");
                            p.push(r, "=", x, "&")
                        } else {
                            if (JSONP.isArray(q)) {
                                if (q.length) {
                                    for (var t = 0, u = q.length; t < u; t++) {
                                        p.push(r, "=", encodeURIComponent(q[t] === undefined ? "" : q[t]), "&")
                                    }
                                } else {
                                    p.push(r, "=&")
                                }
                            }
                        }
                    }
                }
            }
            p.pop();
            return p.join("")
        },
        urlDecode: function(s, u) {
            if (!s || !s.length) {
                return {}
            }
            var q = {};
            var o = s.split("&");
            var p, m, v;
            for (var r = 0, t = o.length; r < t; r++) {
                p = o[r].split("=");
                m = decodeURIComponent(p[0]);
                v = decodeURIComponent(p[1]);
                if (u !== true) {
                    if (typeof q[m] == "undefined") {
                        q[m] = v
                    } else {
                        if (typeof q[m] == "string") {
                            q[m] = [q[m]];
                            q[m].push(v)
                        } else {
                            q[m].push(v)
                        }
                    }
                } else {
                    q[m] = v
                }
            }
            return q
        },
        htmlEncode: function(m, o) {
            if (!m) {
                return m
            }
            if (o && window.jQuery) {
                return window.jQuery("<div></div>").text(m).html().replace(/'/g, "&#39;").replace(/"/g, "&quot;")
            }
            return !m ? m : String(m).replace(/&(?!#)/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/%0[0-8BCEF]|%1[0-9A-F]|%7F/g, "")
        },
        sameHost: function() {
            var o = Url_Query ? Url_Query : JSONP.urlDecode(window.location.search.substr(1));
            var m = o.approot;
            return m && (m.indexOf(window.location.host) > -1)
        }
    }
}();
JSONP.apply(Function.prototype, {
    createDelegate: function(b, a) {
        var c = this;
        return function() {
            var d = a || arguments;
            return c.apply(b || window, d)
        }
    },
    defer: function(b, d, a) {
        var c = this.createDelegate(d, a);
        if (b) {
            return setTimeout(c, b)
        }
        c();
        return 0
    }
});
var DEJS_API = function() {
    var q = null;
    var l = null;
    var h = null;
    var a = false;
    var j = null;
    var r = 15;

    function n() {
        return !JSONP.isEmpty(q) && !JSONP.isEmpty(h) && !JSONP.isEmpty(l)
    }

    function i(s) {
        if (!n()) {
            return false
        }
        JSONP.request({
            url: h + "/Learn/ScormData.ashx",
            params: {
                action: "ping"
            },
            callback: g,
            scope: this,
            timeout: s == null ? null : s.timeout,
            agxOptions: s
        });
        return true
    }

    function o(t) {
        var s = t || {};
        if (JSONP.isEmpty(s.success)) {
            s.success = false
        }
        if (!s.success && JSONP.isEmpty(s.message)) {
            s.message = "no response"
        }
        return s
    }

    function k(s, t) {
        jQuery.ajax({
            type: "POST",
            url: h + "/Learn/ScormData.ashx",
            cache: false,
            data: {
                action: "putscormdata",
                enrollmentid: q,
                itemid: l,
                data: t,
                last: 1
            },
            dataType: "text",
            timeout: (s == null || s.timeout == null) ? 15000 : s.timeout,
            success: function(u) {
                u = "POST: " + u;
                var v;
                if (u.search(/success:\s*true/i) > -1) {
                    console.log("DEJS POST AJAX success: " + u);
                    v = true
                } else {
                    console.log("DEJS POST AJAX returned, but with error: " + u);
                    v = false
                }
                if (s != null && s.callback != null) {
                    s.callback(s, v, u)
                }
            },
            error: function(u, w, v) {
                console.log("DEJS POST AJAX error: " + (typeof result === "undefined" ? "unknown" : result));
                console.log(u);
                console.log(w);
                console.log(v);
                s.callback(s, false, v)
            }
        })
    }
    var f = 0;
    var d = null;

    function p(s, v, w) {
        var z = {
            url: h + "/Learn/ScormData.ashx",
            action: "putscormdata",
            enrollmentid: q,
            itemid: l,
            data: "",
            add: "1",
            last: "1"
        };
        var t = 2083 - (JSONP.getUrlLength(h + "/Learn/ScormData.ashx", z) + 20);
        var u = false;
        if (v.length > t) {
            d = v.substr(t);
            v = v.substr(0, t);
            if (v.substr(v.length - 10).indexOf("%") != -1) {
                var y = v.lastIndexOf("%");
                d = v.substr(y) + d;
                v = v.substr(0, y)
            }
        } else {
            d = null;
            u = true
        }
        f++;
        var x = {
            action: "putscormdata",
            enrollmentid: q,
            itemid: l,
            data: v
        };
        if (w) {
            x.add = "1"
        }
        if (u) {
            x.last = "1"
        }
        JSONP.request({
            url: h + "/Learn/ScormData.ashx",
            params: x,
            callback: m,
            scope: this,
            timeout: s == null ? null : s.timeout,
            agxOptions: s,
            agxPutCount: f
        })
    }

    function m(t, u) {
        if (t.agxPutCount != f) {
            console.log("putDataCallback: cancelled/superceded request; agxPutCount = " + t.agxPutCount + " / putCount = " + f + " (this shouldn't be a problem.)");
            return
        }
        var s = o(u);
        if (s.success) {
            if (!JSONP.isEmpty(d)) {
                p.defer(1, this, [t.agxOptions, d, true]);
                return
            }
        } else {
            console.log("putDataCallback (JSONP) error:");
            console.log(s);
            d = null
        }
        if (!JSONP.isEmpty(t.agxOptions) && !JSONP.isEmpty(t.agxOptions.callback)) {
            t.agxOptions.callback.call(t.agxOptions.scope || window, t.agxOptions, s.success, "JSONP: " + s.message)
        }
    }

    function g(t, u) {
        var s = o(u);
        if (!JSONP.isEmpty(t.agxOptions) && !JSONP.isEmpty(t.agxOptions.callback)) {
            t.agxOptions.callback.call(t.agxOptions.scope || window, t.agxOptions, s.success)
        }
    }

    function c(v, y, z) {
        var t = o(y);
        var y = [];
        if (t.success) {
            if (!JSONP.isEmpty(t.scormData)) {
                for (var w = 0, s = t.scormData.length; w < s; w++) {
                    var u = t.scormData[w].name;
                    var x = t.scormData[w].value;
                    if (z) {
                        x = decodeURIComponent(x)
                    }
                    if (!JSONP.isEmpty(u)) {
                        y.push({
                            name: u,
                            value: x
                        })
                    }
                }
            }
            if (!JSONP.isEmpty(t.customFields)) {
                for (var w = 0, s = t.customFields.length; w < s; w++) {
                    var u = t.customFields[w][0];
                    var x = t.customFields[w][1];
                    if (!JSONP.isEmpty(u)) {
                        u = "bh.custom." + u;
                        y.push({
                            name: u,
                            value: x
                        })
                    }
                }
            }
            if (!JSONP.isEmpty(t.bhVars)) {
                for (var w = 0, s = t.bhVars.length; w < s; w++) {
                    var u = t.bhVars[w][0];
                    var x = t.bhVars[w][1];
                    if (!JSONP.isEmpty(u)) {
                        y.push({
                            name: u,
                            value: x
                        })
                    }
                }
            }
        }
        if (!JSONP.isEmpty(v.agxOptions) && !JSONP.isEmpty(v.agxOptions.callback)) {
            v.agxOptions.callback.call(v.agxOptions.scope || window, v.agxOptions, t.success, y)
        }
    }

    function b(t, u) {
        var s = o(u);
        if (s.success) {}
        if (!JSONP.isEmpty(t.agxOptions) && !JSONP.isEmpty(t.agxOptions.callback)) {
            t.agxOptions.callback.call(t.agxOptions.scope || window, t.agxOptions, s.success, s.data)
        }
    }
    return {
        initialize: function() {
            if (n()) {
                return true
            }
            var s = Url_Query ? Url_Query : JSONP.urlDecode(window.location.search.substr(1));
            if (s.enrollmentid) {
                q = s.enrollmentid
            }
            if (s.itemid) {
                l = s.itemid
            }
            if (s.approot) {
                h = s.approot
            }
            if (s.ext_enrollmentid) {
                q = s.ext_enrollmentid
            }
            if (s.ext_itemid) {
                l = s.ext_itemid
            }
            if (s.ext_approot) {
                h = s.ext_approot
            }
            if (q == null && s.Url != null) {
                var t = JSONP.urlDecode(s.Url.replace(/.*?\?/, ""));
                if (t.enrollmentid) {
                    q = t.enrollmentid
                }
                if (t.itemid) {
                    l = t.itemid
                }
                if (t.approot) {
                    h = t.approot
                }
            }
            if (!n()) {
                return false
            }
            return true
        },
        ping: function(s) {
            return i(s)
        },
        getData: function(s) {
            if (!n()) {
                return false
            }
            if (JSONP.sameHost() && parent.ArgaServices && !Url_Query.api_mode) {
                parent.ArgaServices.getStudentScoData(q, l, s == null ? null : s.timeout, Url_Query.dueDate).done(function(t) {
                    c({
                        agxOptions: s
                    }, t, true)
                })
            } else {
                JSONP.request({
                    url: h + "/Learn/ScormData.ashx",
                    params: {
                        action: "getscormdata",
                        enrollmentid: q,
                        itemid: l
                    },
                    callback: c,
                    scope: this,
                    timeout: s == null ? null : s.timeout,
                    agxOptions: s
                })
            }
            return true
        },
        putData: function(v) {
            if (!n()) {
                return false
            }
            var x = "<data>";
            var t = null;
            if (JSONP.isArray(v.data)) {
                for (var w = 0, s = v.data.length; w < s; w++) {
                    if (!JSONP.isEmpty(v.data[w]) && !JSONP.isEmpty(v.data[w].name) && !JSONP.isObject(v.data[w].name) && !JSONP.isArray(v.data[w].name) && (v.data[w].name.indexOf("bh.") != 0 || v.data[w].name.indexOf("bh.item_name") === 0)) {
                        if (!t && v.data[w].name == "cmi.graded_score") {
                            t = v.data[w]
                        }
                        var y = v.data[w].value;
                        if (y == null) {
                            y = ""
                        }
                        if (v.dataNeedReEncoding) {
                            x = x.concat('<entry name="' + encodeURIComponent(JSONP.htmlEncode(decodeURIComponent(v.data[w].name), true)) + '" value="' + encodeURIComponent(JSONP.htmlEncode(decodeURIComponent(y), true)) + '"/>')
                        } else {
                            x = x.concat('<entry name="' + JSONP.htmlEncode(v.data[w].name, false) + '" value="' + JSONP.htmlEncode(y, false) + '"/>')
                        }
                    }
                }
            }
            x = x.concat("</data>");
            if (JSONP.sameHost() && window.jQuery == null) {
                window.jQuery = parent.jQuery
            }
            if (JSONP.sameHost() && (window.jQuery != null && jQuery("body") != null)) {
                if (parent.ArgaServices) {
                    var u = ARGA_API.previousGrade !== ARGA_API.grade || (ARGA_CALL_COUNTER % 10 === 0);
                    Local_Start_Time = u ? Date && Date.now ? Date.now() : new Date().getTime() : Local_Start_Time;
                    parent.ArgaServices.putStudentScoData(q, l, x, u, v).done(function(z) {
                        if (z && !z.Success) {
                            alert(z.Message);
                            return false
                        }
                        if (z.GradedScore != "-1") {
                            if (!t) {
                                ARGA_Private_Fns.SetValue("cmi.graded_score", z.GradedScore)
                            } else {
                                t.value = z.GradedScore
                            }
                        }
                        if (v && typeof v.callback === "function") {
                            v.callback(v, true)
                        }
                    }).fail(function(A, B, z) {
                        alert("We were unable to save your activity data. This may be due to a poor internet connection. Try refreshing your browser window and attempting the activity again, or try again later.\n\nIf you encounter this message consistently and report the incident to technical support, please pass on the following information:\n\nError message: Connection lost\n\n Status: " + B);
                        return false
                    });
                    ARGA_CALL_COUNTER++
                } else {
                    k(v, x)
                }
            } else {
                p(v, x, false)
            }
            return true
        },
        getSectionData: function(s) {
            if (!n()) {
                return false
            }
            JSONP.request({
                url: h + "/Learn/ScormData.ashx",
                params: {
                    action: "getsectionsummary",
                    enrollmentid: q,
                    itemid: l,
                    allstatus: s == null ? false : (s.allstatus ? "1" : "0")
                },
                callback: b,
                scope: this,
                timeout: s == null ? null : s.timeout,
                agxOptions: s
            });
            return true
        }
    }
}();
var JSON;
if (!JSON) {
    JSON = {}
}(function() {
    function f(n) {
        return n < 10 ? "0" + n : n
    }
    if (typeof Date.prototype.toJSON !== "function") {
        Date.prototype.toJSON = function(key) {
            return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null
        };
        String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function(key) {
            return this.valueOf()
        }
    }
    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap, indent, meta = {
            "\b": "\\b",
            "\t": "\\t",
            "\n": "\\n",
            "\f": "\\f",
            "\r": "\\r",
            '"': '\\"',
            "\\": "\\\\"
        },
        rep;

    function quote(string) {
        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function(a) {
            var c = meta[a];
            return typeof c === "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
        }) + '"' : '"' + string + '"'
    }

    function str(key, holder) {
        var i, k, v, length, mind = gap,
            partial, value = holder[key];
        if (value && typeof value === "object" && typeof value.toJSON === "function") {
            value = value.toJSON(key)
        }
        if (typeof rep === "function") {
            value = rep.call(holder, key, value)
        }
        switch (typeof value) {
            case "string":
                return quote(value);
            case "number":
                return isFinite(value) ? String(value) : "null";
            case "boolean":
            case "null":
                return String(value);
            case "object":
                if (!value) {
                    return "null"
                }
                gap += indent;
                partial = [];
                if (Object.prototype.toString.apply(value) === "[object Array]") {
                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || "null"
                    }
                    v = partial.length === 0 ? "[]" : gap ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]" : "[" + partial.join(",") + "]";
                    gap = mind;
                    return v
                }
                if (rep && typeof rep === "object") {
                    length = rep.length;
                    for (i = 0; i < length; i += 1) {
                        if (typeof rep[i] === "string") {
                            k = rep[i];
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ": " : ":") + v)
                            }
                        }
                    }
                } else {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ": " : ":") + v)
                            }
                        }
                    }
                }
                v = partial.length === 0 ? "{}" : gap ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}" : "{" + partial.join(",") + "}";
                gap = mind;
                return v
        }
    }
    if (typeof JSON.stringify !== "function") {
        JSON.stringify = function(value, replacer, space) {
            var i;
            gap = "";
            indent = "";
            if (typeof space === "number") {
                for (i = 0; i < space; i += 1) {
                    indent += " "
                }
            } else {
                if (typeof space === "string") {
                    indent = space
                }
            }
            rep = replacer;
            if (replacer && typeof replacer !== "function" && (typeof replacer !== "object" || typeof replacer.length !== "number")) {
                throw new Error("JSON.stringify")
            }
            return str("", {
                "": value
            })
        }
    }
    if (typeof JSON.parse !== "function") {
        JSON.parse = function(text, reviver) {
            var j;

            function walk(holder, key) {
                var k, v, value = holder[key];
                if (value && typeof value === "object") {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v
                            } else {
                                delete value[k]
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value)
            }
            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function(a) {
                    return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
                })
            }
            if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
                j = eval("(" + text + ")");
                return typeof reviver === "function" ? walk({
                    "": j
                }, "") : j
            }
            throw new SyntaxError("JSON.parse")
        }
    }
}());
if (window.easyXDM == null && !JSONP.sameHost()) {
    (function(ag, aR, aF, aj, aK, am) {
        var aT = this;
        var aH = Math.floor(Math.random() * 10000);
        var aE = Function.prototype;
        var ad = /^((http.?:)\/\/([^:\/\s]+)(:\d+)*)/;
        var ac = /[\-\w]+\/\.\.\//;
        var ao = /([^:])\/\//g;
        var al = "";
        var aG = {};
        var ah = ag.easyXDM;
        var Z = "easyXDM_";
        var ap;
        var aw = false;
        var aM;
        var aN;

        function ar(c, a) {
            var b = typeof c[a];
            return b == "function" || (!!(b == "object" && c[a])) || b == "unknown"
        }

        function aA(b, a) {
            return !!(typeof(b[a]) == "object" && b[a])
        }

        function aD(a) {
            return Object.prototype.toString.call(a) === "[object Array]"
        }

        function aS() {
            var f = "Shockwave Flash",
                a = "application/x-shockwave-flash";
            if (!aB(navigator.plugins) && typeof navigator.plugins[f] == "object") {
                var c = navigator.plugins[f].description;
                if (c && !aB(navigator.mimeTypes) && navigator.mimeTypes[a] && navigator.mimeTypes[a].enabledPlugin) {
                    aM = c.match(/\d+/g)
                }
            }
            if (!aM) {
                var g;
                try {
                    g = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
                    aM = Array.prototype.slice.call(g.GetVariable("$version").match(/(\d+),(\d+),(\d+),(\d+)/), 1);
                    g = null
                } catch (b) {}
            }
            if (!aM) {
                return false
            }
            var h = parseInt(aM[0], 10),
                d = parseInt(aM[1], 10);
            aN = h > 9 && d > 0;
            return true
        }
        var az, ax;
        if (ar(ag, "addEventListener")) {
            az = function(a, c, b) {
                a.addEventListener(c, b, false)
            };
            ax = function(a, c, b) {
                a.removeEventListener(c, b, false)
            }
        } else {
            if (ar(ag, "attachEvent")) {
                az = function(c, a, b) {
                    c.attachEvent("on" + a, b)
                };
                ax = function(c, a, b) {
                    c.detachEvent("on" + a, b)
                }
            } else {
                throw new Error("Browser not supported")
            }
        }
        var X = false,
            ak = [],
            ai;
        if ("readyState" in aR) {
            ai = aR.readyState;
            X = ai == "complete" || (~navigator.userAgent.indexOf("AppleWebKit/") && (ai == "loaded" || ai == "interactive"))
        } else {
            X = !!aR.body
        }

        function aC() {
            if (X) {
                return
            }
            X = true;
            for (var a = 0; a < ak.length; a++) {
                ak[a]()
            }
            ak.length = 0
        }
        if (!X) {
            if (ar(ag, "addEventListener")) {
                az(aR, "DOMContentLoaded", aC)
            } else {
                az(aR, "readystatechange", function() {
                    if (aR.readyState == "complete") {
                        aC()
                    }
                });
                if (aR.documentElement.doScroll && ag === top) {
                    var aO = function() {
                        if (X) {
                            return
                        }
                        try {
                            aR.documentElement.doScroll("left")
                        } catch (a) {
                            aj(aO, 1);
                            return
                        }
                        aC()
                    };
                    aO()
                }
            }
            az(ag, "load", aC)
        }

        function an(a, b) {
            if (X) {
                a.call(b);
                return
            }
            ak.push(function() {
                a.call(b)
            })
        }

        function aI() {
            var a = parent;
            if (al !== "") {
                for (var c = 0, b = al.split("."); c < b.length; c++) {
                    a = a[b[c]]
                }
            }
            return a.easyXDM
        }

        function aQ(a) {
            ag.easyXDM = ah;
            al = a;
            if (al) {
                Z = "easyXDM_" + al.replace(".", "_") + "_"
            }
            return aG
        }

        function av(a) {
            return a.match(ad)[3]
        }

        function aP(a) {
            return a.match(ad)[4] || ""
        }

        function aL(c) {
            var f = c.toLowerCase().match(ad);
            var b = f[2],
                a = f[3],
                d = f[4] || "";
            if ((b == "http:" && d == ":80") || (b == "https:" && d == ":443")) {
                d = ""
            }
            return b + "//" + a + d
        }

        function at(b) {
            b = b.replace(ao, "$1/");
            if (!b.match(/^(http||https):\/\//)) {
                var a = (b.substring(0, 1) === "/") ? "" : aF.pathname;
                if (a.substring(a.length - 1) !== "/") {
                    a = a.substring(0, a.lastIndexOf("/") + 1)
                }
                b = aF.protocol + "//" + aF.host + a + b
            }
            while (ac.test(b)) {
                b = b.replace(ac, "")
            }
            return b
        }

        function ae(g, d) {
            var a = "",
                c = g.indexOf("#");
            if (c !== -1) {
                a = g.substring(c);
                g = g.substring(0, c)
            }
            var b = [];
            for (var f in d) {
                if (d.hasOwnProperty(f)) {
                    b.push(f + "=" + am(d[f]))
                }
            }
            return g + (aw ? "#" : (g.indexOf("?") == -1 ? "?" : "&")) + b.join("&") + a
        }
        var ab = (function(d) {
            d = d.substring(1).split("&");
            var b = {},
                a, c = d.length;
            while (c--) {
                a = d[c].split("=");
                b[a[0]] = aK(a[1])
            }
            return b
        }(/xdm_e=/.test(aF.search) ? aF.search : aF.hash));

        function aB(a) {
            return typeof a === "undefined"
        }
        var af = function() {
            var b = {};
            var a = {
                    a: [1, 2, 3]
                },
                c = '{"a":[1,2,3]}';
            if (typeof JSON != "undefined" && typeof JSON.stringify === "function" && JSON.stringify(a).replace((/\s/g), "") === c) {
                return JSON
            }
            if (Object.toJSON) {
                if (Object.toJSON(a).replace((/\s/g), "") === c) {
                    b.stringify = Object.toJSON
                }
            }
            if (typeof String.prototype.evalJSON === "function") {
                a = c.evalJSON();
                if (a.a && a.a.length === 3 && a.a[2] === 3) {
                    b.parse = function(d) {
                        return d.evalJSON()
                    }
                }
            }
            if (b.stringify && b.parse) {
                af = function() {
                    return b
                };
                return b
            }
            return null
        };

        function aa(f, d, c) {
            var a;
            for (var b in d) {
                if (d.hasOwnProperty(b)) {
                    if (b in f) {
                        a = d[b];
                        if (typeof a === "object") {
                            aa(f[b], a, c)
                        } else {
                            if (!c) {
                                f[b] = d[b]
                            }
                        }
                    } else {
                        f[b] = d[b]
                    }
                }
            }
            return f
        }

        function aU() {
            var a = aR.body.appendChild(aR.createElement("form")),
                b = a.appendChild(aR.createElement("input"));
            b.name = Z + "TEST" + aH;
            ap = b !== a.elements[b.name];
            aR.body.removeChild(a)
        }

        function au(f) {
            if (aB(ap)) {
                aU()
            }
            var a;
            if (ap) {
                a = aR.createElement('<iframe name="' + f.props.name + '"/>')
            } else {
                a = aR.createElement("IFRAME");
                a.name = f.props.name
            }
            a.id = a.name = f.props.name;
            delete f.props.name;
            if (typeof f.container == "string") {
                f.container = aR.getElementById(f.container)
            }
            if (!f.container) {
                aa(a.style, {
                    position: "absolute",
                    top: "-2000px",
                    left: "0px"
                });
                f.container = aR.body
            }
            var b = f.props.src;
            f.props.src = "javascript:false";
            aa(a, f.props);
            a.border = a.frameBorder = 0;
            a.allowTransparency = true;
            f.container.appendChild(a);
            if (f.onLoad) {
                az(a, "load", f.onLoad)
            }
            if (f.usePost) {
                var d = f.container.appendChild(aR.createElement("form")),
                    g;
                d.target = a.name;
                d.action = b;
                d.method = "POST";
                if (typeof(f.usePost) === "object") {
                    for (var c in f.usePost) {
                        if (f.usePost.hasOwnProperty(c)) {
                            if (ap) {
                                g = aR.createElement('<input name="' + c + '"/>')
                            } else {
                                g = aR.createElement("INPUT");
                                g.name = c
                            }
                            g.value = f.usePost[c];
                            d.appendChild(g)
                        }
                    }
                }
                d.submit();
                d.parentNode.removeChild(d)
            } else {
                a.src = b
            }
            f.props.src = b;
            return a
        }

        function Y(b, a) {
            if (typeof b == "string") {
                b = [b]
            }
            var c, d = b.length;
            while (d--) {
                c = b[d];
                c = new RegExp(c.substr(0, 1) == "^" ? c : ("^" + c.replace(/(\*)/g, ".$1").replace(/\?/g, ".") + "$"));
                if (c.test(a)) {
                    return true
                }
            }
            return false
        }

        function aJ(g) {
            var a = g.protocol,
                h;
            g.isHost = g.isHost || aB(ab.xdm_p);
            aw = g.hash || false;
            if (!g.props) {
                g.props = {}
            }
            if (!g.isHost) {
                g.channel = ab.xdm_c.replace(/["'<>\\]/g, "");
                g.secret = ab.xdm_s;
                g.remote = ab.xdm_e.replace(/["'<>\\]/g, "");
                a = ab.xdm_p;
                if (g.acl && !Y(g.acl, g.remote)) {
                    throw new Error("Access denied for " + g.remote)
                }
            } else {
                g.remote = at(g.remote);
                g.channel = g.channel || "default" + aH++;
                g.secret = Math.random().toString(16).substring(2);
                if (aB(a)) {
                    if (aL(aF.href) == aL(g.remote)) {
                        a = "4"
                    } else {
                        if (ar(ag, "postMessage") || ar(aR, "postMessage")) {
                            a = "1"
                        } else {
                            if (g.swf && ar(ag, "ActiveXObject") && aS()) {
                                a = "6"
                            } else {
                                if (navigator.product === "Gecko" && "frameElement" in ag && navigator.userAgent.indexOf("WebKit") == -1) {
                                    a = "5"
                                } else {
                                    if (g.remoteHelper) {
                                        a = "2"
                                    } else {
                                        a = "0"
                                    }
                                }
                            }
                        }
                    }
                }
            }
            g.protocol = a;
            switch (a) {
                case "0":
                    aa(g, {
                        interval: 100,
                        delay: 2000,
                        useResize: true,
                        useParent: false,
                        usePolling: false
                    }, true);
                    if (g.isHost) {
                        if (!g.local) {
                            var c = aF.protocol + "//" + aF.host,
                                i = aR.body.getElementsByTagName("img"),
                                b;
                            var f = i.length;
                            while (f--) {
                                b = i[f];
                                if (b.src.substring(0, c.length) === c) {
                                    g.local = b.src;
                                    break
                                }
                            }
                            if (!g.local) {
                                g.local = ag
                            }
                        }
                        var d = {
                            xdm_c: g.channel,
                            xdm_p: 0
                        };
                        if (g.local === ag) {
                            g.usePolling = true;
                            g.useParent = true;
                            g.local = aF.protocol + "//" + aF.host + aF.pathname + aF.search;
                            d.xdm_e = g.local;
                            d.xdm_pa = 1
                        } else {
                            d.xdm_e = at(g.local)
                        }
                        if (g.container) {
                            g.useResize = false;
                            d.xdm_po = 1
                        }
                        g.remote = ae(g.remote, d)
                    } else {
                        aa(g, {
                            channel: ab.xdm_c,
                            remote: ab.xdm_e,
                            useParent: !aB(ab.xdm_pa),
                            usePolling: !aB(ab.xdm_po),
                            useResize: g.useParent ? false : g.useResize
                        })
                    }
                    h = [new aG.stack.HashTransport(g), new aG.stack.ReliableBehavior({}), new aG.stack.QueueBehavior({
                        encode: true,
                        maxLength: 4000 - g.remote.length
                    }), new aG.stack.VerifyBehavior({
                        initiate: g.isHost
                    })];
                    break;
                case "1":
                    h = [new aG.stack.PostMessageTransport(g)];
                    break;
                case "2":
                    g.remoteHelper = at(g.remoteHelper);
                    h = [new aG.stack.NameTransport(g), new aG.stack.QueueBehavior(), new aG.stack.VerifyBehavior({
                        initiate: g.isHost
                    })];
                    break;
                case "3":
                    h = [new aG.stack.NixTransport(g)];
                    break;
                case "4":
                    h = [new aG.stack.SameOriginTransport(g)];
                    break;
                case "5":
                    h = [new aG.stack.FrameElementTransport(g)];
                    break;
                case "6":
                    if (!aM) {
                        aS()
                    }
                    h = [new aG.stack.FlashTransport(g)];
                    break
            }
            h.push(new aG.stack.QueueBehavior({
                lazy: g.lazy,
                remove: true
            }));
            return h
        }

        function aq(c) {
            var a, b = {
                incoming: function(g, h) {
                    this.up.incoming(g, h)
                },
                outgoing: function(h, g) {
                    this.down.outgoing(h, g)
                },
                callback: function(g) {
                    this.up.callback(g)
                },
                init: function() {
                    this.down.init()
                },
                destroy: function() {
                    this.down.destroy()
                }
            };
            for (var d = 0, f = c.length; d < f; d++) {
                a = c[d];
                aa(a, b, true);
                if (d !== 0) {
                    a.down = c[d - 1]
                }
                if (d !== f - 1) {
                    a.up = c[d + 1]
                }
            }
            return a
        }

        function ay(a) {
            a.up.down = a.down;
            a.down.up = a.up;
            a.up = a.down = null
        }
        aa(aG, {
            version: "2.4.16.3",
            query: ab,
            stack: {},
            apply: aa,
            getJSONObject: af,
            whenReady: an,
            noConflict: aQ
        });
        aG.DomHelper = {
            on: az,
            un: ax,
            requiresJSON: function(a) {
                if (!aA(ag, "JSON")) {
                    aR.write('<script type="text/javascript" src="' + a + '"><\/script>')
                }
            }
        };
        (function() {
            var a = {};
            aG.Fn = {
                set: function(c, b) {
                    a[c] = b
                },
                get: function(c, d) {
                    var b = a[c];
                    if (d) {
                        delete a[c]
                    }
                    return b
                }
            }
        }());
        aG.Socket = function(b) {
            var c = aq(aJ(b).concat([{
                    incoming: function(d, f) {
                        b.onMessage(d, f)
                    },
                    callback: function(d) {
                        if (b.onReady) {
                            b.onReady(d)
                        }
                    }
                }])),
                a = aL(b.remote);
            this.origin = aL(b.remote);
            this.destroy = function() {
                c.destroy()
            };
            this.postMessage = function(d) {
                c.outgoing(d, a)
            };
            c.init()
        };
        aG.Rpc = function(c, d) {
            if (d.local) {
                for (var a in d.local) {
                    if (d.local.hasOwnProperty(a)) {
                        var b = d.local[a];
                        if (typeof b === "function") {
                            d.local[a] = {
                                method: b
                            }
                        }
                    }
                }
            }
            var f = aq(aJ(c).concat([new aG.stack.RpcBehavior(this, d), {
                callback: function(g) {
                    if (c.onReady) {
                        c.onReady(g)
                    }
                }
            }]));
            this.origin = aL(c.remote);
            this.destroy = function() {
                f.destroy()
            };
            f.init()
        };
        aG.stack.SameOriginTransport = function(d) {
            var c, a, b, f;
            return (c = {
                outgoing: function(h, g, i) {
                    b(h);
                    if (i) {
                        i()
                    }
                },
                destroy: function() {
                    if (a) {
                        a.parentNode.removeChild(a);
                        a = null
                    }
                },
                onDOMReady: function() {
                    f = aL(d.remote);
                    if (d.isHost) {
                        aa(d.props, {
                            src: ae(d.remote, {
                                xdm_e: aF.protocol + "//" + aF.host + aF.pathname,
                                xdm_c: d.channel,
                                xdm_p: 4
                            }),
                            name: Z + d.channel + "_provider"
                        });
                        a = au(d);
                        aG.Fn.set(d.channel, function(g) {
                            b = g;
                            aj(function() {
                                c.up.callback(true)
                            }, 0);
                            return function(h) {
                                c.up.incoming(h, f)
                            }
                        })
                    } else {
                        b = aI().Fn.get(d.channel, true)(function(g) {
                            c.up.incoming(g, f)
                        });
                        aj(function() {
                            c.up.callback(true)
                        }, 0)
                    }
                },
                init: function() {
                    an(c.onDOMReady, c)
                }
            })
        };
        aG.stack.FlashTransport = function(a) {
            var i, d, j, h, c, g;

            function f(k, l) {
                aj(function() {
                    i.up.incoming(k, h)
                }, 0)
            }

            function b(l) {
                var m = a.swf + "?host=" + a.isHost;
                var n = "easyXDM_swf_" + Math.floor(Math.random() * 10000);
                aG.Fn.set("flash_loaded" + l.replace(/[\-.]/g, "_"), function() {
                    aG.stack.FlashTransport[l].swf = c = g.firstChild;
                    var p = aG.stack.FlashTransport[l].queue;
                    for (var o = 0; o < p.length; o++) {
                        p[o]()
                    }
                    p.length = 0
                });
                if (a.swfContainer) {
                    g = (typeof a.swfContainer == "string") ? aR.getElementById(a.swfContainer) : a.swfContainer
                } else {
                    g = aR.createElement("div");
                    aa(g.style, aN && a.swfNoThrottle ? {
                        height: "20px",
                        width: "20px",
                        position: "fixed",
                        right: 0,
                        top: 0
                    } : {
                        height: "1px",
                        width: "1px",
                        position: "absolute",
                        overflow: "hidden",
                        right: 0,
                        top: 0
                    });
                    aR.body.appendChild(g)
                }
                var k = "callback=flash_loaded" + l.replace(/[\-.]/g, "_") + "&proto=" + aT.location.protocol + "&domain=" + av(aT.location.href) + "&port=" + aP(aT.location.href) + "&ns=" + al;
                g.innerHTML = "<object height='20' width='20' type='application/x-shockwave-flash' id='" + n + "' data='" + m + "'><param name='allowScriptAccess' value='always'></param><param name='wmode' value='transparent'><param name='movie' value='" + m + "'></param><param name='flashvars' value='" + k + "'></param><embed type='application/x-shockwave-flash' FlashVars='" + k + "' allowScriptAccess='always' wmode='transparent' src='" + m + "' height='1' width='1'></embed></object>"
            }
            return (i = {
                outgoing: function(l, k, m) {
                    c.postMessage(a.channel, l.toString());
                    if (m) {
                        m()
                    }
                },
                destroy: function() {
                    try {
                        c.destroyChannel(a.channel)
                    } catch (k) {}
                    c = null;
                    if (d) {
                        d.parentNode.removeChild(d);
                        d = null
                    }
                },
                onDOMReady: function() {
                    h = a.remote;
                    aG.Fn.set("flash_" + a.channel + "_init", function() {
                        aj(function() {
                            i.up.callback(true)
                        })
                    });
                    aG.Fn.set("flash_" + a.channel + "_onMessage", f);
                    a.swf = at(a.swf);
                    var k = av(a.swf);
                    var l = function() {
                        aG.stack.FlashTransport[k].init = true;
                        c = aG.stack.FlashTransport[k].swf;
                        c.createChannel(a.channel, a.secret, aL(a.remote), a.isHost);
                        if (a.isHost) {
                            if (aN && a.swfNoThrottle) {
                                aa(a.props, {
                                    position: "fixed",
                                    right: 0,
                                    top: 0,
                                    height: "20px",
                                    width: "20px"
                                })
                            }
                            aa(a.props, {
                                src: ae(a.remote, {
                                    xdm_e: aL(aF.href),
                                    xdm_c: a.channel,
                                    xdm_p: 6,
                                    xdm_s: a.secret
                                }),
                                name: Z + a.channel + "_provider"
                            });
                            d = au(a)
                        }
                    };
                    if (aG.stack.FlashTransport[k] && aG.stack.FlashTransport[k].init) {
                        l()
                    } else {
                        if (!aG.stack.FlashTransport[k]) {
                            aG.stack.FlashTransport[k] = {
                                queue: [l]
                            };
                            b(k)
                        } else {
                            aG.stack.FlashTransport[k].queue.push(l)
                        }
                    }
                },
                init: function() {
                    an(i.onDOMReady, i)
                }
            })
        };
        aG.stack.PostMessageTransport = function(f) {
            var b, a, g, d;

            function h(i) {
                if (i.origin) {
                    return aL(i.origin)
                }
                if (i.uri) {
                    return aL(i.uri)
                }
                if (i.domain) {
                    return aF.protocol + "//" + i.domain
                }
                throw "Unable to retrieve the origin of the event"
            }

            function c(i) {
                var j = h(i);
                if (j == d && i.data.substring(0, f.channel.length + 1) == f.channel + " ") {
                    b.up.incoming(i.data.substring(f.channel.length + 1), j)
                }
            }
            return (b = {
                outgoing: function(j, i, k) {
                    g.postMessage(f.channel + " " + j, i || d);
                    if (k) {
                        k()
                    }
                },
                destroy: function() {
                    ax(ag, "message", c);
                    if (a) {
                        g = null;
                        a.parentNode.removeChild(a);
                        a = null
                    }
                },
                onDOMReady: function() {
                    d = aL(f.remote);
                    if (f.isHost) {
                        var i = function(j) {
                            if (j.data == f.channel + "-ready") {
                                g = ("postMessage" in a.contentWindow) ? a.contentWindow : a.contentWindow.document;
                                ax(ag, "message", i);
                                az(ag, "message", c);
                                aj(function() {
                                    b.up.callback(true)
                                }, 0)
                            }
                        };
                        az(ag, "message", i);
                        aa(f.props, {
                            src: ae(f.remote, {
                                xdm_e: aL(aF.href),
                                xdm_c: f.channel,
                                xdm_p: 1
                            }),
                            name: Z + f.channel + "_provider"
                        });
                        a = au(f)
                    } else {
                        az(ag, "message", c);
                        g = ("postMessage" in ag.parent) ? ag.parent : ag.parent.document;
                        g.postMessage(f.channel + "-ready", d);
                        aj(function() {
                            b.up.callback(true)
                        }, 0)
                    }
                },
                init: function() {
                    an(b.onDOMReady, b)
                }
            })
        };
        aG.stack.FrameElementTransport = function(d) {
            var c, a, b, f;
            return (c = {
                outgoing: function(h, g, i) {
                    b.call(this, h);
                    if (i) {
                        i()
                    }
                },
                destroy: function() {
                    if (a) {
                        a.parentNode.removeChild(a);
                        a = null
                    }
                },
                onDOMReady: function() {
                    f = aL(d.remote);
                    if (d.isHost) {
                        aa(d.props, {
                            src: ae(d.remote, {
                                xdm_e: aL(aF.href),
                                xdm_c: d.channel,
                                xdm_p: 5
                            }),
                            name: Z + d.channel + "_provider"
                        });
                        a = au(d);
                        a.fn = function(g) {
                            delete a.fn;
                            b = g;
                            aj(function() {
                                c.up.callback(true)
                            }, 0);
                            return function(h) {
                                c.up.incoming(h, f)
                            }
                        }
                    } else {
                        if (aR.referrer && aL(aR.referrer) != ab.xdm_e) {
                            ag.top.location = ab.xdm_e
                        }
                        b = ag.frameElement.fn(function(g) {
                            c.up.incoming(g, f)
                        });
                        c.up.callback(true)
                    }
                },
                init: function() {
                    an(c.onDOMReady, c)
                }
            })
        };
        aG.stack.NameTransport = function(n) {
            var m;
            var k, g, a, i, h, c, d;

            function j(o) {
                var p = n.remoteHelper + (k ? "#_3" : "#_2") + n.channel;
                g.contentWindow.sendMessage(o, p)
            }

            function l() {
                if (k) {
                    if (++i === 2 || !k) {
                        m.up.callback(true)
                    }
                } else {
                    j("ready");
                    m.up.callback(true)
                }
            }

            function f(o) {
                m.up.incoming(o, c)
            }

            function b() {
                if (h) {
                    aj(function() {
                        h(true)
                    }, 0)
                }
            }
            return (m = {
                outgoing: function(p, o, q) {
                    h = q;
                    j(p)
                },
                destroy: function() {
                    g.parentNode.removeChild(g);
                    g = null;
                    if (k) {
                        a.parentNode.removeChild(a);
                        a = null
                    }
                },
                onDOMReady: function() {
                    k = n.isHost;
                    i = 0;
                    c = aL(n.remote);
                    n.local = at(n.local);
                    if (k) {
                        aG.Fn.set(n.channel, function(p) {
                            if (k && p === "ready") {
                                aG.Fn.set(n.channel, f);
                                l()
                            }
                        });
                        d = ae(n.remote, {
                            xdm_e: n.local,
                            xdm_c: n.channel,
                            xdm_p: 2
                        });
                        aa(n.props, {
                            src: d + "#" + n.channel,
                            name: Z + n.channel + "_provider"
                        });
                        a = au(n)
                    } else {
                        n.remoteHelper = n.remote;
                        aG.Fn.set(n.channel, f)
                    }
                    var o = function() {
                        var q = g || this;
                        ax(q, "load", o);
                        aG.Fn.set(n.channel + "_load", b);
                        (function p() {
                            if (typeof q.contentWindow.sendMessage == "function") {
                                l()
                            } else {
                                aj(p, 50)
                            }
                        }())
                    };
                    g = au({
                        props: {
                            src: n.local + "#_4" + n.channel
                        },
                        onLoad: o
                    })
                },
                init: function() {
                    an(m.onDOMReady, m)
                }
            })
        };
        aG.stack.HashTransport = function(b) {
            var p;
            var k = this,
                m, a, d, o, f, q, g;
            var l, c;

            function h(r) {
                if (!g) {
                    return
                }
                var s = b.remote + "#" + (f++) + "_" + r;
                ((m || !l) ? g.contentWindow : g).location = s
            }

            function n(r) {
                o = r;
                p.up.incoming(o.substring(o.indexOf("_") + 1), c)
            }

            function i() {
                if (!q) {
                    return
                }
                var t = q.location.href,
                    r = "",
                    s = t.indexOf("#");
                if (s != -1) {
                    r = t.substring(s)
                }
                if (r && r != o) {
                    n(r)
                }
            }

            function j() {
                a = setInterval(i, d)
            }
            return (p = {
                outgoing: function(s, r) {
                    h(s)
                },
                destroy: function() {
                    ag.clearInterval(a);
                    if (m || !l) {
                        g.parentNode.removeChild(g)
                    }
                    g = null
                },
                onDOMReady: function() {
                    m = b.isHost;
                    d = b.interval;
                    o = "#" + b.channel;
                    f = 0;
                    l = b.useParent;
                    c = aL(b.remote);
                    if (m) {
                        aa(b.props, {
                            src: b.remote,
                            name: Z + b.channel + "_provider"
                        });
                        if (l) {
                            b.onLoad = function() {
                                q = ag;
                                j();
                                p.up.callback(true)
                            }
                        } else {
                            var r = 0,
                                t = b.delay / 50;
                            (function s() {
                                if (++r > t) {
                                    throw new Error("Unable to reference listenerwindow")
                                }
                                try {
                                    q = g.contentWindow.frames[Z + b.channel + "_consumer"]
                                } catch (u) {}
                                if (q) {
                                    j();
                                    p.up.callback(true)
                                } else {
                                    aj(s, 50)
                                }
                            }())
                        }
                        g = au(b)
                    } else {
                        q = ag;
                        j();
                        if (l) {
                            g = parent;
                            p.up.callback(true)
                        } else {
                            aa(b, {
                                props: {
                                    src: b.remote + "#" + b.channel + new Date(),
                                    name: Z + b.channel + "_consumer"
                                },
                                onLoad: function() {
                                    p.up.callback(true)
                                }
                            });
                            g = au(b)
                        }
                    }
                },
                init: function() {
                    an(p.onDOMReady, p)
                }
            })
        };
        aG.stack.ReliableBehavior = function(f) {
            var d, a;
            var b = 0,
                g = 0,
                c = "";
            return (d = {
                incoming: function(i, k) {
                    var j = i.indexOf("_"),
                        h = i.substring(0, j).split(",");
                    i = i.substring(j + 1);
                    if (h[0] == b) {
                        c = "";
                        if (a) {
                            a(true);
                            a = null
                        }
                    }
                    if (i.length > 0) {
                        d.down.outgoing(h[1] + "," + b + "_" + c, k);
                        if (g != h[1]) {
                            g = h[1];
                            d.up.incoming(i, k)
                        }
                    }
                },
                outgoing: function(h, j, i) {
                    c = h;
                    a = i;
                    d.down.outgoing(g + "," + (++b) + "_" + h, j)
                }
            })
        };
        aG.stack.QueueBehavior = function(b) {
            var j, i = [],
                f = true,
                a = "",
                g, d = 0,
                c = false,
                k = false;

            function h() {
                if (b.remove && i.length === 0) {
                    ay(j);
                    return
                }
                if (f || i.length === 0 || g) {
                    return
                }
                f = true;
                var l = i.shift();
                j.down.outgoing(l.data, l.origin, function(m) {
                    f = false;
                    if (l.callback) {
                        aj(function() {
                            l.callback(m)
                        }, 0)
                    }
                    h()
                })
            }
            return (j = {
                init: function() {
                    if (aB(b)) {
                        b = {}
                    }
                    if (b.maxLength) {
                        d = b.maxLength;
                        k = true
                    }
                    if (b.lazy) {
                        c = true
                    } else {
                        j.down.init()
                    }
                },
                callback: function(l) {
                    f = false;
                    var m = j.up;
                    h();
                    m.callback(l)
                },
                incoming: function(n, l) {
                    if (k) {
                        var o = n.indexOf("_"),
                            m = parseInt(n.substring(0, o), 10);
                        a += n.substring(o + 1);
                        if (m === 0) {
                            if (b.encode) {
                                a = aK(a)
                            }
                            j.up.incoming(a, l);
                            a = ""
                        }
                    } else {
                        j.up.incoming(n, l)
                    }
                },
                outgoing: function(n, l, o) {
                    if (b.encode) {
                        n = am(n)
                    }
                    var m = [],
                        p;
                    if (k) {
                        while (n.length !== 0) {
                            p = n.substring(0, d);
                            n = n.substring(p.length);
                            m.push(p)
                        }
                        while ((p = m.shift())) {
                            i.push({
                                data: m.length + "_" + p,
                                origin: l,
                                callback: m.length === 0 ? o : null
                            })
                        }
                    } else {
                        i.push({
                            data: n,
                            origin: l,
                            callback: o
                        })
                    }
                    if (c) {
                        j.down.init()
                    } else {
                        h()
                    }
                },
                destroy: function() {
                    g = true;
                    j.down.destroy()
                }
            })
        };
        aG.stack.VerifyBehavior = function(b) {
            var a, d, f, c = false;

            function g() {
                d = Math.random().toString(16).substring(2);
                a.down.outgoing(d)
            }
            return (a = {
                incoming: function(h, j) {
                    var i = h.indexOf("_");
                    if (i === -1) {
                        if (h === d) {
                            a.up.callback(true)
                        } else {
                            if (!f) {
                                f = h;
                                if (!b.initiate) {
                                    g()
                                }
                                a.down.outgoing(h)
                            }
                        }
                    } else {
                        if (h.substring(0, i) === f) {
                            a.up.incoming(h.substring(i + 1), j)
                        }
                    }
                },
                outgoing: function(h, j, i) {
                    a.down.outgoing(d + "_" + h, j, i)
                },
                callback: function(h) {
                    if (b.initiate) {
                        g()
                    }
                }
            })
        };
        aG.stack.RpcBehavior = function(h, c) {
            var a, f = c.serializer || af();
            var g = 0,
                i = {};

            function d(k) {
                k.jsonrpc = "2.0";
                a.down.outgoing(f.stringify(k))
            }

            function j(m, k) {
                var l = Array.prototype.slice;
                return function() {
                    var p = arguments.length,
                        n, o = {
                            method: k
                        };
                    if (p > 0 && typeof arguments[p - 1] === "function") {
                        if (p > 1 && typeof arguments[p - 2] === "function") {
                            n = {
                                success: arguments[p - 2],
                                error: arguments[p - 1]
                            };
                            o.params = l.call(arguments, 0, p - 2)
                        } else {
                            n = {
                                success: arguments[p - 1]
                            };
                            o.params = l.call(arguments, 0, p - 1)
                        }
                        i["" + (++g)] = n;
                        o.id = g
                    } else {
                        o.params = l.call(arguments, 0)
                    }
                    if (m.namedParams && o.params.length === 1) {
                        o.params = o.params[0]
                    }
                    d(o)
                }
            }

            function b(n, o, k, p) {
                if (!k) {
                    if (o) {
                        d({
                            id: o,
                            error: {
                                code: -32601,
                                message: "Procedure not found."
                            }
                        })
                    }
                    return
                }
                var q, l;
                if (o) {
                    q = function(s) {
                        q = aE;
                        d({
                            id: o,
                            result: s
                        })
                    };
                    l = function(u, t) {
                        l = aE;
                        var s = {
                            id: o,
                            error: {
                                code: -32099,
                                message: u
                            }
                        };
                        if (t) {
                            s.error.data = t
                        }
                        d(s)
                    }
                } else {
                    q = l = aE
                }
                if (!aD(p)) {
                    p = [p]
                }
                try {
                    var m = k.method.apply(k.scope, p.concat([q, l]));
                    if (!aB(m)) {
                        q(m)
                    }
                } catch (r) {
                    l(r.message)
                }
            }
            return (a = {
                incoming: function(l, m) {
                    var k = f.parse(l);
                    if (k.method) {
                        if (c.handle) {
                            c.handle(k, d)
                        } else {
                            b(k.method, k.id, c.local[k.method], k.params)
                        }
                    } else {
                        var n = i[k.id];
                        if (k.error) {
                            if (n.error) {
                                n.error(k.error)
                            }
                        } else {
                            if (n.success) {
                                n.success(k.result)
                            }
                        }
                        delete i[k.id]
                    }
                },
                init: function() {
                    if (c.remote) {
                        for (var k in c.remote) {
                            if (c.remote.hasOwnProperty(k)) {
                                h[k] = j(c.remote[k], k)
                            }
                        }
                    }
                    a.down.init()
                },
                destroy: function() {
                    for (var k in c.remote) {
                        if (c.remote.hasOwnProperty(k) && h.hasOwnProperty(k)) {
                            delete h[k]
                        }
                    }
                    a.down.destroy()
                }
            })
        };
        aT.easyXDM = aG
    })(window, document, location, window.setTimeout, decodeURIComponent, encodeURIComponent)
}
Url_Query = JSONP.urlDecode(window.location.search.substr(1));
if (JSONP.sameHost() && parent.ArgaApi) {
    window.arga_rpc = {
        argacomplete: function() {
            parent.ArgaApi.argacomplete()
        }
    }
} else {
    try {
        window.arga_rpc = new easyXDM.Rpc({}, {
            remote: {
                argacomplete: {}
            }
        });
        ARGA_Private_Fns.Report("RPC object successfully instantiated")
    } catch (e) {
        ARGA_Private_Fns.ReportErrorToPx("Error instantiating RPC object: " + e.message)
    }
}
if (window.console == null) {
    console = new Object();
    console.log = new Function()
};
var ARGA_API = null;
var Url_Query = null;
var Local_Start_Time = null;
var ARGA_CALL_COUNTER = 1;
var ARGA_VARS = function() {
    var c = new Object();
    var a = window.location.search.substr(1).split("&");
    for (var b = 0; b < a.length; ++b) {
        var d = a[b].split("=");
        if (d.length == 2) {
            c[d[0].toLowerCase()] = d[1]
        } else {
            c[("un" + b)] = a[b]
        }
    }
    return {
        GET_FN: function(f) {
            return c[f.toLowerCase()]
        },
        ARGA_version: "4.0",
        ARGA_debug: true,
        ARGA_initialized: false
    }
}();

function Initialize_ARGA_Session(a) {
    ARGA_API = new Object();
    ARGA_API.data = new Array();
    return ARGA_Private_Fns.Get_Data_From_LMS(ARGA_API, a)
}

function GetSectionSummary() {
    return ARGA_Private_Fns.GetSectionSummary()
}

function Set_ARGA_Data(b, c) {
    if (!ARGA_VARS.ARGA_initialized) {
        ARGA_Private_Fns.ReportErrorToPx("Arga not initialized");
        return false
    }
    var a = ARGA_API.arbitraryDataIndex[b];
    if (a == null) {
        a = ARGA_API.next_arb_data_index;
        ARGA_API.arbitraryDataIndex[b] = a;
        ++ARGA_API.next_arb_data_index
    }
    ARGA_Private_Fns.SetValue("cmi.comments_from_learner." + a + ".location", b);
    ARGA_Private_Fns.SetValue("cmi.comments_from_learner." + a + ".comment", c);
    ARGA_Private_Fns.Report("Set_ARGA_Data successful: key=" + b + " / value=" + c);
    return true
}

function Get_ARGA_Data(b, a) {
    if (!ARGA_VARS.ARGA_initialized) {
        return false
    }
    var c;
    if (a != null) {
        c = ARGA_Private_Fns.Get_API_For_Learner(a)
    } else {
        c = ARGA_API
    }
    if (c == null) {
        return ""
    }
    switch (b) {
        case "learner_name":
            return c.learner_name;
        case "learner_id":
            return c.learner_id;
        case "course_id":
            return c.course_id;
        case "user_rights":
            return c.user_rights;
        case "user_due_date":
            return c.user_due_date;
        case "due_date_has_passed":
            return c.due_date_has_passed
    }
    var d = c.arbitraryDataIndex[b];
    return ARGA_Private_Fns.GetValue(c, "cmi.comments_from_learner." + d + ".comment")
}

function Get_ARGA_Data_Class(c) {
    if (!ARGA_VARS.ARGA_initialized) {
        return []
    }
    if (ARGA_API.class_info == null) {
        return []
    }
    var a = new Array();
    for (var b = 0; b < ARGA_API.class_info.length; ++b) {
        a[b] = "";
        switch (c) {
            case "learner_name":
                a[b] = ARGA_API.class_info[b].learner_name;
                continue;
            case "learner_id":
                a[b] = ARGA_API.class_info[b].learner_id;
                continue;
            case "learner_email":
                a[b] = ARGA_API.class_info[b].learner_email;
                continue;
            case "course_id":
                a[b] = ARGA_API.course_id;
                continue;
            case "user_rights":
                a[b] = ARGA_API.class_info[b].user_rights;
                continue;
            case "user_due_date":
                a[b] = ARGA_API.class_info[b].user_due_date;
                continue;
            case "due_date_has_passed":
                a[b] = ARGA_API.class_info[b].due_date_has_passed;
                continue
        }
        var d = "cmi.comments_from_learner." + ARGA_API.class_info[b].arbitraryDataIndex[c] + ".comment";
        a[b] = ARGA_API.class_info[b].data[d]
    }
    return a
}

function Set_ARGA_Question_Response(l, f, g, c, h, j, d, m) {
    if (!ARGA_VARS.ARGA_initialized) {
        ARGA_Private_Fns.ReportErrorToPx("Arga not initialized");
        return false
    }
    if (typeof arguments[0] == "object") {
        var k = arguments[0];
        f = k.questionType;
        g = k.questionText;
        c = k.correctAnswer;
        h = k.learnerResponse;
        j = k.questionGrade;
        d = k.questionWeight;
        m = k.questionData;
        l = k.questionNum
    }
    if (c == null) {
        c = ""
    }
    var b = ARGA_API.questionIndex[l];
    if (b == null) {
        b = ARGA_API.next_scorm_index;
        ARGA_API.questionIndex[l] = b;
        ++ARGA_API.next_scorm_index
    }
    var i = "cmi.interactions." + b + ".";
    ARGA_Private_Fns.SetValue(i + "id", l);
    ARGA_Private_Fns.SetValue(i + "type", "other");
    ARGA_Private_Fns.SetValue(i + "displaytype", f);
    ARGA_Private_Fns.SetValue(i + "description", g);
    ARGA_Private_Fns.SetValue(i + "correct_responses.0.pattern", c);
    ARGA_Private_Fns.SetValue(i + "learner_response", h);
    j = j * 1;
    if (isNaN(j)) {
        j = 0
    } else {
        if (j == -1) {
            j = ""
        } else {
            j = j / 100
        }
    }
    ARGA_Private_Fns.SetValue(i + "result", j);
    ARGA_Private_Fns.SetValue(i + "weighting", d);
    ARGA_Private_Fns.SetValue(i + "tag", m);
    return true
}

function Get_ARGA_LearnerResponse(b, a) {
    return ARGA_Private_Fns.GetQuestionData("learnerResponse", b, a)
}

function Get_ARGA_LearnerResponse_Class(c) {
    if (!ARGA_VARS.ARGA_initialized) {
        ARGA_Private_Fns.ReportErrorToPx("Arga not initialized");
        return []
    }
    var a = new Array();
    if (ARGA_API.class_info == null) {
        return ""
    }
    for (var b = 0; b < ARGA_API.class_info.length; ++b) {
        a[b] = "";
        var d = "cmi.interactions." + ARGA_API.class_info[b].questionIndex[c] + ".learner_response";
        a[b] = ARGA_API.class_info[b].data[d]
    }
    return a
}

function Get_ARGA_QuestionData(b, a) {
    return ARGA_Private_Fns.GetQuestionData("questionData", b, a)
}

function Get_ARGA_QuestionGrade(c, a) {
    var b = ARGA_Private_Fns.GetQuestionData("questionGrade", c, a);
    if (b == "" || b == null) {
        return -1
    } else {
        return b * 100
    }
}

function Set_ARGA_Grade(f) {
    if (!ARGA_VARS.ARGA_initialized) {
        ARGA_Private_Fns.ReportErrorToPx("Arga not initialized");
        return false
    }
    if (Get_ARGA_Data("complete") == "no") {
        ARGA_API.grade = -2
    } else {
        if (f != null) {
            ARGA_API.grade = f
        } else {
            var g = 0;
            var a = 0;
            for (var d = 0; d < 1000; ++d) {
                var h = ARGA_Private_Fns.GetValue(ARGA_API, "cmi.interactions." + d + ".id");
                if (h == "") {
                    break
                }
                var b = parseInt(ARGA_Private_Fns.GetValue(ARGA_API, "cmi.interactions." + d + ".weighting"));
                if (!isNaN(b)) {
                    if (b == -1) {
                        b = 10
                    }
                    var c = ARGA_Private_Fns.GetValue(ARGA_API, "cmi.interactions." + d + ".result");
                    if (c == null || c === "" || c == -1) {
                        if (Get_ARGA_Data("grade_partial") != "yes") {
                            ARGA_API.grade = -1;
                            return true
                        }
                    } else {
                        c *= 100;
                        g += (c * b);
                        a += b
                    }
                }
            }
            if (a == 0) {
                ARGA_API.grade = 0
            } else {
                ARGA_API.grade = Math.round(g / a)
            }
        }
    }
    return true
}

function Get_ARGA_Grade(a) {
    if (!ARGA_VARS.ARGA_initialized) {
        ARGA_Private_Fns.ReportErrorToPx("Arga not initialized");
        return -1
    }
    var b;
    if (a != null) {
        b = ARGA_Private_Fns.Get_API_For_Learner(a)
    } else {
        b = ARGA_API
    }
    if (b == null || b.grade == "" || b.grade == null) {
        return -1
    } else {
        return b.grade
    }
}

function Get_ARGA_Grade_Class() {
    if (!ARGA_VARS.ARGA_initialized) {
        return []
    }
    if (ARGA_API.class_info == null) {
        return []
    }
    var a = new Array();
    for (var b = 0; b < ARGA_API.class_info.length; ++b) {
        a[b] = ARGA_API.class_info[b].grade
    }
    return a
}

function Save_ARGA_Data(a) {
    if (!ARGA_VARS.ARGA_initialized) {
        ARGA_Private_Fns.ReportErrorToPx("Arga not initialized");
        return false
    }
    return ARGA_Private_Fns.Save_Data_To_LMS(a)
}

function Get_ARGA_QuestionData_For_PageId(a) {
    var b = new Object();
    b.learner_id = ARGA_API.learner_id;
    b.course_id = ARGA_API.course_id;
    b.page_id = a;
    b.data = new Array();
    ARGA_Private_Fns.Get_Data_From_LMS(b)
}
var ARGA_Private_Fns = function() {
    var c = 15000;
    var a = 60000;
    var f = 5000;
    var b = 15000;
    var g = null;
    var d = false;

    function i(j) {
        if ((j & 16777216) > 0) {
            return "3_instructor"
        } else {
            return "1_student"
        }
    }

    function h() {
        var j = document.getElementById("ARGA_ajax_save_div");
        if (j != null) {
            j.style.display = "block"
        } else {
            var k = document.createElement("div");
            k.setAttribute("id", "ARGA_ajax_save_div");
            k.innerHTML = "<div style='position:fixed; left:0px; top:0px; width:100%; height:100%; z-index:99999;'><div style='position:fixed; left:0px; top:0px; width:100%; height:100%; background-color:#fff; opacity: .7; filter:Alpha(Opacity=70);'></div><div style='position:fixed; left:0px; top:0px; width:100%; height:100%'><div style='margin-top:150px; margin-left:auto; margin-right:auto; width:160px; text-align:center; background-color:#000; opacity: 1; filter:Alpha(Opacity=100); border:1px solid #000; border-radius:8px; padding:10px; color:#fff; font-weight:bold; font-family:Verdana, sans-serif; font-size:14px;'><img border='0' src='http://ajax.aspnetcdn.com/ajax/jquery.mobile/1.1.0/images/ajax-loader.gif' width='20' height='20' align='absbottom'> Saving data...</div></div>";
            document.body.appendChild(k)
        }
    }
    return {
        CalculateDueDateGrace: function(j, m) {
            if (!j) {
                return null
            }
            if (Url_Query && Url_Query.dueDate > 0) {
                j = new Date((Url_Query.dueDate))
            } else {
                if (isNaN(Date.parse(j))) {
                    j = ARGA_Private_Fns.ParseDate(j)
                } else {
                    j = new Date(j)
                }
            }
            if (!m) {
                return j
            } else {
                if (m == -1) {
                    var k = new Date("1/1/2999");
                    return k
                } else {
                    var k;
                    try {
                        k = new Date(j.getTime() + (m * 60000))
                    } catch (l) {
                        ARGA_Private_Fns.ReportErrorToPx("CalculateDueDateGrace() error : dueDate = " + j + ", gracePeriod = " + m)
                    }
                    return k
                }
            }
        },
        ParseDate: function(k) {
            var j = k.match(/(\d+)-(\d+)-(\d+) (\d+):(\d+):(\d+)/);
            return new Date(j[1], j[2] - 1, j[3], j[4], j[5], j[6])
        },
        Get_API_For_Learner: function(l) {
            for (var k = 0; k < ARGA_API.class_info.length; ++k) {
                if (ARGA_API.class_info[k].learner_id == l) {
                    return ARGA_API.class_info[k]
                }
            }
            return null
        },
        GetValue: function(j, k, m) {
            if (m == null && j && j.dejs_data) {
                for (var l = 0; l < j.dejs_data.length; ++l) {
                    var n = j.dejs_data[l];
                    if (n.name == k) {
                        return n.value
                    }
                }
            } else {
                if (m != null) {
                    for (key in m) {
                        if (key == k) {
                            return m[key]
                        }
                    }
                }
            }
            return ""
        },
        GetQuestionData: function(n, m, k) {
            if (!ARGA_VARS.ARGA_initialized) {
                ARGA_Private_Fns.ReportErrorToPx("Arga not initialized");
                return ""
            }
            var l;
            if (k != null) {
                l = ARGA_Private_Fns.Get_API_For_Learner(k)
            } else {
                l = ARGA_API
            }
            if (l == null) {
                return ""
            }
            var j = l.questionIndex[m];
            if (j != null) {
                var o = "cmi.interactions." + j;
                if (n == "learnerResponse") {
                    o += ".learner_response"
                } else {
                    if (n == "questionData") {
                        o += ".tag"
                    } else {
                        if (n == "questionGrade") {
                            o += ".result"
                        }
                    }
                }
                return ARGA_Private_Fns.GetValue(l, o)
            } else {
                return ""
            }
        },
        SetValue: function(j, m) {
            for (var k = 0; k < ARGA_API.dejs_data.length; ++k) {
                var n = ARGA_API.dejs_data[k];
                if (n.name == j) {
                    n.value = m;
                    n.dirty = true;
                    return
                }
            }
            var l = ARGA_API.dejs_data.length;
            n = ARGA_API.dejs_data[l] = new Object();
            n.name = j;
            n.value = m;
            n.dirty = true
        },
        GetSectionSummary: function() {
            g = $.Deferred();
            var j = new Object();
            j.tempAPI = ARGA_API;
            j.timeout = f;
            j.callback = ARGA_Private_Fns.GetSectionSummaryCallback;
            if (JSONP.sameHost() && parent.ArgaServices && !Url_Query.api_mode) {
                var k = parent.ArgaServices.getClassScoData(null, Url_Query.itemid, f);
                k.done(function(l) {
                    ARGA_Private_Fns.GetSectionSummaryCallback.apply(window, [j, l.success, l.data])
                })
            } else {
                DEJS_API.getSectionData(j)
            }
            return g.promise()
        },
        Get_Data_From_LMS: function(n, k) {
            if (k == null) {
                k = new Object()
            }
            k.tempAPI = n;
            var j = DEJS_API.initialize();
            if (!j) {
                ARGA_Private_Fns.ReportErrorToPx("DEJS_API failed to initialize");
                return false
            }
            if (k.retrieve_class_data == true || k.retrieve_class_data == "1") {
                if (k.retrieve_class_data_rights != null) {
                    var l = new Object();
                    l.tempAPI = n;
                    l.timeout = a;
                    l.callback = ARGA_Private_Fns.Get_Section_Data_AJAX_Callback;
                    l.cancel_initialization_alert = k.cancel_initialization_alert;
                    l.dueDateTimeTrackConfig = k.dueDateTimeTrackConfig;
                    var m = DEJS_API.getSectionData(l);
                    if (!m) {
                        ARGA_Private_Fns.ReportErrorToPx("DEJS_API getSectionData failed to run");
                        return false
                    }
                } else {
                    k.callback = ARGA_Private_Fns.Get_Data_From_LMS_Callback;
                    k.timeout = c;
                    j = DEJS_API.getData(k);
                    if (!j) {
                        ARGA_Private_Fns.ReportErrorToPx("DEJS_API getData failed to run");
                        return false
                    }
                }
            } else {
                k.callback = ARGA_Private_Fns.Get_Data_From_LMS_Callback;
                k.timeout = c;
                j = DEJS_API.getData(k);
                if (!j) {
                    ARGA_Private_Fns.ReportErrorToPx("DEJS_API getData failed to run");
                    return false
                }
            }
            return true
        },
        Get_Data_From_LMS_Callback: function(s, w, p) {
            if (!w) {
                ARGA_Private_Fns.ReportErrorToPx("DEJS_API getData's ajax call failed");
                return false
            }
            var n = s.tempAPI;
            n.dejs_data = p;
            n.learner_id = ARGA_Private_Fns.GetValue(n, "bh.user_id");
            n.learner_name = ARGA_Private_Fns.GetValue(n, "bh.user_display");
            n.course_id = ARGA_Private_Fns.GetValue(n, "bh.course_id");
            n.user_rights = i(ARGA_Private_Fns.GetValue(n, "bh.enrollment_rights"));
            n.user_due_date = ARGA_Private_Fns.GetValue(n, "bh.item_due_date");
            if (n.user_due_date && isNaN(Date.parse(n.user_due_date)) && n.user_due_date.indexOf("%") != -1) {
                var z = decodeURIComponent(n.user_due_date);
                n.user_due_date = z
            }
            if (Url_Query && Url_Query.dueDate != null) {
                Url_Query.dueDate = Url_Query.dueDate * 1
            } else {
                Url_Query.dueDate = null
            }
            n.user_grace = ARGA_Private_Fns.GetValue(n, "bh.custom.duedategrace");
            n.user_due_date_grace = ARGA_Private_Fns.CalculateDueDateGrace(n.user_due_date, n.user_grace);
            n.submission_grade_action = ARGA_Private_Fns.GetValue(n, "bh.custom.submissiongradeaction");
            var t = ARGA_Private_Fns.GetValue(n, "cmi.score.scaled");
            if (t == "") {
                var l = ARGA_Private_Fns.GetValue(n, "cmi.exit");
                if (l == "") {
                    n.grade = ""
                } else {
                    var q = ARGA_Private_Fns.GetValue(n, "cmi.completion_status");
                    if (q == "completed") {
                        n.grade = "-1"
                    } else {
                        if (q == "incomplete") {
                            n.grade = "-2"
                        } else {
                            n.grade = ""
                        }
                    }
                }
            } else {
                n.grade = t * 100
            }
            ARGA_Private_Fns.SetDueDateInfo(s, n);
            n.questionIndex = new Object();
            for (var o = 0; o < 1000; ++o) {
                var k = ARGA_Private_Fns.GetValue(n, "cmi.interactions." + o + ".id");
                if (k == "") {
                    break
                }
                n.questionIndex[k] = o
            }
            n.next_scorm_index = o;
            n.arbitraryDataIndex = new Object();
            var j = ARGA_Private_Fns.GetValue(n, "cmi.comments_from_learner._count");
            if (j == "" || parseFloat(j) > 0) {
                for (var u = 0; u < 1000; ++u) {
                    var v = ARGA_Private_Fns.GetValue(n, "cmi.comments_from_learner." + u + ".location");
                    if (v == "") {
                        break
                    }
                    n.arbitraryDataIndex[v] = u
                }
                n.next_arb_data_index = u
            } else {
                n.next_arb_data_index = 0
            }
            ARGA_VARS.ARGA_initialized = true;
            ARGA_Private_Fns.Report("Initialize_ARGA_Session successful");
            var r = ARGA_Private_Fns.GetValue(n, "bh.item_subtype");
            var y = (r && r.toLowerCase() == "learningcurve") ? true : false;
            if (y || (s.cancel_initialization_alert != true && s.cancel_initialization_alert != 1 && (!n.user_rights || n.user_rights.indexOf("instructor") === -1))) {
                var m = "";
                if (n.due_date_has_passed == 0) {
                    if (n.grade != "" && parseFloat(n.grade) >= 0) {
                        m += "You have completed this activity."
                    }
                } else {
                    if (n.due_date_has_passed == 1) {
                        if (Url_Query && Url_Query.dueDate === 0) {
                            m += "This activity has not been assigned. You may review the materials in the activity, but you will not receive a grade for submitting answers."
                        } else {
                            if ((n.grade == "" || parseFloat(n.grade) < 0)) {
                                m += "The due date for this assignment has now passed. You may review the materials in the activity, but you will not receive a grade for submitting answers."
                            } else {
                                if (parseFloat(n.grade) >= 0) {
                                    m += "You have completed this activity. The due date for this assignment has now passed.  You may review the materials in the activity, but further submissions will not be recorded."
                                }
                            }
                        }
                    }
                }
                if (m != "") {
                    alert(m)
                }
            }
            window.onbeforeunload = ARGA_Private_Fns.OnBeforeUnload;
            if (window.Initialize_ARGA_Session_Callback != null) {
                Initialize_ARGA_Session_Callback(true)
            }
            Local_Start_Time = Date && Date.now ? Date.now() : new Date().getTime();
            return true
        },
        populateClassData: function(n, o) {
            for (var t = 0; t < o.length; t++) {
                var m = o[t];
                var l = new Object();
                try {
                    l.learner_id = m.id;
                    l.learner_name = m.first + " " + m.last;
                    l.learner_email = m.email == null ? null : decodeURIComponent(m.email);
                    l.course_id = ARGA_Private_Fns.GetValue(n, "bh.course_id");
                    l.user_rights = "1_student";
                    l.user_due_date = ARGA_Private_Fns.GetValue(l, "bh.item_due_date");
                    l.due_date_has_passed = 0;
                    var r = m.score;
                    if (r == "") {
                        l.grade = ""
                    } else {
                        l.grade = r * 100
                    }
                    l.data = m.scorm;
                    l.questionIndex = new Object();
                    for (var p = 0; p < 1000; ++p) {
                        var k = ARGA_Private_Fns.GetValue(null, "cmi.interactions." + p + ".id", m.scorm);
                        if (k == "") {
                            break
                        }
                        l.questionIndex[k] = p
                    }
                    l.next_scorm_index = p;
                    l.arbitraryDataIndex = new Object();
                    var j = ARGA_Private_Fns.GetValue(null, "cmi.comments_from_learner._count", m.scorm);
                    if (j == "" || parseFloat(j) > 0) {
                        for (var s = 0; s < 1000; ++s) {
                            var u = ARGA_Private_Fns.GetValue(null, "cmi.comments_from_learner." + s + ".location", m.scorm);
                            if (u == "") {
                                break
                            }
                            l.arbitraryDataIndex[u] = s
                        }
                        l.next_arb_data_index = s
                    } else {
                        l.next_arb_data_index = 0
                    }
                    n.class_info.push(l)
                } catch (q) {
                    console.log("error Get_Section_Data_AJAX_Callback(): " + q.message ? q.message : q);
                    ARGA_Private_Fns.Report("Get section data callback error:" + q.message)
                }
            }
        },
        Get_Section_Data_AJAX_Callback: function(j, l, k) {
            if (!l) {
                ARGA_Private_Fns.ReportErrorToPx("DEJS_API getData's ajax call failed");
                return
            }
            var m = j.tempAPI;
            m.dejs_class_data = k;
            if (m.class_info == null) {
                m.class_info = new Array()
            }
            ARGA_Private_Fns.populateClassData(m, k);
            j.callback = ARGA_Private_Fns.Get_Data_From_LMS_Callback;
            j.timeout = c;
            result = DEJS_API.getData(j);
            if (!result) {
                ARGA_Private_Fns.Report("DEJS_API getData failed to run");
                return
            }
        },
        GetSectionSummaryCallback: function(j, l, k) {
            if (!l) {
                ARGA_Private_Fns.ReportErrorToPx("DEJS_API getData's ajax call failed");
                return
            }
            var m = j.tempAPI;
            m.dejs_class_data = k;
            if (m.class_info == null) {
                m.class_info = new Array()
            }
            ARGA_Private_Fns.populateClassData(m, k);
            if (g) {
                g.resolve()
            }
        },
        Save_Data_To_LMS: function(k) {
            if (ARGA_API.grade == -2 || ARGA_API.grade === "" || ARGA_API.grade == null) {
                ARGA_Private_Fns.SetValue("cmi.completion_status", "incomplete")
            } else {
                if (ARGA_API.grade == -1) {
                    ARGA_Private_Fns.SetValue("cmi.completion_status", "completed")
                } else {
                    if (ARGA_API.due_date_has_passed != 1) {
                        if (ARGA_API.submission_grade_action == "Full_Credit") {
                            ARGA_Private_Fns.SetValue("cmi.score.scaled", 1)
                        } else {
                            ARGA_Private_Fns.SetValue("cmi.score.scaled", ARGA_API.grade / 100)
                        }
                    }
                    if (!ARGA_API.completion_status) {
                        ARGA_Private_Fns.SetValue("cmi.completion_status", "completed")
                    } else {
                        ARGA_Private_Fns.SetValue("cmi.completion_status", ARGA_API.completion_status)
                    }
                }
            }
            var l = Url_Query && Url_Query.track == "true";
            if (Local_Start_Time != null && l) {
                var m = Date && Date.now ? Date.now() : new Date().getTime();
                var j = Math.round((m - Local_Start_Time) / 1000);
                ARGA_Private_Fns.SetValue("cmi.session_time", "PT" + j + "S")
            }
            ARGA_Private_Fns.SetValue("cmi.exit", "suspend");
            if (k != null && k.show_progress == true) {
                h()
            }
            DEJS_API.putData({
                callback: ARGA_Private_Fns.Save_Data_To_LMS_Callback,
                timeout: b,
                data: ARGA_API.dejs_data,
                retry: false
            });
            d = true;
            return (true)
        },
        Save_Data_To_LMS_Callback: function(j, o, l) {
            var n = document.getElementById("ARGA_ajax_save_div");
            if (n != null) {
                n.style.display = "none"
            }
            d = false;
            if (!o) {
                ARGA_Private_Fns.Report("Save_Data_To_LMS error:");
                ARGA_Private_Fns.Report(l);
                if (j.retry == false) {
                    h();
                    d = true;
                    j.retry = true;
                    if (l && (l.indexOf("Access Denied") === -1)) {
                        j.dataNeedReEncoding = true;
                        DEJS_API.putData(j)
                    } else {
                        if (JSONP.sameHost() && parent.sessionKeepAlive) {
                            parent.sessionKeepAlive();
                            setTimeout(function() {
                                DEJS_API.putData(j)
                            }, 2000)
                        } else {
                            DEJS_API.putData(j)
                        }
                    }
                    return
                } else {
                    alert("We were again unable to save your activity data. This may be due to a poor internet connection. Try refreshing your browser window and attempting the activity again, or try again later.\n\nIf you encounter this message consistently and report the incident to technical support, please pass on the following information:\n\nError message: " + l);
                    return
                }
            }
            for (var k = 0; k < ARGA_API.dejs_data.length; k++) {
                ARGA_API.dejs_data[k].dirty = null
            }
            if (ARGA_API.grade !== "" && ARGA_API.grade != null && ARGA_API.grade * 1 >= -1) {
                try {
                    if (ARGA_API.previousGrade == null || ARGA_API.previousGrade !== ARGA_API.grade) {
                        arga_rpc.argacomplete(ARGA_API.grade);
                        ARGA_Private_Fns.Report("called rpc.argacomplete; grade=" + ARGA_API.grade);
                        ARGA_API.previousGrade = ARGA_API.grade
                    }
                } catch (m) {
                    console.log("error Save_Data_To_LMS(): " + m.message ? m.message : m)
                }
            }
            if (window.Save_ARGA_Data_Callback) {
                Save_ARGA_Data_Callback(true)
            }
        },
        Report: function(j) {
            if (ARGA_VARS.ARGA_debug) {
                try {
                    console.log(j)
                } catch (k) {
                    console.log("error Report(): " + k.message ? k.message : k)
                }
            }
            var l = document.getElementById("ARGA_debug_div");
            if (l) {
                l.innerHTML += "<div style='border-top:1px solid #666; padding-top:3px; margin-top:3px'>" + j + "</div>"
            }
        },
        ReportErrorToPx: function(j) {
            ARGA_Private_Fns.Report(j);
            if (JSONP.sameHost() && parent.PxPage) {
                $.post(parent.PxPage.Routes.log_javascript_errors, {
                    errorName: "Arga Activity Error",
                    errorMessage: j
                })
            }
        },
        SetDueDateInfo: function(l, w) {
            var z = l.dueDateTimeTrackConfig;
            var B;
            if (z != null && !!z.startTime) {
                B = z.startTime
            } else {
                if (Url_Query && Url_Query.startTime) {
                    B = Url_Query.startTime * 1
                } else {
                    B = new Date().getTime()
                }
            }
            var j;
            var E, A, m, x, t;
            if (Url_Query && Url_Query.dueDate > 0) {
                var D = new Date(Url_Query.dueDate);
                E = D.getMonth();
                A = D.getDate();
                m = D.getHours();
                x = D.getMinutes();
                t = D.getFullYear();
                if (Url_Query.dueDate < B && (w.user_due_date_grace == null || isNaN(w.user_due_date_grace) || (w.user_due_date_grace < B))) {
                    w.due_date_has_passed = 1
                } else {
                    w.due_date_has_passed = 0
                }
            } else {
                if ((j = w.user_due_date.match(/(\d\d\d\d)-(\d\d)-(\d\d) (\d\d):(\d\d):(\d\d)/)) != null) {
                    t = j[1] * 1;
                    E = j[2] * 1 - 1;
                    A = j[3] * 1;
                    m = j[4] * 1;
                    x = j[5] * 1;
                    var u = j[6] * 1;
                    var q = 0;
                    var C = new Date(t, E, A, m, x, u, q);
                    if (C.getTime() < B && (w.user_due_date_grace == null || isNaN(w.user_due_date_grace) || (w.user_due_date_grace < B))) {
                        w.due_date_has_passed = 1
                    } else {
                        w.due_date_has_passed = 0
                    }
                } else {
                    w.due_date_has_passed = 0
                }
            }
            if (t == 9999) {
                w.user_due_date = ""
            } else {
                if (E != null) {
                    var o = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                    var n = o[E] + " " + A + " at ";
                    if (m < 12) {
                        if (m == 0) {
                            m = 12
                        }
                        n += m + ":" + (x < 10 ? "0" : "") + x + " AM"
                    } else {
                        n += m + ":" + (x < 10 ? "0" : "") + x + " PM"
                    }
                    w.user_due_date = n
                }
            }
            var k = w.user_due_date_grace == null ? NaN : w.user_due_date_grace.getTime();
            if (z && !w.due_date_has_passed && !isNaN(k) && w.grade !== 100) {
                if (z.dueTimeExpired) {
                    var y = k - B;
                    var p = function() {
                        ARGA_Private_Fns.AlertUserDueDateHasPassed(z.dueTimeExpired.showAlert, w);
                        if (z.alertCallback && typeof(z.alertCallback) === "function") {
                            z.alertCallback()
                        }
                    };
                    ARGA_Private_Fns.SetUpTimeTrack(y, p)
                }
                if (z.dueTimeReminder) {
                    var r = k - B;
                    var v = r - 600000;
                    var s = function() {
                        ARGA_Private_Fns.AlertUserDueDateSoonPass(z.dueTimeReminder.showAlert, r < 600000 ? r : 600000);
                        if (z.reminderCallback && typeof(z.reminderCallback) === "function") {
                            z.reminderCallback()
                        }
                    };
                    ARGA_Private_Fns.SetUpTimeTrack((r < 600000 ? 100 : v), s)
                }
            }
        },
        SetUpTimeTrack: function(k, j) {
            if (k < 10 || k > 2147483647) {
                return
            }
            setTimeout(j, k)
        },
        AlertUserDueDateHasPassed: function(k, j) {
            j.due_date_has_passed = 1;
            if (k) {
                alert("The due time has expired. You can continue to work on the activity, but your grade will no longer be updated.")
            }
        },
        AlertUserDueDateSoonPass: function(l, j) {
            var k = Math.ceil(j / 60000);
            if (l && !isNaN(k)) {
                alert("The activity is going to be due in less than " + k + (k === 1 ? " minute." : " minutes."))
            }
        },
        OnBeforeUnload: function(j) {
            if (d == true) {
                var k = "Your activity data is currently in the process of being saved.";
                var j = j || window.event;
                if (j) {
                    j.returnValue = k
                }
                return k
            }
        }
    }
}();

function Initialize_SCORM_Session() {
    return Initialize_ARGA_Session()
}

function Set_SCORM_Data(a, b) {
    return Set_ARGA_Data(a, b)
}

function Get_SCORM_Data(a) {
    return Get_ARGA_Data(a)
}

function Set_SCORM_Question_Response(g, b, i, h, f, a, d, c) {
    return Set_ARGA_Question_Response(g, b, i, h, f, a, d, c)
}

function Get_SCORM_LearnerResponse(a) {
    return Get_ARGA_LearnerResponse(a)
}

function Get_SCORM_QuestionData(a) {
    return Get_ARGA_QuestionData(a)
}

function Set_SCORM_Grade(a) {
    return Set_ARGA_Grade(a)
}

function Set_ARGA_Completion_Status(a) {
    ARGA_API.completion_status = a
}

function Get_SCORM_Grade() {
    return Get_ARGA_Grade()
}

function Save_SCORM_Data() {
    return Save_ARGA_Data()
}
window.undefined = window.undefined;
var JSONP = function() {
    var h = [];
    var i = 0;
    var a = 30000;
    var g = !!{}.hasOwnProperty;

    function f(o) {
        var m = h[o];
        if (m != null && m.timeout != -1) {
            clearTimeout(m.timeout);
            m.timeout = -1
        }
        h[o] = null;
        return m
    }

    function j(o) {
        var m = h[o];
        if (m != null && m.options && !m.options.haveBeenRetried) {
            if (JSONP.sameHost() && parent.sessionKeepAlive) {
                parent.sessionKeepAlive();
                setTimeout(function() {
                    h[o] = null;
                    m.options.haveBeenRetried = true;
                    JSONP.request(m.options)
                }, 2000);
                return
            }
        }
        JSONP.callback(o, null)
    }

    function l(m) {
        return m && typeof m.getFullYear == "function"
    }
    var d = {
        "\b": "\\b",
        "\t": "\\t",
        "\n": "\\n",
        "\f": "\\f",
        "\r": "\\r",
        '"': '\\"',
        "\\": "\\\\"
    };

    function k(m) {
        if (/["\\\x00-\x1f]/.test(m)) {
            return '"' + m.replace(/([\x00-\x1f\\"])/g, function(p, o) {
                var q = d[o];
                if (q) {
                    return q
                }
                q = o.charCodeAt();
                return "\\u00" + Math.floor(q / 16).toString(16) + (q % 16).toString(16)
            }) + '"'
        }
        return '"' + m + '"'
    }

    function b(t) {
        var q = ["["],
            m, s, p = t.length,
            r;
        for (s = 0; s < p; s += 1) {
            r = t[s];
            switch (typeof r) {
                case "undefined":
                case "function":
                case "unknown":
                    break;
                default:
                    if (m) {
                        q.push(",")
                    }
                    q.push(r === null ? "null" : JSONP.encode(r));
                    m = true
            }
        }
        q.push("]");
        return q.join("")
    }

    function c(m) {
        return m < 10 ? "0" + m : m
    }

    function n(m) {
        return '"' + m.getFullYear() + "-" + c(m.getMonth() + 1) + "-" + c(m.getDate()) + "T" + c(m.getHours()) + ":" + c(m.getMinutes()) + ":" + c(m.getSeconds()) + '"'
    }
    return {
        request: function(r) {
            if (JSONP.isEmpty(r) || JSONP.isEmpty(r.url)) {
                return
            }
            var m = h.length;
            r.params = r.params || {};
            r.params.i = m.toString(10);
            var p = document.createElement("script");
            p.type = "text/javascript";
            var q = {
                script: p,
                options: r,
                timeout: -1
            };
            h.push(q);
            p.src = r.url + "?" + JSONP.urlEncode(r.params);
            q.timeout = setTimeout(function() {
                j(m)
            }, r.timeout || a);
            document.getElementsByTagName("head")[0].appendChild(p)
        },
        callback: function(q, m) {
            if (q == -1 || h[q] == null) {
                return
            }
            var o = f(q);
            if (o != null && !JSONP.isEmpty(o.options.callback)) {
                try {
                    o.options.callback.apply(o.options.scope || window, [o.options, m])
                } catch (p) {
                    console.log("error callback(): " + p.message ? p.message : p)
                }
                document.getElementsByTagName("head")[0].removeChild(o.script)
            }
        },
        getUrlLength: function(o, p) {
            p.apiIndex = "99999";
            var m = o + "?" + JSONP.urlEncode(p);
            return m.length
        },
        apply: function(r, s, q) {
            if (q) {
                apply(r, q)
            }
            if (r && s && typeof s == "object") {
                for (var m in s) {
                    r[m] = s[m]
                }
            }
            return r
        },
        isObject: function(m) {
            return m && typeof m == "object"
        },
        isArray: function(m) {
            return m && typeof m.length == "number" && typeof m.splice == "function"
        },
        isEmpty: function(m) {
            return m === null || m === "" || typeof m == "undefined"
        },
        encode: function(s) {
            if (typeof s == "undefined" || s === null) {
                return "null"
            } else {
                if (JSONP.isArray(s)) {
                    return b(s)
                } else {
                    if (l(s)) {
                        return n(s)
                    } else {
                        if (typeof s == "string") {
                            return k(s)
                        } else {
                            if (typeof s == "number") {
                                return isFinite(s) ? String(s) : "null"
                            } else {
                                if (typeof s == "boolean") {
                                    return String(s)
                                } else {
                                    var p = ["{"],
                                        m, r, q;
                                    for (r in s) {
                                        if (!g || s.hasOwnProperty(r)) {
                                            q = s[r];
                                            switch (typeof q) {
                                                case "undefined":
                                                case "function":
                                                case "unknown":
                                                    break;
                                                default:
                                                    if (m) {
                                                        p.push(",")
                                                    }
                                                    p.push(JSONP.encode(r), ":", q === null ? "null" : JSONP.encode(q));
                                                    m = true
                                            }
                                        }
                                    }
                                    p.push("}");
                                    return p.join("")
                                }
                            }
                        }
                    }
                }
            }
        },
        urlEncode: function(m) {
            if (!m) {
                return ""
            }
            var p = [];
            for (var w in m) {
                var q = m[w],
                    r = encodeURIComponent(w);
                var v = typeof q;
                if (v == "undefined") {
                    p.push(r, "=&")
                } else {
                    if (v != "function" && v != "object") {
                        p.push(r, "=", encodeURIComponent(q), "&")
                    } else {
                        if (l(q)) {
                            var x = encode(q).replace(/"/g, "");
                            p.push(r, "=", x, "&")
                        } else {
                            if (JSONP.isArray(q)) {
                                if (q.length) {
                                    for (var t = 0, u = q.length; t < u; t++) {
                                        p.push(r, "=", encodeURIComponent(q[t] === undefined ? "" : q[t]), "&")
                                    }
                                } else {
                                    p.push(r, "=&")
                                }
                            }
                        }
                    }
                }
            }
            p.pop();
            return p.join("")
        },
        urlDecode: function(s, u) {
            if (!s || !s.length) {
                return {}
            }
            var q = {};
            var o = s.split("&");
            var p, m, v;
            for (var r = 0, t = o.length; r < t; r++) {
                p = o[r].split("=");
                m = decodeURIComponent(p[0]);
                v = decodeURIComponent(p[1]);
                if (u !== true) {
                    if (typeof q[m] == "undefined") {
                        q[m] = v
                    } else {
                        if (typeof q[m] == "string") {
                            q[m] = [q[m]];
                            q[m].push(v)
                        } else {
                            q[m].push(v)
                        }
                    }
                } else {
                    q[m] = v
                }
            }
            return q
        },
        htmlEncode: function(m, o) {
            if (!m) {
                return m
            }
            if (o && window.jQuery) {
                return window.jQuery("<div></div>").text(m).html().replace(/'/g, "&#39;").replace(/"/g, "&quot;")
            }
            return !m ? m : String(m).replace(/&(?!#)/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/%0[0-8BCEF]|%1[0-9A-F]|%7F/g, "")
        },
        sameHost: function() {
            var o = Url_Query ? Url_Query : JSONP.urlDecode(window.location.search.substr(1));
            var m = o.approot;
            return m && (m.indexOf(window.location.host) > -1)
        }
    }
}();
JSONP.apply(Function.prototype, {
    createDelegate: function(b, a) {
        var c = this;
        return function() {
            var d = a || arguments;
            return c.apply(b || window, d)
        }
    },
    defer: function(b, d, a) {
        var c = this.createDelegate(d, a);
        if (b) {
            return setTimeout(c, b)
        }
        c();
        return 0
    }
});
var DEJS_API = function() {
    var q = null;
    var l = null;
    var h = null;
    var a = false;
    var j = null;
    var r = 15;

    function n() {
        return !JSONP.isEmpty(q) && !JSONP.isEmpty(h) && !JSONP.isEmpty(l)
    }

    function i(s) {
        if (!n()) {
            return false
        }
        JSONP.request({
            url: h + "/Learn/ScormData.ashx",
            params: {
                action: "ping"
            },
            callback: g,
            scope: this,
            timeout: s == null ? null : s.timeout,
            agxOptions: s
        });
        return true
    }

    function o(t) {
        var s = t || {};
        if (JSONP.isEmpty(s.success)) {
            s.success = false
        }
        if (!s.success && JSONP.isEmpty(s.message)) {
            s.message = "no response"
        }
        return s
    }

    function k(s, t) {
        jQuery.ajax({
            type: "POST",
            url: h + "/Learn/ScormData.ashx",
            cache: false,
            data: {
                action: "putscormdata",
                enrollmentid: q,
                itemid: l,
                data: t,
                last: 1
            },
            dataType: "text",
            timeout: (s == null || s.timeout == null) ? 15000 : s.timeout,
            success: function(u) {
                u = "POST: " + u;
                var v;
                if (u.search(/success:\s*true/i) > -1) {
                    console.log("DEJS POST AJAX success: " + u);
                    v = true
                } else {
                    console.log("DEJS POST AJAX returned, but with error: " + u);
                    v = false
                }
                if (s != null && s.callback != null) {
                    s.callback(s, v, u)
                }
            },
            error: function(u, w, v) {
                console.log("DEJS POST AJAX error: " + (typeof result === "undefined" ? "unknown" : result));
                console.log(u);
                console.log(w);
                console.log(v);
                s.callback(s, false, v)
            }
        })
    }
    var f = 0;
    var d = null;

    function p(s, v, w) {
        var z = {
            url: h + "/Learn/ScormData.ashx",
            action: "putscormdata",
            enrollmentid: q,
            itemid: l,
            data: "",
            add: "1",
            last: "1"
        };
        var t = 2083 - (JSONP.getUrlLength(h + "/Learn/ScormData.ashx", z) + 20);
        var u = false;
        if (v.length > t) {
            d = v.substr(t);
            v = v.substr(0, t);
            if (v.substr(v.length - 10).indexOf("%") != -1) {
                var y = v.lastIndexOf("%");
                d = v.substr(y) + d;
                v = v.substr(0, y)
            }
        } else {
            d = null;
            u = true
        }
        f++;
        var x = {
            action: "putscormdata",
            enrollmentid: q,
            itemid: l,
            data: v
        };
        if (w) {
            x.add = "1"
        }
        if (u) {
            x.last = "1"
        }
        JSONP.request({
            url: h + "/Learn/ScormData.ashx",
            params: x,
            callback: m,
            scope: this,
            timeout: s == null ? null : s.timeout,
            agxOptions: s,
            agxPutCount: f
        })
    }

    function m(t, u) {
        if (t.agxPutCount != f) {
            console.log("putDataCallback: cancelled/superceded request; agxPutCount = " + t.agxPutCount + " / putCount = " + f + " (this shouldn't be a problem.)");
            return
        }
        var s = o(u);
        if (s.success) {
            if (!JSONP.isEmpty(d)) {
                p.defer(1, this, [t.agxOptions, d, true]);
                return
            }
        } else {
            console.log("putDataCallback (JSONP) error:");
            console.log(s);
            d = null
        }
        if (!JSONP.isEmpty(t.agxOptions) && !JSONP.isEmpty(t.agxOptions.callback)) {
            t.agxOptions.callback.call(t.agxOptions.scope || window, t.agxOptions, s.success, "JSONP: " + s.message)
        }
    }

    function g(t, u) {
        var s = o(u);
        if (!JSONP.isEmpty(t.agxOptions) && !JSONP.isEmpty(t.agxOptions.callback)) {
            t.agxOptions.callback.call(t.agxOptions.scope || window, t.agxOptions, s.success)
        }
    }

    function c(v, y, z) {
        var t = o(y);
        var y = [];
        if (t.success) {
            if (!JSONP.isEmpty(t.scormData)) {
                for (var w = 0, s = t.scormData.length; w < s; w++) {
                    var u = t.scormData[w].name;
                    var x = t.scormData[w].value;
                    if (z) {
                        x = decodeURIComponent(x)
                    }
                    if (!JSONP.isEmpty(u)) {
                        y.push({
                            name: u,
                            value: x
                        })
                    }
                }
            }
            if (!JSONP.isEmpty(t.customFields)) {
                for (var w = 0, s = t.customFields.length; w < s; w++) {
                    var u = t.customFields[w][0];
                    var x = t.customFields[w][1];
                    if (!JSONP.isEmpty(u)) {
                        u = "bh.custom." + u;
                        y.push({
                            name: u,
                            value: x
                        })
                    }
                }
            }
            if (!JSONP.isEmpty(t.bhVars)) {
                for (var w = 0, s = t.bhVars.length; w < s; w++) {
                    var u = t.bhVars[w][0];
                    var x = t.bhVars[w][1];
                    if (!JSONP.isEmpty(u)) {
                        y.push({
                            name: u,
                            value: x
                        })
                    }
                }
            }
        }
        if (!JSONP.isEmpty(v.agxOptions) && !JSONP.isEmpty(v.agxOptions.callback)) {
            v.agxOptions.callback.call(v.agxOptions.scope || window, v.agxOptions, t.success, y)
        }
    }

    function b(t, u) {
        var s = o(u);
        if (s.success) {}
        if (!JSONP.isEmpty(t.agxOptions) && !JSONP.isEmpty(t.agxOptions.callback)) {
            t.agxOptions.callback.call(t.agxOptions.scope || window, t.agxOptions, s.success, s.data)
        }
    }
    return {
        initialize: function() {
            if (n()) {
                return true
            }
            var s = Url_Query ? Url_Query : JSONP.urlDecode(window.location.search.substr(1));
            if (s.enrollmentid) {
                q = s.enrollmentid
            }
            if (s.itemid) {
                l = s.itemid
            }
            if (s.approot) {
                h = s.approot
            }
            if (s.ext_enrollmentid) {
                q = s.ext_enrollmentid
            }
            if (s.ext_itemid) {
                l = s.ext_itemid
            }
            if (s.ext_approot) {
                h = s.ext_approot
            }
            if (q == null && s.Url != null) {
                var t = JSONP.urlDecode(s.Url.replace(/.*?\?/, ""));
                if (t.enrollmentid) {
                    q = t.enrollmentid
                }
                if (t.itemid) {
                    l = t.itemid
                }
                if (t.approot) {
                    h = t.approot
                }
            }
            if (!n()) {
                return false
            }
            return true
        },
        ping: function(s) {
            return i(s)
        },
        getData: function(s) {
            if (!n()) {
                return false
            }
            if (JSONP.sameHost() && parent.ArgaServices && !Url_Query.api_mode) {
                parent.ArgaServices.getStudentScoData(q, l, s == null ? null : s.timeout, Url_Query.dueDate).done(function(t) {
                    c({
                        agxOptions: s
                    }, t, true)
                })
            } else {
                JSONP.request({
                    url: h + "/Learn/ScormData.ashx",
                    params: {
                        action: "getscormdata",
                        enrollmentid: q,
                        itemid: l
                    },
                    callback: c,
                    scope: this,
                    timeout: s == null ? null : s.timeout,
                    agxOptions: s
                })
            }
            return true
        },
        putData: function(v) {
            if (!n()) {
                return false
            }
            var x = "<data>";
            var t = null;
            if (JSONP.isArray(v.data)) {
                for (var w = 0, s = v.data.length; w < s; w++) {
                    if (!JSONP.isEmpty(v.data[w]) && !JSONP.isEmpty(v.data[w].name) && !JSONP.isObject(v.data[w].name) && !JSONP.isArray(v.data[w].name) && (v.data[w].name.indexOf("bh.") != 0 || v.data[w].name.indexOf("bh.item_name") === 0)) {
                        if (!t && v.data[w].name == "cmi.graded_score") {
                            t = v.data[w]
                        }
                        var y = v.data[w].value;
                        if (y == null) {
                            y = ""
                        }
                        if (v.dataNeedReEncoding) {
                            x = x.concat('<entry name="' + encodeURIComponent(JSONP.htmlEncode(decodeURIComponent(v.data[w].name), true)) + '" value="' + encodeURIComponent(JSONP.htmlEncode(decodeURIComponent(y), true)) + '"/>')
                        } else {
                            x = x.concat('<entry name="' + JSONP.htmlEncode(v.data[w].name, false) + '" value="' + JSONP.htmlEncode(y, false) + '"/>')
                        }
                    }
                }
            }
            x = x.concat("</data>");
            if (JSONP.sameHost() && window.jQuery == null) {
                window.jQuery = parent.jQuery
            }
            if (JSONP.sameHost() && (window.jQuery != null && jQuery("body") != null)) {
                if (parent.ArgaServices) {
                    var u = ARGA_API.previousGrade !== ARGA_API.grade || (ARGA_CALL_COUNTER % 10 === 0);
                    Local_Start_Time = u ? Date && Date.now ? Date.now() : new Date().getTime() : Local_Start_Time;
                    parent.ArgaServices.putStudentScoData(q, l, x, u, v).done(function(z) {
                        if (z && !z.Success) {
                            alert(z.Message);
                            return false
                        }
                        if (z.GradedScore != "-1") {
                            if (!t) {
                                ARGA_Private_Fns.SetValue("cmi.graded_score", z.GradedScore)
                            } else {
                                t.value = z.GradedScore
                            }
                        }
                        if (v && typeof v.callback === "function") {
                            v.callback(v, true)
                        }
                    }).fail(function(A, B, z) {
                        alert("We were unable to save your activity data. This may be due to a poor internet connection. Try refreshing your browser window and attempting the activity again, or try again later.\n\nIf you encounter this message consistently and report the incident to technical support, please pass on the following information:\n\nError message: Connection lost\n\n Status: " + B);
                        return false
                    });
                    ARGA_CALL_COUNTER++
                } else {
                    k(v, x)
                }
            } else {
                p(v, x, false)
            }
            return true
        },
        getSectionData: function(s) {
            if (!n()) {
                return false
            }
            JSONP.request({
                url: h + "/Learn/ScormData.ashx",
                params: {
                    action: "getsectionsummary",
                    enrollmentid: q,
                    itemid: l,
                    allstatus: s == null ? false : (s.allstatus ? "1" : "0")
                },
                callback: b,
                scope: this,
                timeout: s == null ? null : s.timeout,
                agxOptions: s
            });
            return true
        }
    }
}();
var JSON;
if (!JSON) {
    JSON = {}
}(function() {
    function f(n) {
        return n < 10 ? "0" + n : n
    }
    if (typeof Date.prototype.toJSON !== "function") {
        Date.prototype.toJSON = function(key) {
            return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null
        };
        String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function(key) {
            return this.valueOf()
        }
    }
    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap, indent, meta = {
            "\b": "\\b",
            "\t": "\\t",
            "\n": "\\n",
            "\f": "\\f",
            "\r": "\\r",
            '"': '\\"',
            "\\": "\\\\"
        },
        rep;

    function quote(string) {
        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function(a) {
            var c = meta[a];
            return typeof c === "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
        }) + '"' : '"' + string + '"'
    }

    function str(key, holder) {
        var i, k, v, length, mind = gap,
            partial, value = holder[key];
        if (value && typeof value === "object" && typeof value.toJSON === "function") {
            value = value.toJSON(key)
        }
        if (typeof rep === "function") {
            value = rep.call(holder, key, value)
        }
        switch (typeof value) {
            case "string":
                return quote(value);
            case "number":
                return isFinite(value) ? String(value) : "null";
            case "boolean":
            case "null":
                return String(value);
            case "object":
                if (!value) {
                    return "null"
                }
                gap += indent;
                partial = [];
                if (Object.prototype.toString.apply(value) === "[object Array]") {
                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || "null"
                    }
                    v = partial.length === 0 ? "[]" : gap ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]" : "[" + partial.join(",") + "]";
                    gap = mind;
                    return v
                }
                if (rep && typeof rep === "object") {
                    length = rep.length;
                    for (i = 0; i < length; i += 1) {
                        if (typeof rep[i] === "string") {
                            k = rep[i];
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ": " : ":") + v)
                            }
                        }
                    }
                } else {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ": " : ":") + v)
                            }
                        }
                    }
                }
                v = partial.length === 0 ? "{}" : gap ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}" : "{" + partial.join(",") + "}";
                gap = mind;
                return v
        }
    }
    if (typeof JSON.stringify !== "function") {
        JSON.stringify = function(value, replacer, space) {
            var i;
            gap = "";
            indent = "";
            if (typeof space === "number") {
                for (i = 0; i < space; i += 1) {
                    indent += " "
                }
            } else {
                if (typeof space === "string") {
                    indent = space
                }
            }
            rep = replacer;
            if (replacer && typeof replacer !== "function" && (typeof replacer !== "object" || typeof replacer.length !== "number")) {
                throw new Error("JSON.stringify")
            }
            return str("", {
                "": value
            })
        }
    }
    if (typeof JSON.parse !== "function") {
        JSON.parse = function(text, reviver) {
            var j;

            function walk(holder, key) {
                var k, v, value = holder[key];
                if (value && typeof value === "object") {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v
                            } else {
                                delete value[k]
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value)
            }
            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function(a) {
                    return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
                })
            }
            if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
                j = eval("(" + text + ")");
                return typeof reviver === "function" ? walk({
                    "": j
                }, "") : j
            }
            throw new SyntaxError("JSON.parse")
        }
    }
}());
if (window.easyXDM == null && !JSONP.sameHost()) {
    (function(ag, aR, aF, aj, aK, am) {
        var aT = this;
        var aH = Math.floor(Math.random() * 10000);
        var aE = Function.prototype;
        var ad = /^((http.?:)\/\/([^:\/\s]+)(:\d+)*)/;
        var ac = /[\-\w]+\/\.\.\//;
        var ao = /([^:])\/\//g;
        var al = "";
        var aG = {};
        var ah = ag.easyXDM;
        var Z = "easyXDM_";
        var ap;
        var aw = false;
        var aM;
        var aN;

        function ar(c, a) {
            var b = typeof c[a];
            return b == "function" || (!!(b == "object" && c[a])) || b == "unknown"
        }

        function aA(b, a) {
            return !!(typeof(b[a]) == "object" && b[a])
        }

        function aD(a) {
            return Object.prototype.toString.call(a) === "[object Array]"
        }

        function aS() {
            var f = "Shockwave Flash",
                a = "application/x-shockwave-flash";
            if (!aB(navigator.plugins) && typeof navigator.plugins[f] == "object") {
                var c = navigator.plugins[f].description;
                if (c && !aB(navigator.mimeTypes) && navigator.mimeTypes[a] && navigator.mimeTypes[a].enabledPlugin) {
                    aM = c.match(/\d+/g)
                }
            }
            if (!aM) {
                var g;
                try {
                    g = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
                    aM = Array.prototype.slice.call(g.GetVariable("$version").match(/(\d+),(\d+),(\d+),(\d+)/), 1);
                    g = null
                } catch (b) {}
            }
            if (!aM) {
                return false
            }
            var h = parseInt(aM[0], 10),
                d = parseInt(aM[1], 10);
            aN = h > 9 && d > 0;
            return true
        }
        var az, ax;
        if (ar(ag, "addEventListener")) {
            az = function(a, c, b) {
                a.addEventListener(c, b, false)
            };
            ax = function(a, c, b) {
                a.removeEventListener(c, b, false)
            }
        } else {
            if (ar(ag, "attachEvent")) {
                az = function(c, a, b) {
                    c.attachEvent("on" + a, b)
                };
                ax = function(c, a, b) {
                    c.detachEvent("on" + a, b)
                }
            } else {
                throw new Error("Browser not supported")
            }
        }
        var X = false,
            ak = [],
            ai;
        if ("readyState" in aR) {
            ai = aR.readyState;
            X = ai == "complete" || (~navigator.userAgent.indexOf("AppleWebKit/") && (ai == "loaded" || ai == "interactive"))
        } else {
            X = !!aR.body
        }

        function aC() {
            if (X) {
                return
            }
            X = true;
            for (var a = 0; a < ak.length; a++) {
                ak[a]()
            }
            ak.length = 0
        }
        if (!X) {
            if (ar(ag, "addEventListener")) {
                az(aR, "DOMContentLoaded", aC)
            } else {
                az(aR, "readystatechange", function() {
                    if (aR.readyState == "complete") {
                        aC()
                    }
                });
                if (aR.documentElement.doScroll && ag === top) {
                    var aO = function() {
                        if (X) {
                            return
                        }
                        try {
                            aR.documentElement.doScroll("left")
                        } catch (a) {
                            aj(aO, 1);
                            return
                        }
                        aC()
                    };
                    aO()
                }
            }
            az(ag, "load", aC)
        }

        function an(a, b) {
            if (X) {
                a.call(b);
                return
            }
            ak.push(function() {
                a.call(b)
            })
        }

        function aI() {
            var a = parent;
            if (al !== "") {
                for (var c = 0, b = al.split("."); c < b.length; c++) {
                    a = a[b[c]]
                }
            }
            return a.easyXDM
        }

        function aQ(a) {
            ag.easyXDM = ah;
            al = a;
            if (al) {
                Z = "easyXDM_" + al.replace(".", "_") + "_"
            }
            return aG
        }

        function av(a) {
            return a.match(ad)[3]
        }

        function aP(a) {
            return a.match(ad)[4] || ""
        }

        function aL(c) {
            var f = c.toLowerCase().match(ad);
            var b = f[2],
                a = f[3],
                d = f[4] || "";
            if ((b == "http:" && d == ":80") || (b == "https:" && d == ":443")) {
                d = ""
            }
            return b + "//" + a + d
        }

        function at(b) {
            b = b.replace(ao, "$1/");
            if (!b.match(/^(http||https):\/\//)) {
                var a = (b.substring(0, 1) === "/") ? "" : aF.pathname;
                if (a.substring(a.length - 1) !== "/") {
                    a = a.substring(0, a.lastIndexOf("/") + 1)
                }
                b = aF.protocol + "//" + aF.host + a + b
            }
            while (ac.test(b)) {
                b = b.replace(ac, "")
            }
            return b
        }

        function ae(g, d) {
            var a = "",
                c = g.indexOf("#");
            if (c !== -1) {
                a = g.substring(c);
                g = g.substring(0, c)
            }
            var b = [];
            for (var f in d) {
                if (d.hasOwnProperty(f)) {
                    b.push(f + "=" + am(d[f]))
                }
            }
            return g + (aw ? "#" : (g.indexOf("?") == -1 ? "?" : "&")) + b.join("&") + a
        }
        var ab = (function(d) {
            d = d.substring(1).split("&");
            var b = {},
                a, c = d.length;
            while (c--) {
                a = d[c].split("=");
                b[a[0]] = aK(a[1])
            }
            return b
        }(/xdm_e=/.test(aF.search) ? aF.search : aF.hash));

        function aB(a) {
            return typeof a === "undefined"
        }
        var af = function() {
            var b = {};
            var a = {
                    a: [1, 2, 3]
                },
                c = '{"a":[1,2,3]}';
            if (typeof JSON != "undefined" && typeof JSON.stringify === "function" && JSON.stringify(a).replace((/\s/g), "") === c) {
                return JSON
            }
            if (Object.toJSON) {
                if (Object.toJSON(a).replace((/\s/g), "") === c) {
                    b.stringify = Object.toJSON
                }
            }
            if (typeof String.prototype.evalJSON === "function") {
                a = c.evalJSON();
                if (a.a && a.a.length === 3 && a.a[2] === 3) {
                    b.parse = function(d) {
                        return d.evalJSON()
                    }
                }
            }
            if (b.stringify && b.parse) {
                af = function() {
                    return b
                };
                return b
            }
            return null
        };

        function aa(f, d, c) {
            var a;
            for (var b in d) {
                if (d.hasOwnProperty(b)) {
                    if (b in f) {
                        a = d[b];
                        if (typeof a === "object") {
                            aa(f[b], a, c)
                        } else {
                            if (!c) {
                                f[b] = d[b]
                            }
                        }
                    } else {
                        f[b] = d[b]
                    }
                }
            }
            return f
        }

        function aU() {
            var a = aR.body.appendChild(aR.createElement("form")),
                b = a.appendChild(aR.createElement("input"));
            b.name = Z + "TEST" + aH;
            ap = b !== a.elements[b.name];
            aR.body.removeChild(a)
        }

        function au(f) {
            if (aB(ap)) {
                aU()
            }
            var a;
            if (ap) {
                a = aR.createElement('<iframe name="' + f.props.name + '"/>')
            } else {
                a = aR.createElement("IFRAME");
                a.name = f.props.name
            }
            a.id = a.name = f.props.name;
            delete f.props.name;
            if (typeof f.container == "string") {
                f.container = aR.getElementById(f.container)
            }
            if (!f.container) {
                aa(a.style, {
                    position: "absolute",
                    top: "-2000px",
                    left: "0px"
                });
                f.container = aR.body
            }
            var b = f.props.src;
            f.props.src = "javascript:false";
            aa(a, f.props);
            a.border = a.frameBorder = 0;
            a.allowTransparency = true;
            f.container.appendChild(a);
            if (f.onLoad) {
                az(a, "load", f.onLoad)
            }
            if (f.usePost) {
                var d = f.container.appendChild(aR.createElement("form")),
                    g;
                d.target = a.name;
                d.action = b;
                d.method = "POST";
                if (typeof(f.usePost) === "object") {
                    for (var c in f.usePost) {
                        if (f.usePost.hasOwnProperty(c)) {
                            if (ap) {
                                g = aR.createElement('<input name="' + c + '"/>')
                            } else {
                                g = aR.createElement("INPUT");
                                g.name = c
                            }
                            g.value = f.usePost[c];
                            d.appendChild(g)
                        }
                    }
                }
                d.submit();
                d.parentNode.removeChild(d)
            } else {
                a.src = b
            }
            f.props.src = b;
            return a
        }

        function Y(b, a) {
            if (typeof b == "string") {
                b = [b]
            }
            var c, d = b.length;
            while (d--) {
                c = b[d];
                c = new RegExp(c.substr(0, 1) == "^" ? c : ("^" + c.replace(/(\*)/g, ".$1").replace(/\?/g, ".") + "$"));
                if (c.test(a)) {
                    return true
                }
            }
            return false
        }

        function aJ(g) {
            var a = g.protocol,
                h;
            g.isHost = g.isHost || aB(ab.xdm_p);
            aw = g.hash || false;
            if (!g.props) {
                g.props = {}
            }
            if (!g.isHost) {
                g.channel = ab.xdm_c.replace(/["'<>\\]/g, "");
                g.secret = ab.xdm_s;
                g.remote = ab.xdm_e.replace(/["'<>\\]/g, "");
                a = ab.xdm_p;
                if (g.acl && !Y(g.acl, g.remote)) {
                    throw new Error("Access denied for " + g.remote)
                }
            } else {
                g.remote = at(g.remote);
                g.channel = g.channel || "default" + aH++;
                g.secret = Math.random().toString(16).substring(2);
                if (aB(a)) {
                    if (aL(aF.href) == aL(g.remote)) {
                        a = "4"
                    } else {
                        if (ar(ag, "postMessage") || ar(aR, "postMessage")) {
                            a = "1"
                        } else {
                            if (g.swf && ar(ag, "ActiveXObject") && aS()) {
                                a = "6"
                            } else {
                                if (navigator.product === "Gecko" && "frameElement" in ag && navigator.userAgent.indexOf("WebKit") == -1) {
                                    a = "5"
                                } else {
                                    if (g.remoteHelper) {
                                        a = "2"
                                    } else {
                                        a = "0"
                                    }
                                }
                            }
                        }
                    }
                }
            }
            g.protocol = a;
            switch (a) {
                case "0":
                    aa(g, {
                        interval: 100,
                        delay: 2000,
                        useResize: true,
                        useParent: false,
                        usePolling: false
                    }, true);
                    if (g.isHost) {
                        if (!g.local) {
                            var c = aF.protocol + "//" + aF.host,
                                i = aR.body.getElementsByTagName("img"),
                                b;
                            var f = i.length;
                            while (f--) {
                                b = i[f];
                                if (b.src.substring(0, c.length) === c) {
                                    g.local = b.src;
                                    break
                                }
                            }
                            if (!g.local) {
                                g.local = ag
                            }
                        }
                        var d = {
                            xdm_c: g.channel,
                            xdm_p: 0
                        };
                        if (g.local === ag) {
                            g.usePolling = true;
                            g.useParent = true;
                            g.local = aF.protocol + "//" + aF.host + aF.pathname + aF.search;
                            d.xdm_e = g.local;
                            d.xdm_pa = 1
                        } else {
                            d.xdm_e = at(g.local)
                        }
                        if (g.container) {
                            g.useResize = false;
                            d.xdm_po = 1
                        }
                        g.remote = ae(g.remote, d)
                    } else {
                        aa(g, {
                            channel: ab.xdm_c,
                            remote: ab.xdm_e,
                            useParent: !aB(ab.xdm_pa),
                            usePolling: !aB(ab.xdm_po),
                            useResize: g.useParent ? false : g.useResize
                        })
                    }
                    h = [new aG.stack.HashTransport(g), new aG.stack.ReliableBehavior({}), new aG.stack.QueueBehavior({
                        encode: true,
                        maxLength: 4000 - g.remote.length
                    }), new aG.stack.VerifyBehavior({
                        initiate: g.isHost
                    })];
                    break;
                case "1":
                    h = [new aG.stack.PostMessageTransport(g)];
                    break;
                case "2":
                    g.remoteHelper = at(g.remoteHelper);
                    h = [new aG.stack.NameTransport(g), new aG.stack.QueueBehavior(), new aG.stack.VerifyBehavior({
                        initiate: g.isHost
                    })];
                    break;
                case "3":
                    h = [new aG.stack.NixTransport(g)];
                    break;
                case "4":
                    h = [new aG.stack.SameOriginTransport(g)];
                    break;
                case "5":
                    h = [new aG.stack.FrameElementTransport(g)];
                    break;
                case "6":
                    if (!aM) {
                        aS()
                    }
                    h = [new aG.stack.FlashTransport(g)];
                    break
            }
            h.push(new aG.stack.QueueBehavior({
                lazy: g.lazy,
                remove: true
            }));
            return h
        }

        function aq(c) {
            var a, b = {
                incoming: function(g, h) {
                    this.up.incoming(g, h)
                },
                outgoing: function(h, g) {
                    this.down.outgoing(h, g)
                },
                callback: function(g) {
                    this.up.callback(g)
                },
                init: function() {
                    this.down.init()
                },
                destroy: function() {
                    this.down.destroy()
                }
            };
            for (var d = 0, f = c.length; d < f; d++) {
                a = c[d];
                aa(a, b, true);
                if (d !== 0) {
                    a.down = c[d - 1]
                }
                if (d !== f - 1) {
                    a.up = c[d + 1]
                }
            }
            return a
        }

        function ay(a) {
            a.up.down = a.down;
            a.down.up = a.up;
            a.up = a.down = null
        }
        aa(aG, {
            version: "2.4.16.3",
            query: ab,
            stack: {},
            apply: aa,
            getJSONObject: af,
            whenReady: an,
            noConflict: aQ
        });
        aG.DomHelper = {
            on: az,
            un: ax,
            requiresJSON: function(a) {
                if (!aA(ag, "JSON")) {
                    aR.write('<script type="text/javascript" src="' + a + '"><\/script>')
                }
            }
        };
        (function() {
            var a = {};
            aG.Fn = {
                set: function(c, b) {
                    a[c] = b
                },
                get: function(c, d) {
                    var b = a[c];
                    if (d) {
                        delete a[c]
                    }
                    return b
                }
            }
        }());
        aG.Socket = function(b) {
            var c = aq(aJ(b).concat([{
                    incoming: function(d, f) {
                        b.onMessage(d, f)
                    },
                    callback: function(d) {
                        if (b.onReady) {
                            b.onReady(d)
                        }
                    }
                }])),
                a = aL(b.remote);
            this.origin = aL(b.remote);
            this.destroy = function() {
                c.destroy()
            };
            this.postMessage = function(d) {
                c.outgoing(d, a)
            };
            c.init()
        };
        aG.Rpc = function(c, d) {
            if (d.local) {
                for (var a in d.local) {
                    if (d.local.hasOwnProperty(a)) {
                        var b = d.local[a];
                        if (typeof b === "function") {
                            d.local[a] = {
                                method: b
                            }
                        }
                    }
                }
            }
            var f = aq(aJ(c).concat([new aG.stack.RpcBehavior(this, d), {
                callback: function(g) {
                    if (c.onReady) {
                        c.onReady(g)
                    }
                }
            }]));
            this.origin = aL(c.remote);
            this.destroy = function() {
                f.destroy()
            };
            f.init()
        };
        aG.stack.SameOriginTransport = function(d) {
            var c, a, b, f;
            return (c = {
                outgoing: function(h, g, i) {
                    b(h);
                    if (i) {
                        i()
                    }
                },
                destroy: function() {
                    if (a) {
                        a.parentNode.removeChild(a);
                        a = null
                    }
                },
                onDOMReady: function() {
                    f = aL(d.remote);
                    if (d.isHost) {
                        aa(d.props, {
                            src: ae(d.remote, {
                                xdm_e: aF.protocol + "//" + aF.host + aF.pathname,
                                xdm_c: d.channel,
                                xdm_p: 4
                            }),
                            name: Z + d.channel + "_provider"
                        });
                        a = au(d);
                        aG.Fn.set(d.channel, function(g) {
                            b = g;
                            aj(function() {
                                c.up.callback(true)
                            }, 0);
                            return function(h) {
                                c.up.incoming(h, f)
                            }
                        })
                    } else {
                        b = aI().Fn.get(d.channel, true)(function(g) {
                            c.up.incoming(g, f)
                        });
                        aj(function() {
                            c.up.callback(true)
                        }, 0)
                    }
                },
                init: function() {
                    an(c.onDOMReady, c)
                }
            })
        };
        aG.stack.FlashTransport = function(a) {
            var i, d, j, h, c, g;

            function f(k, l) {
                aj(function() {
                    i.up.incoming(k, h)
                }, 0)
            }

            function b(l) {
                var m = a.swf + "?host=" + a.isHost;
                var n = "easyXDM_swf_" + Math.floor(Math.random() * 10000);
                aG.Fn.set("flash_loaded" + l.replace(/[\-.]/g, "_"), function() {
                    aG.stack.FlashTransport[l].swf = c = g.firstChild;
                    var p = aG.stack.FlashTransport[l].queue;
                    for (var o = 0; o < p.length; o++) {
                        p[o]()
                    }
                    p.length = 0
                });
                if (a.swfContainer) {
                    g = (typeof a.swfContainer == "string") ? aR.getElementById(a.swfContainer) : a.swfContainer
                } else {
                    g = aR.createElement("div");
                    aa(g.style, aN && a.swfNoThrottle ? {
                        height: "20px",
                        width: "20px",
                        position: "fixed",
                        right: 0,
                        top: 0
                    } : {
                        height: "1px",
                        width: "1px",
                        position: "absolute",
                        overflow: "hidden",
                        right: 0,
                        top: 0
                    });
                    aR.body.appendChild(g)
                }
                var k = "callback=flash_loaded" + l.replace(/[\-.]/g, "_") + "&proto=" + aT.location.protocol + "&domain=" + av(aT.location.href) + "&port=" + aP(aT.location.href) + "&ns=" + al;
                g.innerHTML = "<object height='20' width='20' type='application/x-shockwave-flash' id='" + n + "' data='" + m + "'><param name='allowScriptAccess' value='always'></param><param name='wmode' value='transparent'><param name='movie' value='" + m + "'></param><param name='flashvars' value='" + k + "'></param><embed type='application/x-shockwave-flash' FlashVars='" + k + "' allowScriptAccess='always' wmode='transparent' src='" + m + "' height='1' width='1'></embed></object>"
            }
            return (i = {
                outgoing: function(l, k, m) {
                    c.postMessage(a.channel, l.toString());
                    if (m) {
                        m()
                    }
                },
                destroy: function() {
                    try {
                        c.destroyChannel(a.channel)
                    } catch (k) {}
                    c = null;
                    if (d) {
                        d.parentNode.removeChild(d);
                        d = null
                    }
                },
                onDOMReady: function() {
                    h = a.remote;
                    aG.Fn.set("flash_" + a.channel + "_init", function() {
                        aj(function() {
                            i.up.callback(true)
                        })
                    });
                    aG.Fn.set("flash_" + a.channel + "_onMessage", f);
                    a.swf = at(a.swf);
                    var k = av(a.swf);
                    var l = function() {
                        aG.stack.FlashTransport[k].init = true;
                        c = aG.stack.FlashTransport[k].swf;
                        c.createChannel(a.channel, a.secret, aL(a.remote), a.isHost);
                        if (a.isHost) {
                            if (aN && a.swfNoThrottle) {
                                aa(a.props, {
                                    position: "fixed",
                                    right: 0,
                                    top: 0,
                                    height: "20px",
                                    width: "20px"
                                })
                            }
                            aa(a.props, {
                                src: ae(a.remote, {
                                    xdm_e: aL(aF.href),
                                    xdm_c: a.channel,
                                    xdm_p: 6,
                                    xdm_s: a.secret
                                }),
                                name: Z + a.channel + "_provider"
                            });
                            d = au(a)
                        }
                    };
                    if (aG.stack.FlashTransport[k] && aG.stack.FlashTransport[k].init) {
                        l()
                    } else {
                        if (!aG.stack.FlashTransport[k]) {
                            aG.stack.FlashTransport[k] = {
                                queue: [l]
                            };
                            b(k)
                        } else {
                            aG.stack.FlashTransport[k].queue.push(l)
                        }
                    }
                },
                init: function() {
                    an(i.onDOMReady, i)
                }
            })
        };
        aG.stack.PostMessageTransport = function(f) {
            var b, a, g, d;

            function h(i) {
                if (i.origin) {
                    return aL(i.origin)
                }
                if (i.uri) {
                    return aL(i.uri)
                }
                if (i.domain) {
                    return aF.protocol + "//" + i.domain
                }
                throw "Unable to retrieve the origin of the event"
            }

            function c(i) {
                var j = h(i);
                if (j == d && i.data.substring(0, f.channel.length + 1) == f.channel + " ") {
                    b.up.incoming(i.data.substring(f.channel.length + 1), j)
                }
            }
            return (b = {
                outgoing: function(j, i, k) {
                    g.postMessage(f.channel + " " + j, i || d);
                    if (k) {
                        k()
                    }
                },
                destroy: function() {
                    ax(ag, "message", c);
                    if (a) {
                        g = null;
                        a.parentNode.removeChild(a);
                        a = null
                    }
                },
                onDOMReady: function() {
                    d = aL(f.remote);
                    if (f.isHost) {
                        var i = function(j) {
                            if (j.data == f.channel + "-ready") {
                                g = ("postMessage" in a.contentWindow) ? a.contentWindow : a.contentWindow.document;
                                ax(ag, "message", i);
                                az(ag, "message", c);
                                aj(function() {
                                    b.up.callback(true)
                                }, 0)
                            }
                        };
                        az(ag, "message", i);
                        aa(f.props, {
                            src: ae(f.remote, {
                                xdm_e: aL(aF.href),
                                xdm_c: f.channel,
                                xdm_p: 1
                            }),
                            name: Z + f.channel + "_provider"
                        });
                        a = au(f)
                    } else {
                        az(ag, "message", c);
                        g = ("postMessage" in ag.parent) ? ag.parent : ag.parent.document;
                        g.postMessage(f.channel + "-ready", d);
                        aj(function() {
                            b.up.callback(true)
                        }, 0)
                    }
                },
                init: function() {
                    an(b.onDOMReady, b)
                }
            })
        };
        aG.stack.FrameElementTransport = function(d) {
            var c, a, b, f;
            return (c = {
                outgoing: function(h, g, i) {
                    b.call(this, h);
                    if (i) {
                        i()
                    }
                },
                destroy: function() {
                    if (a) {
                        a.parentNode.removeChild(a);
                        a = null
                    }
                },
                onDOMReady: function() {
                    f = aL(d.remote);
                    if (d.isHost) {
                        aa(d.props, {
                            src: ae(d.remote, {
                                xdm_e: aL(aF.href),
                                xdm_c: d.channel,
                                xdm_p: 5
                            }),
                            name: Z + d.channel + "_provider"
                        });
                        a = au(d);
                        a.fn = function(g) {
                            delete a.fn;
                            b = g;
                            aj(function() {
                                c.up.callback(true)
                            }, 0);
                            return function(h) {
                                c.up.incoming(h, f)
                            }
                        }
                    } else {
                        if (aR.referrer && aL(aR.referrer) != ab.xdm_e) {
                            ag.top.location = ab.xdm_e
                        }
                        b = ag.frameElement.fn(function(g) {
                            c.up.incoming(g, f)
                        });
                        c.up.callback(true)
                    }
                },
                init: function() {
                    an(c.onDOMReady, c)
                }
            })
        };
        aG.stack.NameTransport = function(n) {
            var m;
            var k, g, a, i, h, c, d;

            function j(o) {
                var p = n.remoteHelper + (k ? "#_3" : "#_2") + n.channel;
                g.contentWindow.sendMessage(o, p)
            }

            function l() {
                if (k) {
                    if (++i === 2 || !k) {
                        m.up.callback(true)
                    }
                } else {
                    j("ready");
                    m.up.callback(true)
                }
            }

            function f(o) {
                m.up.incoming(o, c)
            }

            function b() {
                if (h) {
                    aj(function() {
                        h(true)
                    }, 0)
                }
            }
            return (m = {
                outgoing: function(p, o, q) {
                    h = q;
                    j(p)
                },
                destroy: function() {
                    g.parentNode.removeChild(g);
                    g = null;
                    if (k) {
                        a.parentNode.removeChild(a);
                        a = null
                    }
                },
                onDOMReady: function() {
                    k = n.isHost;
                    i = 0;
                    c = aL(n.remote);
                    n.local = at(n.local);
                    if (k) {
                        aG.Fn.set(n.channel, function(p) {
                            if (k && p === "ready") {
                                aG.Fn.set(n.channel, f);
                                l()
                            }
                        });
                        d = ae(n.remote, {
                            xdm_e: n.local,
                            xdm_c: n.channel,
                            xdm_p: 2
                        });
                        aa(n.props, {
                            src: d + "#" + n.channel,
                            name: Z + n.channel + "_provider"
                        });
                        a = au(n)
                    } else {
                        n.remoteHelper = n.remote;
                        aG.Fn.set(n.channel, f)
                    }
                    var o = function() {
                        var q = g || this;
                        ax(q, "load", o);
                        aG.Fn.set(n.channel + "_load", b);
                        (function p() {
                            if (typeof q.contentWindow.sendMessage == "function") {
                                l()
                            } else {
                                aj(p, 50)
                            }
                        }())
                    };
                    g = au({
                        props: {
                            src: n.local + "#_4" + n.channel
                        },
                        onLoad: o
                    })
                },
                init: function() {
                    an(m.onDOMReady, m)
                }
            })
        };
        aG.stack.HashTransport = function(b) {
            var p;
            var k = this,
                m, a, d, o, f, q, g;
            var l, c;

            function h(r) {
                if (!g) {
                    return
                }
                var s = b.remote + "#" + (f++) + "_" + r;
                ((m || !l) ? g.contentWindow : g).location = s
            }

            function n(r) {
                o = r;
                p.up.incoming(o.substring(o.indexOf("_") + 1), c)
            }

            function i() {
                if (!q) {
                    return
                }
                var t = q.location.href,
                    r = "",
                    s = t.indexOf("#");
                if (s != -1) {
                    r = t.substring(s)
                }
                if (r && r != o) {
                    n(r)
                }
            }

            function j() {
                a = setInterval(i, d)
            }
            return (p = {
                outgoing: function(s, r) {
                    h(s)
                },
                destroy: function() {
                    ag.clearInterval(a);
                    if (m || !l) {
                        g.parentNode.removeChild(g)
                    }
                    g = null
                },
                onDOMReady: function() {
                    m = b.isHost;
                    d = b.interval;
                    o = "#" + b.channel;
                    f = 0;
                    l = b.useParent;
                    c = aL(b.remote);
                    if (m) {
                        aa(b.props, {
                            src: b.remote,
                            name: Z + b.channel + "_provider"
                        });
                        if (l) {
                            b.onLoad = function() {
                                q = ag;
                                j();
                                p.up.callback(true)
                            }
                        } else {
                            var r = 0,
                                t = b.delay / 50;
                            (function s() {
                                if (++r > t) {
                                    throw new Error("Unable to reference listenerwindow")
                                }
                                try {
                                    q = g.contentWindow.frames[Z + b.channel + "_consumer"]
                                } catch (u) {}
                                if (q) {
                                    j();
                                    p.up.callback(true)
                                } else {
                                    aj(s, 50)
                                }
                            }())
                        }
                        g = au(b)
                    } else {
                        q = ag;
                        j();
                        if (l) {
                            g = parent;
                            p.up.callback(true)
                        } else {
                            aa(b, {
                                props: {
                                    src: b.remote + "#" + b.channel + new Date(),
                                    name: Z + b.channel + "_consumer"
                                },
                                onLoad: function() {
                                    p.up.callback(true)
                                }
                            });
                            g = au(b)
                        }
                    }
                },
                init: function() {
                    an(p.onDOMReady, p)
                }
            })
        };
        aG.stack.ReliableBehavior = function(f) {
            var d, a;
            var b = 0,
                g = 0,
                c = "";
            return (d = {
                incoming: function(i, k) {
                    var j = i.indexOf("_"),
                        h = i.substring(0, j).split(",");
                    i = i.substring(j + 1);
                    if (h[0] == b) {
                        c = "";
                        if (a) {
                            a(true);
                            a = null
                        }
                    }
                    if (i.length > 0) {
                        d.down.outgoing(h[1] + "," + b + "_" + c, k);
                        if (g != h[1]) {
                            g = h[1];
                            d.up.incoming(i, k)
                        }
                    }
                },
                outgoing: function(h, j, i) {
                    c = h;
                    a = i;
                    d.down.outgoing(g + "," + (++b) + "_" + h, j)
                }
            })
        };
        aG.stack.QueueBehavior = function(b) {
            var j, i = [],
                f = true,
                a = "",
                g, d = 0,
                c = false,
                k = false;

            function h() {
                if (b.remove && i.length === 0) {
                    ay(j);
                    return
                }
                if (f || i.length === 0 || g) {
                    return
                }
                f = true;
                var l = i.shift();
                j.down.outgoing(l.data, l.origin, function(m) {
                    f = false;
                    if (l.callback) {
                        aj(function() {
                            l.callback(m)
                        }, 0)
                    }
                    h()
                })
            }
            return (j = {
                init: function() {
                    if (aB(b)) {
                        b = {}
                    }
                    if (b.maxLength) {
                        d = b.maxLength;
                        k = true
                    }
                    if (b.lazy) {
                        c = true
                    } else {
                        j.down.init()
                    }
                },
                callback: function(l) {
                    f = false;
                    var m = j.up;
                    h();
                    m.callback(l)
                },
                incoming: function(n, l) {
                    if (k) {
                        var o = n.indexOf("_"),
                            m = parseInt(n.substring(0, o), 10);
                        a += n.substring(o + 1);
                        if (m === 0) {
                            if (b.encode) {
                                a = aK(a)
                            }
                            j.up.incoming(a, l);
                            a = ""
                        }
                    } else {
                        j.up.incoming(n, l)
                    }
                },
                outgoing: function(n, l, o) {
                    if (b.encode) {
                        n = am(n)
                    }
                    var m = [],
                        p;
                    if (k) {
                        while (n.length !== 0) {
                            p = n.substring(0, d);
                            n = n.substring(p.length);
                            m.push(p)
                        }
                        while ((p = m.shift())) {
                            i.push({
                                data: m.length + "_" + p,
                                origin: l,
                                callback: m.length === 0 ? o : null
                            })
                        }
                    } else {
                        i.push({
                            data: n,
                            origin: l,
                            callback: o
                        })
                    }
                    if (c) {
                        j.down.init()
                    } else {
                        h()
                    }
                },
                destroy: function() {
                    g = true;
                    j.down.destroy()
                }
            })
        };
        aG.stack.VerifyBehavior = function(b) {
            var a, d, f, c = false;

            function g() {
                d = Math.random().toString(16).substring(2);
                a.down.outgoing(d)
            }
            return (a = {
                incoming: function(h, j) {
                    var i = h.indexOf("_");
                    if (i === -1) {
                        if (h === d) {
                            a.up.callback(true)
                        } else {
                            if (!f) {
                                f = h;
                                if (!b.initiate) {
                                    g()
                                }
                                a.down.outgoing(h)
                            }
                        }
                    } else {
                        if (h.substring(0, i) === f) {
                            a.up.incoming(h.substring(i + 1), j)
                        }
                    }
                },
                outgoing: function(h, j, i) {
                    a.down.outgoing(d + "_" + h, j, i)
                },
                callback: function(h) {
                    if (b.initiate) {
                        g()
                    }
                }
            })
        };
        aG.stack.RpcBehavior = function(h, c) {
            var a, f = c.serializer || af();
            var g = 0,
                i = {};

            function d(k) {
                k.jsonrpc = "2.0";
                a.down.outgoing(f.stringify(k))
            }

            function j(m, k) {
                var l = Array.prototype.slice;
                return function() {
                    var p = arguments.length,
                        n, o = {
                            method: k
                        };
                    if (p > 0 && typeof arguments[p - 1] === "function") {
                        if (p > 1 && typeof arguments[p - 2] === "function") {
                            n = {
                                success: arguments[p - 2],
                                error: arguments[p - 1]
                            };
                            o.params = l.call(arguments, 0, p - 2)
                        } else {
                            n = {
                                success: arguments[p - 1]
                            };
                            o.params = l.call(arguments, 0, p - 1)
                        }
                        i["" + (++g)] = n;
                        o.id = g
                    } else {
                        o.params = l.call(arguments, 0)
                    }
                    if (m.namedParams && o.params.length === 1) {
                        o.params = o.params[0]
                    }
                    d(o)
                }
            }

            function b(n, o, k, p) {
                if (!k) {
                    if (o) {
                        d({
                            id: o,
                            error: {
                                code: -32601,
                                message: "Procedure not found."
                            }
                        })
                    }
                    return
                }
                var q, l;
                if (o) {
                    q = function(s) {
                        q = aE;
                        d({
                            id: o,
                            result: s
                        })
                    };
                    l = function(u, t) {
                        l = aE;
                        var s = {
                            id: o,
                            error: {
                                code: -32099,
                                message: u
                            }
                        };
                        if (t) {
                            s.error.data = t
                        }
                        d(s)
                    }
                } else {
                    q = l = aE
                }
                if (!aD(p)) {
                    p = [p]
                }
                try {
                    var m = k.method.apply(k.scope, p.concat([q, l]));
                    if (!aB(m)) {
                        q(m)
                    }
                } catch (r) {
                    l(r.message)
                }
            }
            return (a = {
                incoming: function(l, m) {
                    var k = f.parse(l);
                    if (k.method) {
                        if (c.handle) {
                            c.handle(k, d)
                        } else {
                            b(k.method, k.id, c.local[k.method], k.params)
                        }
                    } else {
                        var n = i[k.id];
                        if (k.error) {
                            if (n.error) {
                                n.error(k.error)
                            }
                        } else {
                            if (n.success) {
                                n.success(k.result)
                            }
                        }
                        delete i[k.id]
                    }
                },
                init: function() {
                    if (c.remote) {
                        for (var k in c.remote) {
                            if (c.remote.hasOwnProperty(k)) {
                                h[k] = j(c.remote[k], k)
                            }
                        }
                    }
                    a.down.init()
                },
                destroy: function() {
                    for (var k in c.remote) {
                        if (c.remote.hasOwnProperty(k) && h.hasOwnProperty(k)) {
                            delete h[k]
                        }
                    }
                    a.down.destroy()
                }
            })
        };
        aT.easyXDM = aG
    })(window, document, location, window.setTimeout, decodeURIComponent, encodeURIComponent)
}
Url_Query = JSONP.urlDecode(window.location.search.substr(1));
if (JSONP.sameHost() && parent.ArgaApi) {
    window.arga_rpc = {
        argacomplete: function() {
            parent.ArgaApi.argacomplete()
        }
    }
} else {
    try {
        window.arga_rpc = new easyXDM.Rpc({}, {
            remote: {
                argacomplete: {}
            }
        });
        ARGA_Private_Fns.Report("RPC object successfully instantiated")
    } catch (e) {
        ARGA_Private_Fns.ReportErrorToPx("Error instantiating RPC object: " + e.message)
    }
}
if (window.console == null) {
    console = new Object();
    console.log = new Function()
};