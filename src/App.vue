
<script >
import { defineComponent, ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export default defineComponent({
    setup() {
        const route = useRoute()
        const layout = computed(() => `layout-${route.meta.layout || 'default'}`.toLowerCase())
        return {
            layout,
        }
    },
})
</script>

<template>
    <div id="app">
        <component :is="layout">
            <router-view />
        </component>
    </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  /* color: #2c3e50; */
  /* margin-top: 60px; */
}
</style>



