<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
import { DictAPI } from "./interfaces";

const apiResult = ref<DictAPI>();
const keyword = ref("");
const apiEndpoint = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const alert_user = ref();
const current_theme = ref("");

const themeToggle = () => {
  if (localStorage.getItem("theme") == "dark") {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
    current_theme.value = "light";
  } else {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
    current_theme.value = "dark";
  }
};

const search = async () => {
  await axios
    .get(`${apiEndpoint}${keyword.value}`)
    .then((res) => {
      apiResult.value = res.data[0];
      console.log("status is: ", res.status);
      alert_user.value = false;
    })
    .catch((err) => {
      console.log("err: ", err);
      alert_user.value = true;
    });
};
const playAudio = () => {
  let audio = new Audio();
  apiResult.value?.phonetics.forEach((element) => {
    if (element.audio.includes("uk") || element.audio.includes("us")) {
      audio.src = element.audio;
      return;
    }
  });
  audio.play();
};
</script>

<template>
  <div
    class="dict-app-container h-screen w-screen bg-white dark:bg-main-dark overflow-y-auto"
  >
    <div class="dict-app flex flex-col mx-96 py-10 h-full">
      <nav class="flex justify-between">
        <div class="logo">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            class="dark:fill-gray-300"
          >
            <path
              d="M6 22h15v-2H6.012C5.55 19.988 5 19.805 5 19s.55-.988 1.012-1H21V4c0-1.103-.897-2-2-2H6c-1.206 0-3 .799-3 3v14c0 2.201 1.794 3 3 3zM5 8V5c0-.805.55-.988 1-1h13v12H5V8z"
            ></path>
            <path d="M8 6h9v2H8z"></path>
          </svg>
        </div>
        <div class="action">
          <div class="theme-switcher cursor-pointer" @click="themeToggle()">
            <svg
              v-if="current_theme == 'light'"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              class="dark:fill-white"
            >
              <path
                d="M20.742 13.045a8.088 8.088 0 0 1-2.077.271c-2.135 0-4.14-.83-5.646-2.336a8.025 8.025 0 0 1-2.064-7.723A1 1 0 0 0 9.73 2.034a10.014 10.014 0 0 0-4.489 2.582c-3.898 3.898-3.898 10.243 0 14.143a9.937 9.937 0 0 0 7.072 2.93 9.93 9.93 0 0 0 7.07-2.929 10.007 10.007 0 0 0 2.583-4.491 1.001 1.001 0 0 0-1.224-1.224zm-2.772 4.301a7.947 7.947 0 0 1-5.656 2.343 7.953 7.953 0 0 1-5.658-2.344c-3.118-3.119-3.118-8.195 0-11.314a7.923 7.923 0 0 1 2.06-1.483 10.027 10.027 0 0 0 2.89 7.848 9.972 9.972 0 0 0 7.848 2.891 8.036 8.036 0 0 1-1.484 2.059z"
              ></path>
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              class="fill-yellow-500"
            >
              <path
                d="M6.995 12c0 2.761 2.246 5.007 5.007 5.007s5.007-2.246 5.007-5.007-2.246-5.007-5.007-5.007S6.995 9.239 6.995 12zM11 19h2v3h-2zm0-17h2v3h-2zm-9 9h3v2H2zm17 0h3v2h-3zM5.637 19.778l-1.414-1.414 2.121-2.121 1.414 1.414zM16.242 6.344l2.122-2.122 1.414 1.414-2.122 2.122zM6.344 7.759 4.223 5.637l1.415-1.414 2.12 2.122zm13.434 10.605-1.414 1.414-2.122-2.122 1.414-1.414z"
              ></path>
            </svg>
          </div>
        </div>
      </nav>
      <div class="dict-body mt-10">
        <div class="search-container w-full">
          <div
            class="search w-full bg-gray-200 dark:bg-secondary flex justify-between items-center rounded-xl px-2"
          >
            <input
              type="text"
              class="w-full p-3 bg-transparent outline-none text-xl dark:text-white"
              placeholder="Enter word here to search it..."
              @keyup.enter="search()"
              v-model="keyword"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              class="fill-purple-500 cursor-pointer"
              @click="search()"
            >
              <path
                d="M10 18a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A7.952 7.952 0 0 0 18 10c0-4.411-3.589-8-8-8s-8 3.589-8 8 3.589 8 8 8zm0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6-6-2.691-6-6 2.691-6 6-6z"
              ></path>
            </svg>
          </div>
        </div>
        <div class="word-container mt-10">
          <h1
            class="text-4xl text-center text-purple-700 dark:text-gray-300"
            v-if="apiResult == undefined && alert_user != true"
          >
            Please enter one word to start.
          </h1>
          <div v-else-if="alert_user == true" class="text-center text-red-500">
            <h1 class="text-4xl">Not Found.</h1>
            <p class="text-2xl">Please try another word.</p>
          </div>
          <div class="word-data" v-else-if="apiResult != undefined">
            <div class="word-and-audioplay flex justify-between items-center">
              <div class="text-container dark:text-white">
                <h1 class="text-6xl">
                  {{
                    apiResult.word.charAt(0).toUpperCase() +
                    apiResult.word.slice(1)
                  }}
                </h1>
                <p class="text-2xl text-purple-500 mt-1">
                  {{ apiResult.phonetic }}
                </p>
              </div>
              <div
                class="audioplay bg-purple-500 bg-opacity-20 p-5 rounded-full text-purple-600 cursor-pointer hover:bg-opacity-30"
                @click="playAudio"
              >
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="42"
                    height="42"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M7 6v12l10-6z"></path>
                  </svg>
                </div>
              </div>
            </div>
            <div class="noun-container">
              <div class="noun flex items-center gap-3 mt-5">
                <p class="font-bold text-lg dark:text-gray-300">noun</p>
                <div class="h-[1px] bg-gray-300 w-full"></div>
              </div>
              <div class="meaning mt-1">
                <p class="text-gray-500">Meaning</p>
                <div class="pl-10 mt-2">
                  <ul class="list-disc">
                    <template v-for="meaning in apiResult.meanings">
                      <li
                        v-for="def in meaning.definitions"
                        v-if="meaning.partOfSpeech == 'noun'"
                        class="my-3 dark:text-gray-300"
                      >
                        {{ def.definition }}
                      </li>
                    </template>
                  </ul>
                  <div class="synonyms-container flex">
                    <div>
                      <span class="text-gray-500"> Synonyms </span>
                      <template v-for="synms in apiResult.meanings">
                        <template v-for="syn in synms.synonyms">
                          <span class="text-purple-500 font-bold">
                            {{ syn }}<span>, </span>
                          </span>
                        </template>
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="verb-container">
              <div class="verb flex items-center gap-3 mt-5">
                <p class="font-bold text-lg dark:text-gray-300">veb</p>
                <div class="h-[1px] bg-gray-300 w-full"></div>
              </div>
              <div class="pl-10 mt-2">
                <ul class="list-disc">
                  <template v-for="meaning in apiResult.meanings">
                    <li
                      v-for="def in meaning.definitions"
                      v-if="meaning.partOfSpeech == 'verb'"
                      class="my-3 dark:text-gray-300"
                    >
                      {{ def.definition }}
                    </li>
                  </template>
                </ul>
                <div class="synonyms-container flex">
                  <div>
                    <template v-for="meaning in apiResult.meanings">
                      <div v-for="def in meaning.definitions">
                        <span class="text-gray-500 dark:text-gray-300"
                          >{{ def.example }}
                        </span>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
            </div>
            <div class="h-[1px] bg-gray-300 w-full mt-3"></div>
            <div class="source flex gap-3 py-5 pb-10">
              <span class="text-gray-500 dark:text-gray-400">Source</span>
              <template v-for="source in apiResult.sourceUrls">
                <div>
                  <a
                    :href="source"
                    target="_blank"
                    class="underline dark:text-gray-300"
                    >{{ source }}</a
                  >
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
