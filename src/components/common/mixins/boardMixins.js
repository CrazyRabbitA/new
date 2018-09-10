const colorArr = ['#60a4e8', '#2ac993', '#ff5b5b', '#fe8002', '#ffbf55', '#73cfca', '#8291d9'];
export default {
  // ready() {
  //   let el = '';

  //   setTimeout(() => {
  //     el = document.getElementsByClassName('chart-warp-list')[0];
  //     try {
  //       document.getElementsByClassName('cfg-area')[0].style.width = window.getComputedStyle(el, null).width;
  //       this.fixedHeight = window.getComputedStyle(el, null).height.match(/^\d+$/);
  //     } catch (err) {
  //     }
  //   }, 600);
  //   window.addEventListener('resize', () => {
  //     this.isShowWidth = false;
  //     document.getElementsByClassName('cfg-area')[0].style.width = window.getComputedStyle(el, null).width;
  //   });
  // },
  data() {
    return {
      colorArr: colorArr
    };
  }
};
