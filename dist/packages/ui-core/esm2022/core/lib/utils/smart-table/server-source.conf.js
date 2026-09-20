export class ServerSourceConf {
    static { this.SORT_FIELD_KEY = 'orderBy'; }
    static { this.SORT_DIR_KEY = 'order'; }
    static { this.PAGER_PAGE_KEY = 'skip'; }
    static { this.PAGER_LIMIT_KEY = 'take'; }
    static { this.FILTER_FIELD_KEY = 'filters'; }
    static { this.TOTAL_KEY = 'total'; }
    static { this.DATA_KEY = 'items'; }
    constructor({ resultMap = null, finalize = null, endPoint = '', sortFieldKey = '', sortDirKey = '', pagerPageKey = '', pagerLimitKey = '', filterFieldKey = '', totalKey = '', dataKey = '', where = '', join = '', relations = [], withDeleted = false, select = {} } = {}) {
        this.endPoint = endPoint ? endPoint : '';
        this.sortFieldKey = sortFieldKey ? sortFieldKey : ServerSourceConf.SORT_FIELD_KEY;
        this.sortDirKey = sortDirKey ? sortDirKey : ServerSourceConf.SORT_DIR_KEY;
        this.pagerPageKey = pagerPageKey ? pagerPageKey : ServerSourceConf.PAGER_PAGE_KEY;
        this.pagerLimitKey = pagerLimitKey ? pagerLimitKey : ServerSourceConf.PAGER_LIMIT_KEY;
        this.filterFieldKey = filterFieldKey ? filterFieldKey : ServerSourceConf.FILTER_FIELD_KEY;
        this.totalKey = totalKey ? totalKey : ServerSourceConf.TOTAL_KEY;
        this.dataKey = dataKey ? dataKey : ServerSourceConf.DATA_KEY;
        this.where = where;
        this.join = join;
        this.relations = relations;
        this.resultMap = resultMap;
        this.finalize = finalize;
        this.withDeleted = withDeleted;
        this.select = select;
    }
}
//# sourceMappingURL=server-source.conf.js.map