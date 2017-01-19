﻿(function () {
    //编辑
    var edit = (function () {
        return {
            editInput: function (editBtn, targetClass) {
                $('body').on('click', '.' + editBtn, function () {
                    var $meeting = $(this).parents('.meeting');
                    $meeting.find('.edit-text').prop('readonly', false).addClass(targetClass);
                    $meeting.find('.mr').prop('readonly', true).prop('disabled', false).addClass(targetClass);
                    $meeting.find('.datetimepicker1').prop('disabled', false).addClass(targetClass);
                    $meeting.find('.save,.cancal,.delete').show();
                });
            },
            saveInput: function (saveBtn, targetClass) {
                $('body').on('click', '.' + saveBtn, function () {
                    var $this = $(this);
                    var date = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate();
                    var h = new Date().getHours(), m = new Date().getMinutes();
                    if (h <= 9) { h = '0' + h; }
                    if (m <= 9) { m = '0' + m };
                    var time = h + ':' + m;
                    var number = 1;
                    $(this).parents('.meeting').find('.edit-text').each(function () {
                        if ($(this).val() == null || $(this).val() == '') {
                            $(this).addClass('shake');
                            number = 0;
                            return false;
                        }
                    })
                    $this.parents('.list-meeting').find('.metting-bg').each(function () {
                        if ($(this).find('.met').val() != '' && $(this).find('.met').val() <= $(this).find('.mst').val()) {
                            $(this).find('.error-show').text('结束时间不能小于开始时间').css('width', '150px').fadeIn().fadeOut(3000);
                            number = 0;
                        }
                        if ($(this).find('.mst').val() != '') {
                            if ($(this).find('.mst').val() <= $(this).prev().find('.met').val() && $(this).find('.met').val() >= $(this).prev().find('.mst').val()) {
                                $(this).find('.error-show').fadeIn().fadeOut(3000);
                                number = 0;
                            }
                        }
                    });
                    //只能选择当天当前时间之后的时间
                    if ($this.parents('.meeting-wrap').find('.date').text() == date) {
                        var $details = $this.parent().siblings('.details')
                        var stime = $details.find('.mst').val(),
                            etime = $details.find('.met').val();
                        if (stime != '' && etime != '') {
                            if (stime < time || etime < time) {
                                $this.parent().prev('.user').find('.error-show').text('您选择的时间已过').css('width', '104px').fadeIn().fadeOut(3000);
                                number = 0;
                                return false;
                            }
                        }
                    }
                    if (number == 1) {
                        //add meeting
                        if ($this.parents('.metting-bg').attr('id') == undefined) {
                            $.ajax({
                                type: "GET",
                                url: $('.lists-wrap').data('url'),
                                data: {
                                    meetingdate: $this.parents('.metting-bg').siblings('.date').text(),
                                    meetingtt: $.trim($this.parents('.bd').siblings('.title').find('.mt').val()),
                                    meetingroom: $this.parent().siblings('.details').find('.mr').val(),
                                    meetingst: $this.parent().siblings('.details').find('.mst').val(),
                                    meetinget: $this.parent().siblings('.details').find('.met').val(),
                                    meetinguser: $.trim($this.parent().siblings('.user').find('.mu').val())
                                },
                                success: function (result) {
                                    $this.parents('.meeting').find('.datetimepicker1').prop('disabled', true).removeClass(targetClass);
                                    $this.parents('.meeting').find('.edit-text').prop('readonly', true).removeClass(targetClass);
                                    $this.hide();
                                    $this.siblings('.cancal,.delete').hide();
                                    location.reload();
                                }
                            });
                        }
                        //edit meeting
                        else {
                            $.ajax({
                                type: "GET",
                                url: $('.lists-wrap').data('url'),
                                data: {
                                    id: $this.parents('.metting-bg').attr('id'),
                                    meetingdate: $this.parents('.metting-bg').siblings('.date').text(),
                                    meetingtt: $this.parents('.bd').siblings('.title').find('.mt').val(),
                                    meetingroom: $this.parent().siblings('.details').find('.mr').val(),
                                    meetingst: $this.parent().siblings('.details').find('.mst').val(),
                                    meetinget: $this.parent().siblings('.details').find('.met').val(),
                                    meetinguser: $this.parent().siblings('.user').find('.mu').val()
                                },
                                success: function (result) {
                                    location.reload();
                                }
                            });
                        }
                    }
                });
            },
            deleteInput: function (deleteBtn) {
                $('body').on('click', '.' + deleteBtn, function () {
                    var $this = $(this);
                    $.ajax({
                        type: "GET",
                        url: $('.lists-wrap').data('delurl'),
                        data: {
                            id: $this.parents('.metting-bg').attr('id')
                        },
                        success: function (result) {
                            $this.parents('.metting-bg').remove();
                        }
                    });
                })
            },
            cancalInput: function (cancalBtn, targetClass) {
                $('body').on('click', '.' + cancalBtn, function () {
                    var $meeting = $(this).parents('.meeting');
                    var $mt = $meeting.find('.mt').data('time');
                    var $mr = $meeting.find('.mr').data('time');
                    var $mst = $meeting.find('.mst').data('time');
                    var $met = $meeting.find('.met').data('time');
                    var $mu = $meeting.find('.mu').data('time');
                    $meeting.find('.mt').val($mt);
                    $meeting.find('.mr').val($mr);
                    $meeting.find('.mst').val($mst);
                    $meeting.find('.met').val($met);
                    $meeting.find('.mu').val($mu);
                    $meeting.find('.edit-text').prop('readonly', true).removeClass(targetClass);
                    $meeting.find('.mr').prop('disabled', true).removeClass(targetClass);
                    $meeting.find('.datetimepicker1').prop('disabled', true).removeClass(targetClass);
                    $meeting.find('.save,.cancal,.delete').hide();
                })
            }
        }
    })()
    edit.editInput('edit', 'focus-input');
    edit.saveInput('save', 'focus-input');
    edit.deleteInput('delete');
    edit.cancalInput('cancal', 'focus-input');
    //增加
    var add = (function () {
        return {
            cancalBtn: function (cancalBtn) {
                $('body').on('click', '.' + cancalBtn, function () {
                    $(this).parent().hide();
                    $(this).parent().prev().show();
                })
            },
            addContent: function (mtAdd) {
                $('body').on('click', '.' + mtAdd, function () {
                    var $mContent = $(this).prev().val();
                    var mettingHtml = "<div class='metting-bg'><div class='meeting new-metting'><div class='title'><input type='text' class='edit-text focus-input mt'  placeholder='会议主题' value=" + $mContent + "></div>";
                    mettingHtml += "<div class='bd'><div class='details clear'><div class='meeting-room'><input type='text' class='edit-text mr focus-input ' placeholder='会议室' readonly value=''/>";
                    mettingHtml += "<ul class='room-list'><li> <a href='javascript:;'>231</a></li></ul ></div>";
                    mettingHtml += "<div class='time-start'><input type='text' class='edit-text focus-input datetimepicker1 mst' value=''  placeholder='开始时间' onclick='$(this).datetimepicker({ datepicker: false, step: 10,format: &quot;H:i&quot})'>";
                    mettingHtml += "</div><div class='line'>--</div>";
                    mettingHtml += "<div class='time-end'><input type='text' class='edit-text focus-input datetimepicker1 met' value=''  placeholder='结束时间' onclick='$(this).datetimepicker({ datepicker: false, step: 10,format: &quot;H:i&quot})'></div></div>";
                    mettingHtml += "<div class='user'><div class='error-show'>时间冲突</div><input type='text' class='edit-text focus-input mu' value='' placeholder='使用人'></div>";
                    mettingHtml += "<div class='handle'><input type='button' class='btn edit' value= '编辑' /><input type='button' class='btn save' value= '保存' /><input type='button' class='btn cancal' value= '取消'/><input type='button' class='btn delete' value= '删除'/></div></div>";
                    $(this).parents('.list-meeting').find('.meeting-wrap').append(mettingHtml);
                    //解决默认添加，点击两次才能出现下拉时间段
                    $('.datetimepicker1').click();
                })
            }
        }
    })()
    add.cancalBtn('cancal-btn');
    add.addContent('metting-add');
    //时间
    var time = (function () {
        return {
            timePeriod: function () {
                $('.datetimepicker1').datetimepicker({
                    datepicker: false,
                    format: 'H:i',
                    step: 10
                });
            }
        }
    })()
    time.timePeriod();
    //下拉菜单
    var select = (function () {
        return {
            showList: function (clickInput) {
                $('body').on('click', '.' + clickInput, function (event) {
                    $(this).next().toggle();
                    event.stopPropagation();
                })
            },
            selectValue: function (selectVal, targetVal) {
                $('body').on('click', '.' + selectVal, function () {
                    var $chooseVal = $(this).text();
                    $(this).parents('.meeting-room').find('.' + targetVal).val($chooseVal);
                    $('.room-list').hide();
                })
            },
            hide: function () {
                $('body').on('click', function () {
                    $('.room-list').hide();
                })
            }
        }
    })();
    select.showList('mr')
    select.selectValue('room-list a', 'mr')
    select.hide();
    //获取页面宽度
    var pageWidth = (function () {
        return {
            pageW: function () {
                var n = $('.list-meeting').length;
                $('.lists-wrap').width(330 * n);
            }
        }
    })()
    pageWidth.pageW();
})()