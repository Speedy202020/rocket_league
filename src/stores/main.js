import { defineStore } from "pinia";
import { ref, onMounted, onBeforeUnmount } from "vue";
import { createClient } from "@supabase/supabase-js";

export const useMainStore = defineStore('mainStore', () => {
    // Initialize Supabase client
    const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_KEY);
    const discord = ref(null)
    const user = ref(null);
    const opponents = ref(null)
    const loading = ref(true);

    const shots = ref([
        ...Array.from({ length: 169 }, (_, i) => String(i + 1)),
        '170+',
    ]);

    const checkUserInShots = async () => {
        return supabase
            .from('shots_with_user')
            .select('*')
            .eq('user_id', discord.value.user.id)
            .limit(1)
            .then(({ data, error }) => {
                if (error) {
                    throw error
                }
                return data[0]
            })
    };

    const getOpponents = async () => {
        return supabase
            .from('shots_with_user')
            .select('*')
            // .neq('user_id', discord.value.user.id)
            .then(({ data, error }) => {
                if (error) {
                    throw error
                }
                console.log('data', data)
                return data
            })
    };

    const createUserInShots = async (username) => {
        return supabase
            .from('shots')
            .insert([{ hitted: [], user_id: discord.value.user.id }])
            .select()
            .then(({ data, error }) => {
                if (error) {
                    throw error
                }
                return data[0]
            })
    };

    async function discordLogin() {
        await supabase.auth.signInWithOAuth({
            provider: 'discord',
        });
    };

    async function discordLogout() {
        await supabase.auth.signOut();
    };

    async function addShot() {
        return supabase
            .from('shots')
            .update([{ hitted: user.value.hitted }])
            .eq('user_id', discord.value.user.id)
            .select()
    }

    supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('!!!!EVENT', event)
        switch (event) {
            case 'SIGNED_IN':
                discord.value = session;

                checkUserInShots()
                    .then(data => {
                        if (data) {
                            user.value = data
                        } else {
                            return createUserInShots()
                                .then(data => {
                                    user.value = data
                                })
                        }

                        return getOpponents()
                            .then(data => {
                                opponents.value = data
                            })
                    })
                    .catch(error => {
                        console.error('Error for user in shots table:', error.message);
                    });

                loading.value = false;
                break;

            case 'INITIAL_SESSION':
                if (session && session.user) {
                    console.log('Initial session loaded:', session);
                } else {
                    console.log('No session');
                }
                loading.value = false;
                break;

            case 'SIGNED_OUT':
                console.log('User signed out');
                user.value = discord.value = null;
                loading.value = false;
                break;

            case 'ERROR':
                console.error('Authentication error:', session.error.message);
                break;

            default:
                console.log('Unknown auth event:', event);
                break;
        }
    });

    onMounted(() => {
        const channel = supabase
            .channel('shots-updates')
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'shots',
                },
                (payload) => {
                    const updatedPlayer = payload.new;
                    const index = opponents.value.findIndex(p => p.user === updatedPlayer.user);
                    if (index !== -1) {
                        opponents.value[index] = updatedPlayer;
                    } else {
                        opponents.value.push(updatedPlayer);
                    }
                }
            )
            .subscribe();

        onBeforeUnmount(() => {
            supabase.removeChannel(channel);
        });
    });

    return { shots, user, opponents, discord, loading, discordLogin, discordLogout, addShot };
});
