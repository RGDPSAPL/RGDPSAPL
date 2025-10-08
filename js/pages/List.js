import { store } from "../main.js";
import { embed } from "../util.js";
import { score } from "../score.js";
import { fetchEditors, fetchList } from "../content.js";

import Spinner from "../components/Spinner.js";
import LevelAuthors from "../components/List/LevelAuthors.js";

const roleIconMap = {
    owner: "crown",
    admin: "user-gear",
    helper: "user-shield",
    dev: "code",
    trial: "user-lock",
};

export default {
    components: { Spinner, LevelAuthors },
    template: `
        <main v-if="loading">
            <Spinner></Spinner>
        </main>
        <main v-else class="page-list">
            <div class="list-container">
                <table class="list" v-if="list">
                    <tr v-for="([level, err], i) in list">
                        <td class="rank">
                            <p v-if="i + 1 <= 30" class="type-label-lg">#{{ i + 1 }}</p>
                            <p v-else class="type-label-lg">Legacy</p>
                        </td>
                        <td class="level" :class="{ 'active': selected == i, 'error': !level }">
                            <button @click="selected = i">
                                <span class="type-label-lg">{{ level?.name || \`Error (\${err}.json)\` }}</span>
                            </button>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="level-container">
                <div class="level" v-if="level">
                    <h1>{{ level.name }}</h1>
                    <LevelAuthors :author="level.author" :creators="level.creators" :verifier="level.verifier"></LevelAuthors>
                    <iframe class="video" id="videoframe" :src="video" frameborder="0"></iframe>
                    <ul class="stats">
                        <li>
                            <div class="type-title-sm">Points when completed</div>
                            <p>{{ score(selected + 1, 100, level.percentToQualify) }}</p>
                        </li>
                        <li>
                            <div class="type-title-sm">ID</div>
                            <p>{{ level.id }}</p>
                        </li>
                    </ul>
                    <h2>Records</h2>
                    <p v-if="selected + 1 <= 75"><strong>{{ level.percentToQualify }}%</strong> or better to qualify</p>
                    <p v-else-if="selected +1 <= 150"><strong>100%</strong> or better to qualify</p>
                    <p v-else>This level does not accept new records.</p>
                    <table class="records">
                        <tr v-for="record in level.records" class="record">
                            <td class="percent">
                                <p>{{ record.percent }}%</p>
                            </td>
                            <td class="user">
                                <a :href="record.link" target="_blank" class="type-label-lg">{{ record.user }}</a>
                            </td>
                            <td class="mobile">
                                <img v-if="record.mobile" :src="\`/assets/phone-landscape\${store.dark ? '-dark' : ''}.svg\`" alt="Mobile">
                            </td>
                            <td class="hz">
                                <p>{{ record.hz }}Hz</p>
                            </td>
                        </tr>
                    </table>
                </div>
                <div v-else class="level" style="height: 100%; justify-content: center; align-items: center;">
                    <p>(ノಠ益ಠ)ノ彡┻━┻</p>
                </div>
            </div>
            <div class="meta-container">
                <div class="meta">
                    <div class="errors" v-show="errors.length > 0">
                        <p class="error" v-for="error of errors">{{ error }}</p>
                    </div>
                    <div class="og">
                        <p class="type-label-md">Website layout made by <a href="https://tsl.pages.dev/" target="_blank">TheShittyList</a></p>
                    </div>
                    <template v-if="editors">
                        <h3>List Editors</h3>
                        <ol class="editors">
                            <li v-for="editor in editors">
                                <img :src="\`/assets/\${roleIconMap[editor.role]}\${store.dark ? '-dark' : ''}.svg\`" :alt="editor.role">
                                <a v-if="editor.link" class="type-label-lg link" target="_blank" :href="editor.link">{{ editor.name }}</a>
                                <p v-else>{{ editor.name }}</p>
                            </li>
                        </ol>
                    </template>
                    <h3>Submission Requirements</h3>
                    <p>
                    The video requires you to include: CPS Counter, Attempt Counter, Cheat Indicator, Session Time counter (not necessary, but adds more legitimacy to the run), FPS Counter and, if run is made on Noclip, Noclip Accuracy and Noclip Deaths counter.
                    </p>
                    <p>
                    The video quality has to be between 480p to 720p and between 40 to 60 FPS.
                    </p>
                    <p>
                    The user also HAS to include ALL the attempts (including copies).
                    </p>
                    <p>
                    The video REQUIRES a microphone usage. It may not be required after the user proves that he can't use it or if he shows all the progress on the level.
                    </p>
                    <p>
                    Allowed FPS values stand between 30 to 240 FPS.
                    </p>
                    <p>
                    Achieved the record without using hacks. (Pretty self-explainatory)
                    </p>
                    <p>
                    Achieved the record on the level that is listed on the site
                    </p>
                    <p>
                    Have either source audio or clicks/taps in the video. Edited audio only does not count
                    </p>
                    <p>
                    Once a level falls onto the Legacy List, we accept records for it for 24 hours after it falls off, then afterwards we never accept records for said level
                    </p>
                    <p>
                    The recording must also show the player hit the endwall, or the completion will be invalidated.
                    </p>
                    <p>
                    Do not use secret routes or bug routes
                    </p>
                    <p>
                    Do not use easy modes, only a record of the unmodified level qualifies
                    </p>
                    <p>
                    CBF is allowed due to many people using it.
                    </p>
                    <p>
                    PlatformerSaves mod usage is also allowed.
                    </p>
                    <p>
                    Record requires both raw, unedited version and edited version (excluding the records that are legitimate or old ones). Both video versions HAVE to be posted only on YouTube or through Google Drive.
                    </p>
                    <p>
                    Copies (ULDM and StartPos versions) are allowed, but ONLY after they get accepted by owner or moderator. Questions about copies can be asked in our Discord Server!
                    </p>
                    <p>
                    All the record submissions take from 1 hour to 7 days. If the wait time is longer then it means we're not sure of the legitimacy of the level and we need to talk it over. The maximum wait time is 14 days. If the record doesn't get accepted in this time then it means it hasn't been accepted. We'll inform you on Discord.
                    </p>
                    <p>
                    If the record has been proven illegitimate (while verifying it or after it gets accepted), the user gets one warning (and the record gets taken off if it was already accepted). You can find the warned user list on our Discord server!
                    </p>
                    <p>
                    Trolling (Sending purposefully hacked videos), spam submitting records, demanding to speed-up the submission process, etc. will result in a timed ban from submitting (from 1 to 7 days; the ban means that you can see the list and "submit" the record, but it's going to get INSTANTLY rejected).
                    </p>
                    <p>
                    The video (if proven hacked) may be sent to RGDPS moderators, what might result in your RGDPS account getting banned.
                    </p>
                    <p>
                    Breaking any rule will result in a punishment.
                    </p>
                    <p>
                    If you have any additional questions or concerns regarding the record submission - contact us in our Discord server!
                    </p>
                    <p>
                    The video (if proven hacked) may be sent to RGDPS moderators, what might result in your RGDPS account getting banned.
                    </p>
                    <p>
                    The video (if proven hacked) may be sent to RGDPS moderators, what might result in your RGDPS account getting banned.
                    </p>
                </div>
            </div>
        </main>
    `,
    data: () => ({
        list: [],
        editors: [],
        loading: true,
        selected: 0,
        errors: [],
        roleIconMap,
        store
    }),
    computed: {
        level() {
            return this.list[this.selected][0];
        },
        video() {
            if (!this.level.showcase) {
                return embed(this.level.verification);
            }

            return embed(
                this.toggledShowcase
                    ? this.level.showcase
                    : this.level.verification
            );
        },
    },
    async mounted() {
        // Hide loading spinner
        this.list = await fetchList();
        this.editors = await fetchEditors();

        // Error handling
        if (!this.list) {
            this.errors = [
                "Failed to load list. Retry in a few minutes or notify list staff.",
            ];
        } else {
            this.errors.push(
                ...this.list
                    .filter(([_, err]) => err)
                    .map(([_, err]) => {
                        return `Failed to load level. (${err}.json)`;
                    })
            );
            if (!this.editors) {
                this.errors.push("Failed to load list editors.");
            }
        }

        this.loading = false;
    },
    methods: {
        embed,
        score,
    },
};
