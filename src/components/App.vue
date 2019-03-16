<template>
  <div>
    <v-game @game-over="onGameOver"></v-game>
  </div>
</template>
<script>
import Game from "./Game.vue";
import BallCollide from "./BallCollide.vue";
import PICircle from "./PICircle.vue";
export default {
  components: {
    "v-game": Game,
    "v-ballcollide":BallCollide,
    "v-picircle": PICircle
  },
  computed: {
    gameResult() {
      return this.$store.state.gameResult;
    }
  },
  methods: {
    onGameOver(gameResult) {
      this.$store.commit("setGameResult", gameResult);
    }
  }
};
</script>
