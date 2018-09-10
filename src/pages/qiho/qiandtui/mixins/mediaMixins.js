import ObjectAssign from 'object-assign';

export default {
  data() {
    return {
      appcode: '',
      appval: '',
      appOpt: [
        {
          id: 'appName',
          label: '媒体名称'
        },
        {
          id: 'appId',
          label: '媒体Id'
        }
      ]
    };
  },

  methods: {
    /**
     * 筛选
     */
    mediaFilter: function() {
      this.$loadingRouteData = true;
      this.appfilter();
      this.params.pageNum = 1;
      this.getMediaList(this.params);
    },

    /**
     * 媒体筛选
     */
    appfilter: function() {
      let self = this;
      let app = {
        appName: '',
        appId: ''
      };

      app[self.appcode] = self.appval;

      self.params = ObjectAssign(self.params, app);
    }
  }
};
