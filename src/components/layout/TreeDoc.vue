<template>
  <li class="cf">
    <p @click="expands(model)" >
      <i v-show="model.child && model.child.length !== 0 && !model.show" class="iconhandle">&#xe61a;</i>
      <i v-show="model.child && model.child.length !== 0 && model.show" class="iconhandle">&#xe618;</i>
      {{model.name}}
    </p>
    <p class="fr" v-if="!click">
      <d-button type="text" @click="newCate">新建子节点</d-button>
      <d-button type="text" @click="updateCate">编辑</d-button>
      <d-button type="text" @click="deleteCate">删除</d-button>
    </p>
    <div class="fr box" v-else>
      <d-checkbox v-if="!model.disabled" :checked.sync="model.click" @change="changebox(model)"></d-checkbox>
    </div>
    <ul class="child" v-if="model.show && model.child && model.child.length !== 0">
      <tree-doc :model.sync="child" v-for="(chindex, child) in model.child" :click="click"></tree-doc>
    </ul>
  </li>
</template>

<script>
export default {
  name: 'tree-doc',
  props: {
    model: {
      default: null
    },
    click: {
      default: null
    }
  },
  data() {
    return {
    };
  },
  methods: {
    expands(model) {
      if (model.child.length !== 0) {
        this.$set('model.show', !model.show);
      }
    },
    changebox(model) {
      this.$dispatch('changebox', model);
    },
    /**
     * 批量新建子类目
     * @return {[type]} [description]
     */
    newCate: function() {
      this.$dispatch('configcate', {
        title: '新建子节点',
        param: {
          id: '',
          name: '',
          pname: this.model.name,
          urls: '',
          parentId: this.model.id,
          systemId: ''
        }
      });
    },
    /**
     * 编辑类目
     * @return {[type]} [description]
     */
    updateCate: function() {
      this.$dispatch('configcate', {
        title: '编辑节点',
        model: this.model,
        type: 'edit',
        param: {
          id: this.model.id,
          name: this.model.name,
          urls: this.model.urls,
          parentId: this.model.parentId,
          systemId: ''
        }
      });
    },
    /**
     * 删除类目
     * @return {[type]} [description]
     */
    deleteCate: function() {
      this.$dispatch('deletecate', {
        id: this.model.id
      });
    }
  }
};
</script>
