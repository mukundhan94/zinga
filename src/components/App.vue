<template>
  <div>
    <v-game @game-over="onGameOver"></v-game>
    <!-- <v-ballcollide></v-ballcollide> -->
    <!-- <v-save v-if="gameResult"></v-save> -->
    <!-- <v-leaderboard></v-leaderboard> -->
  </div>
</template>

<script>
import Game from "./Game.vue";
import BallCollide from "./BallCollide.vue";
import SaveGameRecord from "./SaveGameRecord.vue";
import Leaderboard from "./Leaderboard.vue";

export default {
  components: {
    "v-game": Game,
    "v-save": SaveGameRecord,
    "v-leaderboard": Leaderboard,
    "v-ballcollide":BallCollide
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
