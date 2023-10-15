<template>
  <div class="on-board-item">
    <el-icon>
      <Check />
    </el-icon>
    <h6 class="text-thin">
      {{ texto }}
    </h6>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Check } from '@element-plus/icons-vue'
import { ElIcon } from 'element-plus'

export default defineComponent({
  name: 'OnBoardItem',
  components: {
    ElIcon,
    Check
  },
  props: {
    /**
     * Texto que será exibido no item
     * @type string
     */
    texto: {
      required: true,
      type: String
    }
  }
})
</script>

<style scoped>
.on-board-item {
  display: flex;
  gap: 16px;
  align-items: center;
  text-align: left;
}

h6 {
  color: var(--grey-70);
  margin: 0;
}
</style>

<style>
.on-board-item .el-icon {
  background: #30B565;
  border-radius: 50%;
  color: white;
}

.on-board-item .el-icon svg {
  padding: 2px;
}
</style>
