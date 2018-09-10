<template>
  <ul class="nav-tabs">
    <li v-for="tab in tabs">
      <a v-link="{ path: tab.url, activeClass: 'active', exact: true }">
        {{{ tab.title }}}
      </a>
    </li>
  </ul>
</template>

<script>
export default {
  props: ['tabs']
};
</script>
