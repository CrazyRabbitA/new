// 媒体
const mediaparams = [
  {
    'chartQueryId': 446,
    'columnList': [
      {
        'alias': 'string',
        'chartQueryId': 0,
        'columnOrder': 0,
        'columnTitle': 'ad_consume',
        'formatType': 0,
        'id': 0,
        'selectType': 0
      }, {
        'alias': 'string',
        'chartQueryId': 0,
        'columnOrder': 0,
        'columnTitle': 'account_type',
        'formatType': 0,
        'id': 0,
        'selectType': 0
      }
    ],
    'dimensionDesc': 'account_type',
    'extDTOS': {
      'chartQueryId': 0,
      'endDateSearchName': 'endDate',
      'startDateSearchName': 'startDate',
      'timeColumnName': 'cur_date',
      'timePeriod': 1
    },
    'kanbanType': 'pie_chart',
    'kanbanName': '媒体账号类型占比',
    'title': 'agentconsume',
    'pageNum': 0,
    'pageSize': 0,
    'search': {
      'startDate': '',
      'endDate': '',
      'app_id': '',
      'slot_id': ''
    },
    'type': 1,
    'order': {'sum(ad_consume)': 'desc'},
    'start': 0,
    'limitNum': 10,
    'iflimit': false
  },
  {
    'chartQueryId': 446,
    'columnList': [
      {
        'alias': 'string',
        'chartQueryId': 0,
        'columnOrder': 0,
        'columnTitle': 'ad_consume',
        'formatType': 0,
        'id': 0,
        'selectType': 0
      },
      {
        'alias': 'string',
        'chartQueryId': 0,
        'columnOrder': 0,
        'columnTitle': 'tag1',
        'formatType': 0,
        'id': 0,
        'selectType': 0
      },
      {
        'alias': 'string',
        'chartQueryId': 0,
        'columnOrder': 0,
        'columnTitle': 'cur_date',
        'formatType': 0,
        'id': 0,
        'selectType': 0
      },
      {
        'alias': 'string',
        'chartQueryId': 0,
        'columnOrder': 0,
        'columnTitle': 'tag2',
        'formatType': 0,
        'id': 0,
        'selectType': 0
      }
    ],
    'dimensionDesc': 'tag1,cur_date,tag2',
    'extDTOS': {
      'chartQueryId': 0,
      'endDateSearchName': 'endDate',
      'startDateSearchName': 'startDate',
      'timeColumnName': 'cur_date',
      'timePeriod': 1
    },
    'kanbanType': 'line_chart',
    'kanbanName': '媒体行业消耗分布',
    'title': 'mediaconsume',
    'order': {'sum(ad_consume)': 'desc'},
    'start': 0,
    'limitNum': 10,
    'iflimit': true,
    'search': {'startDate': '', 'endDate': '', 'app_id': '', 'slot_id': ''},
    'type': 1
  },
  {
    'chartQueryId': 446,
    'columnList': [
      {
        'alias': 'string',
        'chartQueryId': 0,
        'columnOrder': 0,
        'columnTitle': 'ad_consume',
        'formatType': 0,
        'id': 0,
        'selectType': 0
      }, {
        'alias': 'string',
        'chartQueryId': 0,
        'columnOrder': 0,
        'columnTitle': 'app_id',
        'formatType': 0,
        'id': 0,
        'selectType': 0
      }, {
        'alias': 'string',
        'chartQueryId': 0,
        'columnOrder': 0,
        'columnTitle': 'cur_date',
        'formatType': 0,
        'id': 0,
        'selectType': 0
      }, {
        'alias': 'string',
        'chartQueryId': 0,
        'columnOrder': 0,
        'columnTitle': 'app_name',
        'formatType': 0,
        'id': 0,
        'selectType': 0
      }
    ],
    'dimensionDesc': 'app_name,cur_date,app_id',
    'extDTOS': {
      'chartQueryId': 0,
      'endDateSearchName': 'endDate',
      'startDateSearchName': 'startDate',
      'timeColumnName': 'cur_date',
      'timePeriod': 1
    },
    'kanbanType': 'bar_chart',
    'kanbanName': 'KA媒体',
    'title': 'mediainfo',
    'pageNum': 0,
    'pageSize': 0,
    'search': {
      'startDate': '',
      'endDate': '',
      'is_ka': '是',
      'app_id': '',
      'slot_id': ''
    },
    'type': 1,
    'order': {'sum(ad_consume)': 'desc'},
    'start': 0,
    'limitNum': 10,
    'iflimit': false
  }
];

