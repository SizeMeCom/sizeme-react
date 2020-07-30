import SagaTester from "redux-saga-tester"
import { RootState } from "../index"
import systemReducer from "../system/reducers"
import profileReducer from "./reducers"
import { watchRequestProfileList, watchSelectProfile } from "./sagas"
import { getProfiles, selectProfile } from "./actions"
import * as api from "../../api/backend-api"
import { profile1, profile2, profileList } from "../../../fixtures/profiles"
import { RECEIVE_PROFILE_LIST, SELECT_PROFILE, SELECT_PROFILE_DONE } from "./types"
import authReducer from "../auth/reducers"
import { Reducer } from "redux"
import { SET_LOGGED_IN } from "../auth/types"
import { Measurements } from "../../api/types"

describe("Profiles", () => {
    describe("Profile lists", () => {
        let sagaTester: SagaTester<Partial<RootState>>
        beforeEach(() => {
            sagaTester = new SagaTester({
                initialState: {
                    profile: {
                        profileList: [],
                        selectedProfile: {
                            id: null,
                            selectDone: false,
                            measurements: {},
                            dirty: false
                        }
                    }
                },
                reducers: {
                    auth: authReducer as Reducer,
                    profile: profileReducer,
                    system: systemReducer
                }
            })
            jest.resetAllMocks()
        })

        it("fetches list of profiles", async () => {
            jest.spyOn(api, "getProfiles").mockResolvedValueOnce(profileList)
            sagaTester.start(watchRequestProfileList)
            sagaTester.dispatch(getProfiles())
            await sagaTester.waitFor(SET_LOGGED_IN)
            await sagaTester.waitFor(RECEIVE_PROFILE_LIST)
            expect(sagaTester.getState().profile?.profileList).toHaveLength(2)
            expect(sagaTester.getState().auth).toEqual({ loggedIn: true, resolved: true })
        })

        it("handles empty list of profiles", async () => {
            jest.spyOn(api, "getProfiles").mockResolvedValueOnce([])
            sagaTester.start(watchRequestProfileList)
            sagaTester.dispatch(getProfiles())
            await sagaTester.waitFor(SET_LOGGED_IN)
            await sagaTester.waitFor(RECEIVE_PROFILE_LIST)
            expect(sagaTester.getState().profile?.profileList).toHaveLength(0)
            expect(sagaTester.getState().auth).toEqual({ loggedIn: true, resolved: true })
        })

        it("handles signed out user", async () => {
            jest.spyOn(api, "getProfiles").mockResolvedValueOnce(null)
            sagaTester.start(watchRequestProfileList)
            sagaTester.dispatch(getProfiles())
            await sagaTester.waitFor(RECEIVE_PROFILE_LIST)
            expect(sagaTester.getState().profile?.profileList).toHaveLength(0)
            expect(sagaTester.getState().auth).toEqual({ loggedIn: false, resolved: true })
        })

        it("handles profile list error", async () => {
            jest.spyOn(api, "getProfiles").mockRejectedValueOnce(new Error("COMPUTER SAYS NO"))
            sagaTester.start(watchRequestProfileList)
            sagaTester.dispatch(getProfiles())
            await sagaTester.waitFor(RECEIVE_PROFILE_LIST)
            expect(sagaTester.getState().profile?.profileList).toHaveLength(0)
            expect(sagaTester.getState().auth).toEqual({ loggedIn: false, resolved: false })
            expect(sagaTester.getState().system?.error).not.toBeNull()
        })
    })

    describe("Select profile", () => {
        beforeEach(() => {
            localStorage.clear()
            sessionStorage.clear()
            jest.resetAllMocks()
        })
        it("does nothing when trying to select already selected profile", () => {
            const sagaTester = new SagaTester({
                initialState: {
                    profile: {
                        profileList: [profile1],
                        selectedProfile: {
                            id: "profile1",
                            selectDone: false,
                            measurements: {},
                            dirty: false
                        }
                    }
                },
                reducers: {
                    profile: profileReducer,
                    system: systemReducer
                }
            })
            sagaTester.start(watchSelectProfile)
            sagaTester.dispatch(selectProfile("profile1"))
            expect(sagaTester.getCalledActions()).toHaveLength(1)
            expect(sagaTester.getLatestCalledAction()).toEqual({ type: SELECT_PROFILE, payload: "profile1" })
        })

        it("selects default profile w/o measurements when no profiles or stored measurements", async () => {
            const sagaTester = new SagaTester({
                initialState: {
                    profile: {
                        profileList: [],
                        selectedProfile: {
                            id: null,
                            selectDone: false,
                            measurements: {},
                            dirty: false
                        }
                    }
                },
                reducers: {
                    profile: profileReducer,
                    system: systemReducer
                }
            })
            sagaTester.start(watchSelectProfile)
            sagaTester.dispatch(selectProfile(null))
            await sagaTester.waitFor(SELECT_PROFILE_DONE)
            expect(sagaTester.getState().profile.selectedProfile).toEqual({
                id: null,
                gender: "female",
                profileName: "My profile",
                selectDone: true,
                measurements: {},
                dirty: false
            })
        })

        it("selects default profile w/o measurements when no profiles and corrupted stored measurements", async () => {
            const sagaTester = new SagaTester({
                initialState: {
                    profile: {
                        profileList: [],
                        selectedProfile: {
                            id: null,
                            selectDone: false,
                            measurements: {},
                            dirty: false
                        }
                    }
                },
                reducers: {
                    profile: profileReducer,
                    system: systemReducer
                }
            })
            localStorage.setItem("sizemeMeasurements", "this ain't json")
            sagaTester.start(watchSelectProfile)
            sagaTester.dispatch(selectProfile(null))
            await sagaTester.waitFor(SELECT_PROFILE_DONE)
            expect(sagaTester.getState().profile.selectedProfile).toEqual({
                id: null,
                gender: "female",
                profileName: "My profile",
                selectDone: true,
                measurements: {},
                dirty: false
            })
        })

        it("selects default profile with measurements when no profiles and stored measurements", async () => {
            const sagaTester = new SagaTester({
                initialState: {
                    profile: {
                        profileList: [],
                        selectedProfile: {
                            id: null,
                            selectDone: false,
                            measurements: {},
                            dirty: false
                        }
                    }
                },
                reducers: {
                    profile: profileReducer,
                    system: systemReducer
                }
            })
            const measurements: Measurements = {
                chest: 120
            }
            localStorage.setItem("sizemeMeasurements", JSON.stringify(measurements))
            sagaTester.start(watchSelectProfile)
            sagaTester.dispatch(selectProfile(null))
            await sagaTester.waitFor(SELECT_PROFILE_DONE)
            expect(sagaTester.getState().profile.selectedProfile).toEqual({
                id: null,
                gender: "female",
                profileName: "My profile",
                selectDone: true,
                measurements: measurements,
                dirty: false
            })
        })

        it("selects the first profile from list if no profile is defined or saved", async () => {
            const sagaTester = new SagaTester({
                initialState: {
                    profile: {
                        profileList: [profile1, profile2],
                        selectedProfile: {
                            id: null,
                            selectDone: false,
                            measurements: {},
                            dirty: false
                        }
                    }
                },
                reducers: {
                    profile: profileReducer,
                    system: systemReducer
                }
            })
            const measurements: Measurements = {
                chest: 120
            }
            localStorage.setItem("sizemeMeasurements", JSON.stringify(measurements))
            sagaTester.start(watchSelectProfile)
            sagaTester.dispatch(selectProfile(null))
            await sagaTester.waitFor(SELECT_PROFILE_DONE)
            expect(sagaTester.getState().profile.selectedProfile).toEqual({
                id: profile1.id,
                gender: profile1.gender,
                profileName: profile1.profileName,
                selectDone: true,
                measurements: profile1.measurements,
                dirty: false
            })
            expect(localStorage.getItem("sizemeMeasurements")).toBeNull()
        })

        it("selects the first profile from list if unknown profile id is defined", async () => {
            const sagaTester = new SagaTester({
                initialState: {
                    profile: {
                        profileList: [profile1, profile2],
                        selectedProfile: {
                            id: null,
                            selectDone: false,
                            measurements: {},
                            dirty: false
                        }
                    }
                },
                reducers: {
                    profile: profileReducer,
                    system: systemReducer
                }
            })
            sagaTester.start(watchSelectProfile)
            sagaTester.dispatch(selectProfile("unknown"))
            await sagaTester.waitFor(SELECT_PROFILE_DONE)
            expect(sagaTester.getState().profile.selectedProfile).toEqual({
                id: profile1.id,
                gender: profile1.gender,
                profileName: profile1.profileName,
                selectDone: true,
                measurements: profile1.measurements,
                dirty: false
            })
        })

        it("selects the project by provided profile id", async () => {
            const sagaTester = new SagaTester({
                initialState: {
                    profile: {
                        profileList: [profile2, profile1],
                        selectedProfile: {
                            id: null,
                            selectDone: false,
                            measurements: {},
                            dirty: false
                        }
                    }
                },
                reducers: {
                    profile: profileReducer,
                    system: systemReducer
                }
            })
            const measurements: Measurements = {
                chest: 120
            }
            localStorage.setItem("sizemeMeasurements", JSON.stringify(measurements))
            sagaTester.start(watchSelectProfile)
            sagaTester.dispatch(selectProfile("profile1"))
            await sagaTester.waitFor(SELECT_PROFILE_DONE)
            expect(sagaTester.getState().profile.selectedProfile).toEqual({
                id: profile1.id,
                gender: profile1.gender,
                profileName: profile1.profileName,
                selectDone: true,
                measurements: profile1.measurements,
                dirty: false
            })
            expect(sessionStorage.getItem("sizeme.selectedProfile")).toEqual("profile1")
            expect(localStorage.getItem("sizemeMeasurements")).toBeNull()
        })

        it("selects the project by stored profile id", async () => {
            const sagaTester = new SagaTester({
                initialState: {
                    profile: {
                        profileList: [profile2, profile1],
                        selectedProfile: {
                            id: null,
                            selectDone: false,
                            measurements: {},
                            dirty: false
                        }
                    }
                },
                reducers: {
                    profile: profileReducer,
                    system: systemReducer
                }
            })
            sessionStorage.setItem("sizeme.selectedProfile", "profile1")
            sagaTester.start(watchSelectProfile)
            sagaTester.dispatch(selectProfile(null))
            await sagaTester.waitFor(SELECT_PROFILE_DONE)
            expect(sagaTester.getState().profile.selectedProfile).toEqual({
                id: profile1.id,
                gender: profile1.gender,
                profileName: profile1.profileName,
                selectDone: true,
                measurements: profile1.measurements,
                dirty: false
            })
        })

        it("selects the project by stored profile id and appends locally defined measurements", async () => {
            const sagaTester = new SagaTester({
                initialState: {
                    profile: {
                        profileList: [profile2, profile1],
                        selectedProfile: {
                            id: null,
                            selectDone: false,
                            measurements: {},
                            dirty: false
                        }
                    }
                },
                reducers: {
                    profile: profileReducer,
                    system: systemReducer
                }
            })
            sessionStorage.setItem("sizeme.selectedProfile", "profile1")
            const measurements: Measurements = {
                chest: 120
            }
            localStorage.setItem("sizemeMeasurements", JSON.stringify(measurements))
            sagaTester.start(watchSelectProfile)
            sagaTester.dispatch(selectProfile(null))
            await sagaTester.waitFor(SELECT_PROFILE_DONE)
            expect(sagaTester.getState().profile.selectedProfile).toEqual({
                id: profile1.id,
                gender: profile1.gender,
                profileName: profile1.profileName,
                selectDone: true,
                measurements: {
                    ...profile1.measurements,
                    ...measurements
                },
                dirty: false
            })
        })
    })
})
