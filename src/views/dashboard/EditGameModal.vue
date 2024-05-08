<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <v-card>
      <v-card-title>
        <span class="headline">{{ game.id ? '编辑游戏' : '新增游戏' }}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-img :src="game.coverImage" max-height="200" contain></v-img>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="game.chineseName"
                label="中文名"
                outlined
                dense
                readonly
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="game.englishName"
                label="英文名"
                outlined
                dense
                readonly
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="game.price"
                label="价格"
                type="number"
                outlined
                dense
                readonly
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="game.rating"
                label="评分"
                type="number"
                outlined
                dense
                readonly
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-combobox
                v-model="game.platforms"
                :items="game.platforms"
                label="标签"
                outlined
                dense
                multiple
                chips
                clearable
              >
                <template v-slot:selection="{ attrs, item, select, selected }">
                  <v-chip
                    v-bind="attrs"
                    :input-value="selected"
                    close
                    @click="select"
                    @click:close="removeTag(item)"
                  >
                    {{ item }}
                  </v-chip>
                </template>
              </v-combobox>
            </v-col>
<!--            <v-col cols="12">-->
<!--              <v-textarea-->
<!--                v-model="game.description"-->
<!--                label="详细介绍"-->
<!--                outlined-->
<!--                dense-->
<!--              ></v-textarea>-->
<!--            </v-col>-->
<!--            <v-col cols="12">-->
<!--              <v-menu-->
<!--                v-model="releaseMenu"-->
<!--                :close-on-content-click="false"-->
<!--                :nudge-right="40"-->
<!--                transition="scale-transition"-->
<!--                offset-y-->
<!--                min-width="auto"-->
<!--              >-->
<!--                <template v-slot:activator="{ on, attrs }">-->
<!--                  <v-text-field-->
<!--                    v-model="game.releaseDate"-->
<!--                    label="最早发布日期"-->
<!--                    prepend-icon="mdi-calendar"-->
<!--                    readonly-->
<!--                    v-bind="attrs"-->
<!--                    v-on="on"-->
<!--                    outlined-->
<!--                    dense-->
<!--                  ></v-text-field>-->
<!--                </template>-->
<!--                <v-date-picker-->
<!--                  v-model="game.releaseDate"-->
<!--                  @input="releaseMenu = false"-->
<!--                ></v-date-picker>-->
<!--              </v-menu>-->
<!--            </v-col>-->
<!--            <v-col cols="12">-->
<!--              <v-menu-->
<!--                v-model="chineseReleaseMenu"-->
<!--                :close-on-content-click="false"-->
<!--                :nudge-right="40"-->
<!--                transition="scale-transition"-->
<!--                offset-y-->
<!--                min-width="auto"-->
<!--              >-->
<!--                <template v-slot:activator="{ on, attrs }">-->
<!--                  <v-text-field-->
<!--                    v-model="game.chineseReleaseDate"-->
<!--                    label="中文发布日期"-->
<!--                    prepend-icon="mdi-calendar"-->
<!--                    readonly-->
<!--                    v-bind="attrs"-->
<!--                    v-on="on"-->
<!--                    outlined-->
<!--                    dense-->
<!--                  ></v-text-field>-->
<!--                </template>-->
<!--                <v-date-picker-->
<!--                  v-model="game.chineseReleaseDate"-->
<!--                  @input="chineseReleaseMenu = false"-->
<!--                ></v-date-picker>-->
<!--              </v-menu>-->
<!--            </v-col>-->
<!--            <v-col cols="12">-->
<!--              <v-text-field-->
<!--                v-model="game.developer"-->
<!--                label="开发商"-->
<!--                outlined-->
<!--                dense-->
<!--              ></v-text-field>-->
<!--            </v-col>-->
<!--            <v-col cols="12">-->
<!--              <v-select-->
<!--                v-model="game.languages"-->
<!--                :items="languages"-->
<!--                label="支持语言"-->
<!--                outlined-->
<!--                dense-->
<!--                multiple-->
<!--              ></v-select>-->
<!--            </v-col>-->
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="goBack">
          取消
        </v-btn>
        <v-btn color="blue darken-1" text @click="saveGame">
          保存
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import httpInstance from "@/utils/axios";

export default {
  name: 'EditGameModal',
  props: {
    game: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      dialog: true,
      releaseMenu: false,
      chineseReleaseMenu: false,
      languages: ['English', '中文', 'Français', 'Deutsch', 'Español'],
    };
  },
  methods: {
    saveGame() {
      // this.$emit('save', this.game);
      const formData = new FormData();
      formData.append("game_id",this.game.id);
      formData.append("GameTagList", this.game.platforms)
      httpInstance.post('/manager/CreateOrEditGameDetail/', formData)
        .then(() => {
          this.$emit('close');
        })
        .catch((error) => {
          console.error('Error saving game:', error);
        });
      //刷新
      
    },
    goBack() {
      this.$emit('close');
    },
    removeTag(tag) {
      this.game.tags = this.game.tags.filter(t => t !== tag);
    },
  },
};
</script>