// 广告
const advertparams = [
  {
    'chartQueryId': 461,
    'columnList': [
      {
        'columnTitle': 'consume_total'
      }, {
        'columnTitle': 'account_id'
      }, {
        'columnTitle': 'account_name'
      }, {
        'columnTitle': 'cur_date'
      }
    ],
    'dimensionDesc': 'cur_date,account_name,account_id',
    'extDTOS': {
      'chartQueryId': 0,
      'endDateSearchName': 'endDate',
      'startDateSearchName': 'startDate',
      'timeColumnName': 'cur_date',
      'timePeriod': 1
    },
    'kanbanType': 'bar_chart',
    'kanbanName': 'KA广告主',
    'title': 'topad',
    'pageNum': 0,
    'pageSize': 0,
    'search': {
      'startDate': '',
      'endDate': '',
      'ka_judge': 'ka',
      'app_id': '',
      'slot_id': ''
    },
    'order': {'sum(consume_total)': 'desc'},
    'start': 0,
    'limitNum': 10,
    'iflimit': false,
    'type': 1
  }, {
    'chartQueryId': 461,
    'columnList': [
      {
        'columnTitle': 'consume_total'
      }, {
        'columnTitle': 'first_trade_name'
      }, {
        'columnTitle': 'second_trade_name'
      }, {
        'columnTitle': 'cur_date'
      }
    ],
    'dimensionDesc': 'first_trade_name,second_trade_name,cur_date',
    'extDTOS': {
      'chartQueryId': 0,
      'endDateSearchName': 'endDate',
      'startDateSearchName': 'startDate',
      'timeColumnName': 'cur_date',
      'timePeriod': 1
    },
    'kanbanType': 'line_chart',
    'kanbanName': '广告行业消耗分布',
    'title': 'adconsume',
    'pageNum': 0,
    'pageSize': 0,
    'search': {
      'startDate': '',
      'endDate': '',
      'ka_judge': '',
      'app_id': '',
      'slot_id': ''
    },
    'order': {'sum(consume_total)': 'desc'},
    'start': 0,
    'limitNum': 10,
    'iflimit': true,
    'type': 1
  }
];
// 流量
const flowparams = [
  {
    'chartQueryId': 457,
    'columnList': [
      {
        'columnTitle': 'launch_count'
      }, {
        'columnTitle': 'city'
      }
    ],
    'dimensionDesc': 'city',
    'extDTOS': {
      'chartQueryId': 0,
      'endDateSearchName': 'endDate',
      'startDateSearchName': 'startDate',
      'timeColumnName': 'cur_date',
      'timePeriod': 1
    },
    'kanbanType': 'pie_chart',
    'kanbanName': '地域流量分布-发券',
    'title': 'district',
    'pageNum': 0,
    'pageSize': 0,
    'search': {
      'startDate': '',
      'endDate': '',
      'app_id': '',
      'slot_id': ''
    },
    'order': {'sum(launch_count)': 'desc'},
    'start': 0,
    'limitNum': 20,
    'iflimit': true,
    'type': 1
  }, {
    'chartQueryId': 453,
    'columnList': [
      {
        'columnTitle': 'launch_num'
      }, {
        'columnTitle': 'ua'
      }
    ],
    'dimensionDesc': 'ua',
    'extDTOS': {
      'chartQueryId': 0,
      'endDateSearchName': 'endDate',
      'startDateSearchName': 'startDate',
      'timeColumnName': 'cur_date',
      'timePeriod': 1
    },
    'kanbanType': 'pie_chart',
    'kanbanName': '操作系统分布-发券',
    'title': 'systerm',
    'pageNum': 0,
    'pageSize': 0,
    'search': {
      'startDate': '',
      'endDate': '',
      'app_id': '',
      'slot_id': ''
    },
    'order': {'sum(launch_num)': 'desc'},
    'start': 0,
    'limitNum': 10,
    'iflimit': false,
    'type': 1
  }, {
    'chartQueryId': 458,
    'columnList': [
      {
        'columnTitle': 'price_section'
      }, {
        'columnTitle': 'launch_pv'
      }
    ],
    'dimensionDesc': 'price_section',
    'extDTOS': {
      'chartQueryId': 0,
      'endDateSearchName': 'endDate',
      'startDateSearchName': 'startDate',
      'timeColumnName': 'cur_date',
      'timePeriod': 1
    },
    'kanbanType': 'pie_chart',
    'kanbanName': '设备价值分布-发券',
    'title': 'equip',
    'pageNum': 0,
    'pageSize': 0,
    'search': {
      'startDate': '',
      'endDate': '',
      'app_id': '',
      'slot_id': ''
    },
    'order': {'sum(launch_pv)': 'desc'},
    'start': 0,
    'limitNum': 10,
    'iflimit': false,
    'type': 1
  }, {
    'chartQueryId': 458,
    'columnList': [
      {
        'columnTitle': 'brand_name'
      }, {
        'columnTitle': 'launch_pv'
      }
    ],
    'dimensionDesc': 'brand_name',
    'extDTOS': {
      'chartQueryId': 0,
      'endDateSearchName': 'endDate',
      'startDateSearchName': 'startDate',
      'timeColumnName': 'cur_date',
      'timePeriod': 1
    },
    'kanbanType': 'pie_chart',
    'kanbanName': '手机品牌分布-发券',
    'title': 'phonebrand',
    'pageNum': 0,
    'pageSize': 0,
    'order': {'sum(launch_pv)': 'desc'},
    'start': 0,
    'limitNum': 10,
    'iflimit': true,
    'search': {
      'startDate': '',
      'endDate': '',
      'app_id': '',
      'slot_id': ''
    },
    'type': 1
  }
];
export default {
  mediaparams,
  advertparams,
  flowparams
};
