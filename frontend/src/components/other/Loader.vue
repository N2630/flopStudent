<template>
    <div v-if="isRequired" class="loader-container">
      <div class="loader"></div>
        <p>
        Chargement ...
      </p>
    </div>
</template>

<script>
export default {
  name: 'DesktopSchedule',
  props: {
    isRequired: {
        type: Boolean,
        required: true
    }
  },
};
</script>

<style>
    .loader-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background-color: var(--color-primary);
        padding: 30px 60px;
        border-radius: 16px;
    }

    .loader {
        border: 8px solid #f3f3f3; 
        border-top: 8px solid #3498db;
        border-radius: 50%;
        width: 60px;
        height: 60px;
        animation: spin 1s linear infinite; 
        z-index: 999;
    }

    @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
    }
</style>