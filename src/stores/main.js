import { defineStore } from "pinia";
import { ref } from "vue";
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

    const checkUserInShots = async (username) => {
        return supabase
            .from('shots')
            .select('*')
            .eq('user', username)
            .limit(1)
            .then(({ data, error }) => {
                if (error) {
                    throw error
                }
                return data[0]
            })
    };

    const getOpponents = async (username) => {
        return supabase
            .from('shots')
            .select('*')
            .neq('user', username)
            .then(({ data, error }) => {
                if (error) {
                    throw error
                }
                return data
            })
    };

    const createUserInShots = async (username) => {
        return supabase
            .from('shots')
            .insert([{ user: username, hitted: [] }])
            .select()
            .then(({ data, error }) => {
                console.log('data in fn', data)
                console.log('error in fn', error)
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

    supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('!!!!EVENT', event)
        switch (event) {
            case 'SIGNED_IN':
                discord.value = session.user;
                const username = discord.value.user_metadata.full_name;

                checkUserInShots(username)
                    .then((data) => {
                        if (data) {
                            user.value = data
                        } else {
                            return createUserInShots(username)
                                .then(data => {
                                    user.value = data
                                })
                        }

                        return getOpponents(username)
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

    async function addShot() {
        return supabase
            .from('shots')
            .update([{ hitted: user.value.hitted }])
            .eq('user', user.value.user)
            .select()
    }

    return { shots, user, opponents, discord, loading, discordLogin, discordLogout, addShot };
});
