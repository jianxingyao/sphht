<template>
  <div class="dashboard-container">
    <TopCard></TopCard>
    <Sale></Sale>
    <Observe></Observe>
  </div>
</template>

<script>
import TopCard from "./TopCard";
import Sale from "./Sale";
import Observe from './Observe'

export default {
  name: "Dashboard",
  components: {
    TopCard,
    Sale,
    Observe,
  },
};
</script>

<style  scoped>
</style>
