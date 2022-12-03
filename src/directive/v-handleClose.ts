export default {

  mounted(el: Node, binding) {
    function close(e) {
      !el.contains(e.target) && binding.value(e)
    }
    el._vueClose = close
    document.addEventListener('click', close)
  },
  unmounted(el: Node) {
    document.removeEventListener('click', close)
  }

}
