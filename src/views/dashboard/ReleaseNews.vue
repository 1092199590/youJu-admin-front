<template>
  <v-container id="news-publish" fluid tag="section">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <base-material-card>
          <template v-slot:heading>
            <div class="text-h3 font-weight-light">发布新闻</div>
          </template>

          <v-form>
            <v-container class="py-0">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="newsTitle"
                    label="文章标题"
                    class="purple-input"
                  />
                </v-col>

                <v-col cols="12">
                  <v-file-input
                    v-model="newsCoverImage"
                    label="选择新闻封面图片"
                    class="purple-input"
                  />
                </v-col>

                <v-col cols="12">
                  <v-combobox
                    v-model="newsTags"
                    label="自由标签编辑"
                    multiple
                    chips
                    class="purple-input"
                  />
                </v-col>

                <v-col cols="12">
                  <v-select
                    v-model="fixedTags"
                    :items="fixedTagsList"
                    label="添加固有标签"
                    multiple
                    class="purple-input"
                  />
                </v-col>

                <v-col cols="12">
                  <v-textarea
                    v-model="newsLead"
                    label="预览导语"
                    class="purple-input"
                  />
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="newsSource"
                    label="来源网址"
                    class="purple-input"
                  />
                </v-col>

                <v-col cols="12">
                  <v-menu
                    v-model="releaseMenu"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="newsReleaseDate"
                        label="原文发布时间"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        class="purple-input"
                      />
                    </template>
                    <v-date-picker
                      v-model="newsReleaseDate"
                      @input="releaseMenu = false"
                    />
                  </v-menu>
                </v-col>

                <v-col cols="12">
                  <v-textarea
                    v-model="newsContent"
                    label="具体内容"
                    class="purple-input"
                    rows="10"
                  />
                </v-col>

                <v-col cols="12" class="text-right">
                  <v-btn color="success" class="mr-0"> 发布新闻 </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      newsTitle: '',
      newsCoverImage: null,
      newsTags: [],
      fixedTags: [],
      fixedTagsList: ['政治', '经济', '社会', '文化', '科技'],
      newsLead: '',
      newsSource: '',
      newsReleaseDate: null,
      releaseMenu: false,
      newsContent: '',
    };
  },
};
</script>
